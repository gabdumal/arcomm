import { multiaddr, Multiaddr } from "@multiformats/multiaddr";
import Form from "../components/Form";
import { Libp2pNode } from "../types";

interface ConnectProps {
  node: Libp2pNode;
}

export default function Connect({ node }: ConnectProps) {
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
      </div>
    </section>
  );
}
