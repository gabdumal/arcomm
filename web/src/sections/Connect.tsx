import { multiaddr, Multiaddr } from "@multiformats/multiaddr";
import { useCallback, useEffect, useState } from "react";
import Form from "../components/Form";
import Table from "../components/Table";
import { Libp2pNode } from "../types";

function addListeners(node: Libp2pNode, updateConnectedPeers: () => void) {
  node.addEventListener("connection:open", () => {
    updateConnectedPeers();
  });
  node.addEventListener("connection:close", () => {
    updateConnectedPeers();
  });
}

interface ConnectProps {
  node: Libp2pNode;
}

export default function Connect({ node }: ConnectProps) {
  const [connectedPeers, setConnectedPeers] = useState<Multiaddr[]>([]);

  const updateConnectedPeers = useCallback(() => {
    const peerList = node.getPeers().flatMap((peerId) => {
      const connectionsWithPeer = node.getConnections(peerId);
      return connectionsWithPeer.map((connection) => connection.remoteAddr);
    });
    setConnectedPeers(peerList);
  }, [node]);

  useEffect(() => {
    addListeners(node, updateConnectedPeers);
    return () => {
      node.removeEventListener("connection:open");
      node.removeEventListener("connection:close");
    };
  }, [node, updateConnectedPeers]);

  function connect(multiaddr: Multiaddr) {
    node.dial(multiaddr).catch((error: unknown) => {
      console.error(error);
    });
    console.log(`Dialing ${multiaddr.toString()}`);
  }

  function action(formData: FormData) {
    const multiaddrAsString = formData.get("multiaddr") as string;
    const addr = multiaddrAsString ? multiaddr(multiaddrAsString.trim()) : null;
    if (addr === null) return;
    connect(addr);
  }

  return (
    <section className="gap-4">
      <div>
        <h2>Connect</h2>
        <p>Connect to a node to enter in the network.</p>
      </div>
      <Form
        inputFields={[
          {
            inputId: "multiaddr",
            name: "multiaddr",
            label: "Multiaddress",
            placeholder: "ip4/0.0.0.0/tcp/0",
            description: "The address of the node you want to connect to.",
          },
        ]}
        submitText="Connect"
        action={action}
      />
      <div>
        <h3>Connected</h3>
        <div className="my-2">
          <Table
            columns={[{ header: "Peer Addrs", accessorKey: "peerAddr" }]}
            data={connectedPeers.map((peerAddrs) => {
              return {
                peerAddr: peerAddrs.toString(),
              };
            })}
          />
        </div>
      </div>
    </section>
  );
}
