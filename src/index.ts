import { createLibp2p } from "libp2p";
import { webSockets } from "@libp2p/websockets";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";

const node = await createLibp2p({
  start: false,
  addresses: {
    listen: ["/ip4/127.0.0.1/tcp/7878/ws"],
  },
  transports: [webSockets()],
  connectionEncrypters: [noise()],
  streamMuxers: [yamux()],
});

// start libp2p
await node.start();
console.log("libp2p has started");

const listenAddress = node.getMultiaddrs();
console.log("libp2p is listening on the following addresses: ", listenAddress);

// stop libp2p
await node.stop();
console.log("libp2p has stopped");
