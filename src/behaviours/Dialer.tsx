import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { webSockets } from "@libp2p/websockets";
import { Multiaddr, multiaddr } from "@multiformats/multiaddr";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import { createLibp2p, Libp2p } from "libp2p";
import { useEffect, useState } from "react";
import { LogMessage } from "src/App.tsx";

async function init() {
  const node = await createLibp2p({
    transports: [webSockets()],
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
  });
  return node;
}

async function start(
  node: Libp2p,
  autoRelayMultiaddr: Multiaddr,
  logMessage: LogMessage,
) {
  const conn = await node.dial(autoRelayMultiaddr);
  const hasConnected = conn === null || conn === undefined ? false : true;
  if (hasConnected)
    logMessage(`Connected to the relay ${conn.remotePeer.toString()}`);
  return hasConnected;
}

interface DialerProps {
  node: Libp2p | null;
  setNode: React.Dispatch<React.SetStateAction<Libp2p | null>>;
  setLog: React.Dispatch<React.SetStateAction<string>>;
}

export default function Dialer({ node, setNode, setLog }: DialerProps) {
  const logMessage: LogMessage = (...messages: string[]) => {
    const combinedMessage = messages.join("\n");
    setLog((log) => `${log}\n${combinedMessage}`);
  };

  const [isConnected, setIsConnected] = useState<boolean>();
  const [autoRelayMultiaddrAsString, setAutoRelayMultiaddrAsString] =
    useState<string>("");

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

  async function setAutoRelayMultiaddr() {
    if (node === null || autoRelayMultiaddrAsString === "") {
      return;
    }
    try {
      const autoRelayMultiaddr = multiaddr(autoRelayMultiaddrAsString.trim());
      const hasConnected = await start(node, autoRelayMultiaddr, logMessage);
      if (hasConnected) setIsConnected(true);
    } catch (e) {
      logMessage(`Invalid multiaddress`);
      return;
    }
  }

  return (
    <Box flexDirection="column">
      {!isConnected && (
        <Box flexDirection="column">
          <Text>
            Type the multiaddress of the relay whom you wish to connect:
          </Text>
          <TextInput
            value={autoRelayMultiaddrAsString}
            onChange={(value) => setAutoRelayMultiaddrAsString(value)}
            onSubmit={() => setAutoRelayMultiaddr()}
          />
        </Box>
      )}
    </Box>
  );
}
