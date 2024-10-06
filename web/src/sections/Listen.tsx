import { gossipsub, GossipsubEvents } from "@chainsafe/libp2p-gossipsub";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { dcutr } from "@libp2p/dcutr";
import { Identify, identify } from "@libp2p/identify";
import { PubSub } from "@libp2p/interface";
import { webRTC } from "@libp2p/webrtc";
import { webSockets } from "@libp2p/websockets";
import * as filters from "@libp2p/websockets/filters";
import { cx } from "class-variance-authority";
import { createLibp2p, Libp2p } from "libp2p";
import { useEffect, useState } from "react";
import Form from "../components/Form";

type Node = Libp2p<{
  identify: Identify;
  pubsub: PubSub<GossipsubEvents>;
  dcutr: unknown;
}>;

async function initNode(): Promise<Node> {
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
        // by default we refuse to dial local addresses from browsers since they
        // are usually sent by remote peers broadcasting undialable multiaddrs and
        // cause errors to appear in the console but in this example we are
        // explicitly connecting to a local node so allow all addresses
        return false;
      },
    },
    services: {
      identify: identify(),
      pubsub: gossipsub(),
      dcutr: dcutr(),
    },
  });
  return node;
}

// function action(formData: FormData) {
//   const multiaddr = formData.get("multiaddr") as string;
//   console.log(`Connecting to ${multiaddr}`);
// }

export default function Listen() {
  const [node, setNode] = useState<Node | null>(null);
  const [listeningAddrs, setListeningAddrs] = useState<string[]>([]);

  function handleSubmit() {
    const initializeNode = async () => {
      const node = await initNode();
      setNode(node);
    };
    initializeNode().catch((error: unknown) => {
      console.error(error);
    });
  }

  useEffect(() => {
    console.log("Node", node);
    if (!node) return;
    const addrs = node.getMultiaddrs().map((addr) => addr.toString());
    setListeningAddrs(addrs);
  }, [node]);

  return (
    <section className="gap-4">
      <div>
        <h2>Listen</h2>
        <p>Listen to a port to accept incoming connections.</p>
      </div>
      <Form
        inputFields={
          [
            //   {
            //     inputId: "multiaddr",
            //     name: "multiaddr",
            //     label: "Multiaddress",
            //     placeholder: "ip4/0.0.0.0/tcp/0",
            //     description: "The address you want to listen to.",
            //   },
          ]
        }
        submitText="Listen"
        action={handleSubmit}
      />
      <div>
        <h3>Node</h3>
        <div className="inline-flex whitespace-nowrap">
          <p className="font-extrabold">Public key:&nbsp;</p>
          <pre className="text-wrap break-all">
            {node?.peerId.publicKey
              ? node.peerId.publicKey.toString()
              : "unset"}
          </pre>
        </div>
      </div>
      <div className="mt-2 gap-2">
        <h3>Listening</h3>
        <table>
          <thead>
            <tr>
              <th className="text-start text-xl">Multiaddress</th>
            </tr>
          </thead>
          <tbody className="h-max-40 overflow-scroll">
            {listeningAddrs.length === 0 ? (
              <tr className={tableRow}>
                <td colSpan={1} className={tableData}>
                  No addresses
                </td>
              </tr>
            ) : (
              listeningAddrs.map((addr, index) => (
                <tr key={index} className={tableRow}>
                  <td className={tableData}>{addr}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const tableRow = cx(["odd:bg-faint-common", "even:bg-faint-light"]);
const tableData = cx(["bg-opacity-0", "px-2 py-1"]);
