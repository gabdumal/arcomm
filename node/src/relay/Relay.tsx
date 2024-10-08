import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { circuitRelayServer } from "@libp2p/circuit-relay-v2";
import { identify } from "@libp2p/identify";
import { webSockets } from "@libp2p/websockets";
import { Box, Text } from "ink";
import { createLibp2p, Libp2p } from "libp2p";
import { useEffect } from "react";
import { LogMessage } from "src/App.tsx";
import addresses from "./addresses.json";

async function init(logMessage: LogMessage) {
  const node = await createLibp2p({
    start: true,
    addresses: {
      listen: addresses,
    },
    transports: [webSockets()],
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
    services: {
      identify: identify(),
      relay: circuitRelayServer(),
    },
  });

  node.addEventListener("peer:discovery", ({ detail }) => {
    logMessage(`Discovered: ${detail.id.toString()}`);
  });

  node.addEventListener("peer:connect", ({ detail }) => {
    logMessage(`Connected to: ${detail.toString()}`);
  });

  node.addEventListener("peer:disconnect", ({ detail }) => {
    logMessage(`Disconnected from: ${detail.toString()}`);
  });

  return node;
}

interface RelayProps {
  node: Libp2p | null;
  setNode: React.Dispatch<React.SetStateAction<Libp2p | null>>;
  setLog: React.Dispatch<React.SetStateAction<string>>;
}

export default function Relay({ node, setNode, setLog }: RelayProps) {
  const logMessage: LogMessage = (...messages: string[]) => {
    const combinedMessage = messages.join("\n");
    setLog((log) => `${log}\n${combinedMessage}`);
  };

  useEffect(() => {
    const initializeNode = async () => {
      const node = await init(logMessage);
      setNode(node);
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
