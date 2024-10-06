import { useState } from "react";
import Form from "../components/Form";
import Table from "../components/Table";
import { Libp2pNode } from "../types";

interface PubSubProps {
  node: Libp2pNode;
}

export default function PubSub({ node }: PubSubProps) {
  const [subscribedTopics, setSubscribedTopics] = useState<string[]>([]);

  function subscribeToTopic(topic: string) {
    const services = node.services;
    const pubSubService = services.pubsub;
    pubSubService.subscribe(topic.trim());
    console.log(`Subscribed to ${topic}`);
    setSubscribedTopics((prev) => {
      if (prev.includes(topic)) return prev;
      return [...prev, topic];
    });
  }

  function action(formData: FormData) {
    const topic = formData.get("topic") as string;
    if (!topic) return;
    subscribeToTopic(topic);
  }

  return (
    <section className="gap-4">
      <div>
        <h2>PubSub</h2>
        <p>Subscribe to topics to send and receive messages.</p>
      </div>
      <Form
        inputFields={[
          {
            inputId: "topic",
            name: "topic",
            label: "Topic",
            placeholder: "Movies",
            description: "The topic you want to subscribe to.",
          },
        ]}
        submitText="Subscribe"
        action={action}
      />
      <div>
        <h3>Subscribed Topics</h3>
        <Table
          columns={[{ header: "Topics", accessorKey: "topic" }]}
          data={subscribedTopics.map((topic) => {
            return {
              topic,
            };
          })}
        />
      </div>
    </section>
  );
}
