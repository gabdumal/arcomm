import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { webSockets } from "@libp2p/websockets";
import { multiaddr } from "@multiformats/multiaddr";
import { createLibp2p } from "libp2p";

const autoRelayNodeAddrArg = process.argv[2];
if (!autoRelayNodeAddrArg) {
  throw new Error("the auto relay node address needs to be specified");
}
const autoRelayNodeAddr = multiaddr(autoRelayNodeAddrArg);

const node = await createLibp2p({
  transports: [webSockets()],
  connectionEncrypters: [noise()],
  streamMuxers: [yamux()],
});

console.log(`Node started with id ${node.peerId.toString()}`);

const conn = await node.dial(autoRelayNodeAddr);
console.log(
  `Connected to the auto relay node via ${conn.remoteAddr.toString()}`,
);
