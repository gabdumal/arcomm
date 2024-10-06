import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { tcp } from "@libp2p/tcp";
import { multiaddr, Multiaddr } from "@multiformats/multiaddr";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import { lpStream } from "it-length-prefixed-stream";
import { createLibp2p, Libp2p } from "libp2p";
import { useEffect, useState } from "react";
import { LogMessage } from "src/App.tsx";

const REQ_RESP_PROTOCOL = "/request-response/1.0.0";

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
}

async function run(
  node: Libp2p,
  remoteMultiaddress: Multiaddr,
  logMessage: LogMessage,
) {
  const stream = await node.dialProtocol(remoteMultiaddress, REQ_RESP_PROTOCOL);

  // lpStream lets us read/write in a predetermined order
  const lp = lpStream(stream);

  // send the query
  await lp.write(
    new TextEncoder().encode(
      JSON.stringify({
        question: "What is the air-speed velocity of an unladen swallow?",
      }),
    ),
  );

  // read the response
  const res = await lp.read();
  const output = JSON.parse(new TextDecoder().decode(res.subarray()));

  logMessage(`The answer is: "${output.answer}"`);
}

interface LocalProps {
  node: Libp2p | null;
  setNode: React.Dispatch<React.SetStateAction<Libp2p | null>>;
  setLog: React.Dispatch<React.SetStateAction<string>>;
}

export default function Local({ node, setNode, setLog }: LocalProps) {
  const logMessage: LogMessage = (...messages: string[]) => {
    const combinedMessage = messages.join("\n");
    setLog((log) => `${log}\n${combinedMessage}`);
  };

  const [remoteMultiaddrAsString, setRemoteMultiaddrAsString] =
    useState<string>("");

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

  function sendMessage() {
    if (node === null || remoteMultiaddrAsString === "") {
      return;
    }
    try {
      const remoteMultiaddr = multiaddr(remoteMultiaddrAsString.trim());
      setRemoteMultiaddrAsString("");
      run(node, remoteMultiaddr, logMessage);
    } catch (e) {
      logMessage(`Invalid multiaddress`);
      return;
    }
  }

  return (
    <Box flexDirection="column">
      <Text>Type the multiaddress of the relay whom you wish to connect:</Text>
      <TextInput
        value={remoteMultiaddrAsString}
        onChange={(value) => setRemoteMultiaddrAsString(value)}
        onSubmit={() => sendMessage()}
      />
    </Box>
  );
}
