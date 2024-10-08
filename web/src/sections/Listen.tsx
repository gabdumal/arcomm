import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { bootstrap } from "@libp2p/bootstrap";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { dcutr } from "@libp2p/dcutr";
import { identify } from "@libp2p/identify";
import { kadDHT, removePublicAddressesMapper } from "@libp2p/kad-dht";
import { webRTC } from "@libp2p/webrtc";
import { webSockets } from "@libp2p/websockets";
import * as filters from "@libp2p/websockets/filters";
import { multiaddr, Multiaddr } from "@multiformats/multiaddr";
import { createLibp2p } from "libp2p";
import { useState } from "react";
import Form from "../components/Form";
import Table from "../components/Table";
import { Libp2pNode } from "../types";

async function initNode(
  setListeningAddresses: (multiaddrs: Multiaddr[]) => void,
): Promise<Libp2pNode> {
  const node = await createLibp2p({
    addresses: {
      listen: ["/webrtc"],
    },
    transports: [
      // The WebSocket transport lets us dial a local relay
      webSockets({
        // This allows non-secure WebSocket connections for purposes of the demo
        filter: filters.all,
      }),
      webRTC(),
      circuitRelayTransport({
        discoverRelays: 1,
      }),
    ],
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
    connectionGater: {
      denyDialMultiaddr: () => {
        return false;
      },
    },
    services: {
      identify: identify(),
      pubsub: gossipsub(),
      dcutr: dcutr(),
      kadDHT: kadDHT({
        protocol: "/ipfs/kad/1.0.0",
        peerInfoMapper: removePublicAddressesMapper,
        clientMode: false,
      }),
    },
    peerDiscovery: [
      bootstrap({
        list: [import.meta.env["VITE_RELAY_ADDRESS"] as string],
      }),
    ],
  });

  node.addEventListener("self:peer:update", () => {
    const multiaddrs = node.getMultiaddrs();
    setListeningAddresses(multiaddrs);
  });

  const bootstrapMultiaddress = multiaddr(
    import.meta.env["VITE_RELAY_ADDRESS"] as string,
  );
  node.dial(bootstrapMultiaddress).catch((error: unknown) => {
    console.error(error);
  });

  return node;
}

interface ListenProps {
  node: Libp2pNode | null;
  setNode: (node: Libp2pNode) => void;
}

export default function Listen({ node, setNode }: ListenProps) {
  const [listeningAddresses, setListeningAddresses] = useState<Multiaddr[]>([]);

  function action() {
    const initializeNode = async () => {
      const node = await initNode(setListeningAddresses);
      setNode(node);
    };
    initializeNode().catch((error: unknown) => {
      console.error(error);
    });
  }

  return (
    <section className="gap-4">
      <div>
        <h2>Listen</h2>
        <p>Listen to a port to accept incoming connections.</p>
      </div>
      <Form inputFields={[]} submitText="Listen" action={action} />
      <div>
        <h3>Node</h3>
        <div className="flex-inline flex-row whitespace-nowrap">
          <p className="inline-block font-extrabold">
            <span className="text-base">Public key:&nbsp;</span>
            <span className="text-wrap break-all font-monospace text-base font-normal">
              {node?.peerId.publicKey
                ? node.peerId.publicKey.toString()
                : "unset"}
            </span>
          </p>
        </div>
      </div>
      <div>
        <h3>Listening</h3>
        <div className="my-2">
          <Table
            columns={[
              {
                header: "Listening Addresses",
                accessorKey: "multiaddr",
              },
            ]}
            data={listeningAddresses.map((addr) => {
              return {
                multiaddr: addr.toString(),
              };
            })}
          />
        </div>
      </div>
    </section>
  );
}
