import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { circuitRelayServer } from "@libp2p/circuit-relay-v2";
import { identify } from "@libp2p/identify";
import { webSockets } from "@libp2p/websockets";
import { Box, Text } from "ink";
import { createLibp2p, Libp2p } from "libp2p";
import { useEffect } from "react";
import { LogMessage } from "src/App.tsx";

async function init() {
  const node = await createLibp2p({
    start: true,
    addresses: {
      listen: ["/ip4/0.0.0.0/tcp/8091/ws"],
      // TODO check "What is next?" section
      // announce: ['/dns4/auto-relay.libp2p.io/tcp/443/wss/p2p/QmWDn2LY8nannvSWJzruUYoLZ4vV83vfCBwd8DipvdgQc3']
    },
    transports: [webSockets()],
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
    services: {
      identify: identify(),
      relay: circuitRelayServer(),
    },
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
      const node = await init();
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
