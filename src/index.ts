import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { bootstrap } from "@libp2p/bootstrap";
import { webSockets } from "@libp2p/websockets";
import { createLibp2p } from "libp2p";

// Known peers addresses
const bootstrapMultiaddrs = [
  "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
  "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
];

const node = await createLibp2p({
  start: false,
  addresses: {
    listen: ["/ip4/127.0.0.1/tcp/7878/ws"],
  },
  transports: [webSockets()],
  connectionEncrypters: [noise()],
  streamMuxers: [yamux()],
  peerDiscovery: [
    bootstrap({
      list: bootstrapMultiaddrs, // Provide array of multiaddrs
    }),
  ],
});

/// Listeners

node.addEventListener("peer:discovery", (evt) => {
  console.log("Discovered %s", evt.detail.id.toString()); // Log discovered peer
});

node.addEventListener("peer:connect", (evt) => {
  console.log("Connected to %s", evt.detail.toString()); // Log connected peer
});

/// Lifecycle

// Start libp2p
await node.start();
console.log("libp2p has started");

const listenAddress = node.getMultiaddrs();
console.log("libp2p is listening on the following addresses: ", listenAddress);

// Stop libp2p
await node.stop();
console.log("libp2p has stopped");
