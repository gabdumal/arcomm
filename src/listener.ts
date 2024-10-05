import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { identify } from "@libp2p/identify";
import { webSockets } from "@libp2p/websockets";
import { multiaddr } from "@multiformats/multiaddr";
import { createLibp2p } from "libp2p";

const relayAddrArg = process.argv[2];
if (!relayAddrArg) {
  throw new Error("The relay address needs to be specified as a parameter");
}
const relayAddr = multiaddr(relayAddrArg);

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

console.log(`Node started with id ${node.peerId.toString()}`);

const conn = await node.dial(relayAddr);

console.log(`Connected to the relay ${conn.remotePeer.toString()}`);

// Wait for connection and relay to be bind for the example purpose
node.addEventListener("self:peer:update", (evt) => {
  // Updated self multiaddrs?
  const multiaddrs = node.getMultiaddrs();
  if (!multiaddrs) {
    console.log(`No multiaddrs available`);
    return;
  }
  const relayMultiaddr = multiaddrs[0];
  if (!relayMultiaddr) {
    console.log(`No relay multiaddr available`);
    return;
  }
  console.log(
    `Advertising with a relay address of ${relayMultiaddr.toString()}`,
  );
});
