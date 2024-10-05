import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { bootstrap } from "@libp2p/bootstrap";
import { identify } from "@libp2p/identify";
import { kadDHT, removePublicAddressesMapper } from "@libp2p/kad-dht";
import { webSockets } from "@libp2p/websockets";
import { Box, Text } from "ink";
import { createLibp2p, Libp2p } from "libp2p";
import { useEffect } from "react";
import { LogMessage } from "src/App.tsx";
import bootstrappers from "./bootstrappers.ts";

async function init() {
  const node = await createLibp2p({
    start: false,
    addresses: {
      listen: [`/ip4/127.0.0.1/tcp/0/ws`],
    },
    transports: [webSockets()],
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
    peerDiscovery: [
      bootstrap({
        list: bootstrappers,
      }),
    ],
    services: {
      kadDHT: kadDHT({
        protocol: "/ipfs/lan/kad/1.0.0",
        peerInfoMapper: removePublicAddressesMapper,
        clientMode: false,
      }),
      identify: identify(),
    },
  });
  return node;
}

function start(node: Libp2p, logMessage: LogMessage) {
  node.start();

  node.addEventListener("peer:discovery", (evt) => {
    logMessage("Discovered: ", evt.detail.id.toString());
  });

  node.addEventListener("peer:connect", (evt) => {
    logMessage("Connected to: ", evt.detail.toString());
  });
}

interface CommonProps {
  node: Libp2p | null;
  setNode: React.Dispatch<React.SetStateAction<Libp2p | null>>;
  setLog: React.Dispatch<React.SetStateAction<string>>;
}

export default function Common({ node, setNode, setLog }: CommonProps) {
  const logMessage: LogMessage = (...messages: string[]) => {
    const combinedMessage = messages.join("\n");
    setLog((log) => `${log}\n${combinedMessage}`);
  };

  useEffect(() => {
    const initializeNode = async () => {
      const node = await init();
      setNode(node);
      start(node, logMessage);
    };
    initializeNode();
  }, []);

  if (node === null) {
    return (
      <Box>
        <Text>Initializing...</Text>
      </Box>
    );
  }

  return <Box></Box>;
}
