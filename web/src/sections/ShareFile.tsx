import { multiaddr } from "@multiformats/multiaddr";
import Form from "../components/Form";
import { Libp2pNode } from "../types";

interface ShareFileProps {
  node: Libp2pNode;
}

export default function ShareFile({ node }: ShareFileProps) {
  function shareFileAction(formData: FormData) {
    const multiaddrAsString = formData.get("multiaddr") as string;
    const addr = multiaddrAsString ? multiaddr(multiaddrAsString.trim()) : null;
    if (addr === null) return;

    node.dial(addr).catch((error: unknown) => {
      console.error(error);
    });

    
    console.log("Sharing file");
  }

  return (
    <section className="gap-4">
      <div>
        <h2>Share File</h2>
        <p>Share a file with a node in the network.</p>
      </div>
      <Form
        inputFields={[
          {
            inputId: "multiaddr",
            name: "multiaddr",
            label: "Multiaddress",
            placeholder: "ip4/0.0.0.0/tcp/0",
            description:
              "The address of the node you want to share the file with.",
            type: "text",
          },
        ]}
        submitText="Share"
        action={shareFileAction}
      />
    </section>
  );
}
