import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { bootstrap } from "@libp2p/bootstrap";
import { identify } from "@libp2p/identify";
import {
  PubSubPeerDiscovery,
  pubsubPeerDiscovery,
  PubSubPeerDiscoveryComponents,
} from "@libp2p/pubsub-peer-discovery";
import { tcp } from "@libp2p/tcp";
import { Multiaddr } from "@multiformats/multiaddr";
import { Box, Text } from "ink";
import { createLibp2p, Libp2p } from "libp2p";
import { useEffect } from "react";
import { LogMessage } from "src/App.tsx";

async function init(bootstrappers: string[] = []) {
  const config = {
    addresses: {
      listen: ["/ip4/0.0.0.0/tcp/0"],
    },
    transports: [tcp()],
    streamMuxers: [yamux()],
    connectionEncrypters: [noise()],
    peerDiscovery: [
      pubsubPeerDiscovery({
        interval: 1000,
      }),
    ],
    services: {
      pubsub: gossipsub(),
      identify: identify(),
    },
  };

  if (bootstrappers.length > 0) {
    config.peerDiscovery.push(
      bootstrap({
        list: bootstrappers,
      }) as unknown as (
        components: PubSubPeerDiscoveryComponents,
      ) => PubSubPeerDiscovery,
    );
  }

  return await createLibp2p(config);
}

function start(node: Libp2p, logMessage: LogMessage) {
  logMessage("Starting node with peer ID: ", node.peerId.toString());

  node.addEventListener("peer:discovery", (evt) => {
    logMessage("Discovered: ", evt.detail.id.toString());
  });

  node.addEventListener("peer:connect", (evt) => {
    logMessage("Connected to: ", evt.detail.toString());
  });
}

interface PubSubProps {
  node: Libp2p | null;
  setNode: React.Dispatch<React.SetStateAction<Libp2p | null>>;
  setLog: React.Dispatch<React.SetStateAction<string>>;
}

export default function PubSub({ node, setNode, setLog }: PubSubProps) {
  const logMessage: LogMessage = (...messages: string[]) => {
    const combinedMessage = messages.join("\n");
    setLog((log) => `${log}\n${combinedMessage}`);
  };

  useEffect(() => {
    const initializeNode = async () => {
      const bootstrapperNode = await init();
      setNode(bootstrapperNode);
      start(bootstrapperNode, logMessage);

      const bootstrapperMultiaddrs = bootstrapperNode
        .getMultiaddrs()
        .map((addr: Multiaddr) => addr.toString());

      const [node1, node2] = await Promise.all([
        init(bootstrapperMultiaddrs),
        init(bootstrapperMultiaddrs),
      ]);

      start(node1, logMessage);
      start(node2, logMessage);
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
