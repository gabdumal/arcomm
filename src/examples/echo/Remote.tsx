import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { tcp } from "@libp2p/tcp";
import { Box, Text } from "ink";
import { pipe } from "it-pipe";
import { createLibp2p, Libp2p } from "libp2p";
import { useEffect } from "react";
import { LogMessage } from "src/App.tsx";

async function init() {
  return await createLibp2p({
    addresses: {
      listen: ["/ip4/0.0.0.0/tcp/0"],
    },
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
    transports: [tcp()],
  });
}

async function start(node: Libp2p, logMessage: LogMessage) {
  logMessage("Starting node with peer ID: ", node.peerId.toString());

  node.addEventListener("peer:discovery", (evt) => {
    logMessage("Discovered: ", evt.detail.id.toString());
  });

  node.addEventListener("peer:connect", (evt) => {
    logMessage("Connected to: ", evt.detail.toString());
  });

  await node.handle(ECHO_PROTOCOL, ({ stream }) => {
    // Pipe the stream output back to the stream input
    pipe(stream, stream);
  });
}

const ECHO_PROTOCOL = "/echo/1.0.0";

interface RemoteProps {
  node: Libp2p | null;
  setNode: React.Dispatch<React.SetStateAction<Libp2p | null>>;
  setLog: React.Dispatch<React.SetStateAction<string>>;
}

export default function Remote({ node, setNode, setLog }: RemoteProps) {
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
