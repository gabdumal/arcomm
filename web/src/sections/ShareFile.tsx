import { multiaddr } from "@multiformats/multiaddr";
import { useCallback, useEffect } from "react";
import Form from "../components/Form";
import { Libp2pNode } from "../types";

export const FILE_SHARING_TOPIC = "file-sharing";

interface ShareFileProps {
  node: Libp2pNode;
}

export default function ShareFile({ node }: ShareFileProps) {
  const subscribeToFileSharing = useCallback(() => {
    console.log("Subscribing to file sharing topic");
    node.services.pubsub.subscribe(FILE_SHARING_TOPIC);
  }, [node.services.pubsub]);

  useEffect(() => {
    subscribeToFileSharing();
  }, [subscribeToFileSharing]);

  function shareFile(file: File) {
    console.log("Sharing file", file.name);
    const reader = new FileReader();

    reader.onload = async () => {
      if (!(reader.result instanceof ArrayBuffer)) return;
      const fileContent = new Uint8Array(reader.result);
      const chunkSize = 1024; // Define the size of each chunk
      const totalChunks = Math.ceil(fileContent.length / chunkSize);

      for (let i = 0; i < totalChunks; i++) {
        const chunk = fileContent.slice(i * chunkSize, (i + 1) * chunkSize);
        const message = JSON.stringify({
          fileName: file.name,
          chunkIndex: i,
          totalChunks: totalChunks,
          chunkData: Array.from(chunk), // Convert Uint8Array to regular array
        });
        await node.services.pubsub.publish(
          FILE_SHARING_TOPIC,
          new TextEncoder().encode(message),
        );
      }
    };

    reader.readAsArrayBuffer(file);
  }

  function shareFileAction(formData: FormData) {
    const multiaddrAsString = formData.get("multiaddr") as string;
    const addr = multiaddrAsString ? multiaddr(multiaddrAsString.trim()) : null;
    if (addr === null) return;

    const file = formData.get("file") as File;
    if (!file.name.endsWith(".txt")) {
      console.error("File must be a .txt file.");
      return;
    }

    node
      .dial(addr)
      .then(() => {
        shareFile(file);
      })
      .catch((error: unknown) => {
        console.error(error);
      });
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
          {
            type: "file",
            inputId: "file",
            name: "file",
            label: "File",
            accept: ".txt",
            description: "The file you want to share.",
            placeholder: "Select a file",
          },
        ]}
        submitText="Share"
        action={shareFileAction}
      />
    </section>
  );
}
