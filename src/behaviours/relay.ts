import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { circuitRelayServer } from "@libp2p/circuit-relay-v2";
import { identify } from "@libp2p/identify";
import { webSockets } from "@libp2p/websockets";
import { createLibp2p } from "libp2p";

const node = await createLibp2p({
  addresses: {
    listen: ["/ip4/127.0.0.1/tcp/8082/ws"],
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

console.log(`Node started with id ${node.peerId.toString()}`);
console.log("Listening on:");
node.getMultiaddrs().forEach((ma) => console.log("  " + ma.toString()));