import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { bootstrap } from "@libp2p/bootstrap";
import { identify } from "@libp2p/identify";
import { kadDHT, removePublicAddressesMapper } from "@libp2p/kad-dht";
import { webSockets } from "@libp2p/websockets";
import { createLibp2p } from "libp2p";
import bootstrappers from "./bootstrappers";

const node = await createLibp2p({
  start: false,
  addresses: {
    listen: ["/ip4/127.0.0.1/tcp/0/ws"],
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

/// Listeners

node.addEventListener("peer:discovery", (evt) => {
  console.log("Discovered: %s", evt.detail.id.toString()); // Log discovered peer
});

node.addEventListener("peer:connect", (evt) => {
  console.log("Connected to: %s", evt.detail.toString()); // Log connected peer
});

/// Lifecycle

// Start libp2p
await node.start();
console.log("Node %s has started", node.peerId.publicKey);

// Listen on libp2p
const listenAddress = node.getMultiaddrs();
console.log(
  "Node %s is listening on the following addresses: ",
  node.peerId.publicKey,
  listenAddress,
);

// // Stop libp2p
// await node.stop();
// console.log("Node %s has stopped", node.peerId.publicKey);
