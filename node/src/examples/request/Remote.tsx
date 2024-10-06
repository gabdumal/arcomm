import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { tcp } from "@libp2p/tcp";
import { Box, Text } from "ink";
import { lpStream } from "it-length-prefixed-stream";
import { createLibp2p, Libp2p } from "libp2p";
import { useEffect } from "react";
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

async function run(node: Libp2p) {
  await node.handle(REQ_RESP_PROTOCOL, ({ stream }) => {
    Promise.resolve()
      .then(async () => {
        // lpStream lets us read/write in a predetermined order
        const lp = lpStream(stream);

        // read the incoming request
        const req = await lp.read();

        // deserialize the query
        const query = JSON.parse(new TextDecoder().decode(req.subarray()));

        if (
          query.question ===
          "What is the air-speed velocity of an unladen swallow?"
        ) {
          // write the response
          await lp.write(
            new TextEncoder().encode(
              JSON.stringify({
                answer: "Is that an African or a European swallow?",
              }),
            ),
          );
        } else {
          // write the response
          await lp.write(
            new TextEncoder().encode(
              JSON.stringify({
                error: "What? I don't know?!",
              }),
            ),
          );
        }
      })
      .catch((err) => {
        stream.abort(err);
      });
  });
}

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
      await run(node);
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
