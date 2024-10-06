import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { mdns } from "@libp2p/mdns";
import { tcp } from "@libp2p/tcp";
import { Box, Text } from "ink";
import { createLibp2p, Libp2p } from "libp2p";
import { useEffect } from "react";
import { LogMessage } from "src/App.tsx";

async function init() {
  const node = await createLibp2p({
    addresses: {
      listen: ["/ip4/0.0.0.0/tcp/0"],
    },
    transports: [tcp()],
    streamMuxers: [yamux()],
    connectionEncrypters: [noise()],
    peerDiscovery: [
      mdns({
        interval: 20e3,
      }),
    ],
  });
  return node;
}

function start(node: Libp2p, logMessage: LogMessage) {
  node.addEventListener("peer:discovery", (evt) => {
    logMessage("Discovered: ", evt.detail.id.toString());
  });

  node.addEventListener("peer:connect", (evt) => {
    logMessage("Connected to: ", evt.detail.toString());
  });
}

interface MDNSProps {
  node: Libp2p | null;
  setNode: React.Dispatch<React.SetStateAction<Libp2p | null>>;
  setLog: React.Dispatch<React.SetStateAction<string>>;
}

export default function MDNS({ node, setNode, setLog }: MDNSProps) {
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
