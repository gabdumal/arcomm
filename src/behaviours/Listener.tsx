import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { identify } from "@libp2p/identify";
import { webSockets } from "@libp2p/websockets";
import { multiaddr, Multiaddr } from "@multiformats/multiaddr";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import { createLibp2p, Libp2p } from "libp2p";
import { useEffect, useState } from "react";
import { LogMessage } from "src/App.tsx";

async function init() {
  const node = await createLibp2p({
    transports: [
      webSockets(),
      circuitRelayTransport({
        discoverRelays: 2,
      }),
    ],
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
    services: {
      identify: identify(),
    },
  });
  return node;
}

async function start(
  node: Libp2p,
  relayMultiaddr: Multiaddr,
  logMessage: LogMessage,
) {
  const conn = await node.dial(relayMultiaddr);

  logMessage(`Connected to the relay ${conn.remotePeer.toString()}`);

  // Wait for connection and relay to be bind for the example purpose
  node.addEventListener("self:peer:update", (evt) => {
    // Updated self multiaddrs?
    const multiaddrs = node.getMultiaddrs();
    if (!multiaddrs) {
      logMessage(`No multiaddrs available`);
      return;
    }
    const relayMultiaddr = multiaddrs[0];
    if (!relayMultiaddr) {
      logMessage(`No relay multiaddr available`);
      return;
    }
    logMessage(
      `Advertising with a relay address of ${relayMultiaddr.toString()}`,
    );
  });

  return conn;
}

interface ListenerProps {
  node: Libp2p | null;
  setNode: React.Dispatch<React.SetStateAction<Libp2p | null>>;
  setLog: React.Dispatch<React.SetStateAction<string>>;
}

export default function Listener({ node, setNode, setLog }: ListenerProps) {
  const logMessage: LogMessage = (...messages: string[]) => {
    const combinedMessage = messages.join("\n");
    setLog((log) => `${log}\n${combinedMessage}`);
  };

  const [isConnected, setIsConnected] = useState<boolean>();
  const [relayMultiaddrAsString, setRelayMultiaddrAsString] =
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

  async function setRelayMultiaddr() {
    if (node === null || relayMultiaddrAsString === "") {
      return;
    }
    try {
      const relayMultiaddr = multiaddr(relayMultiaddrAsString.trim());
      const conn = await start(node, relayMultiaddr, logMessage);
      if (conn) setIsConnected(true);
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
            value={relayMultiaddrAsString}
            onChange={(value) => setRelayMultiaddrAsString(value)}
            onSubmit={() => setRelayMultiaddr()}
          />
        </Box>
      )}
    </Box>
  );
}
