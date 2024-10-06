import { useCallback, useEffect, useState } from "react";
import Form from "../components/Form";
import Select from "../components/Select";
import Table from "../components/Table";
import { Libp2pNode } from "../types";

interface PubSubProps {
  node: Libp2pNode;
}

export default function PubSub({ node }: PubSubProps) {
  const [subscribedTopics, setSubscribedTopics] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [subscribersOnCurrentTopic, setSubscribersToCurrentTopic] = useState<
    { peerAddr: string }[]
  >([]);

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
    setCurrentTopic(topic);
  }

  const updateSubscribers = useCallback(
    (currentTopic: string): void => {
      const services = node.services;
      const pubSubService = services.pubsub;
      const subscribers = pubSubService.getSubscribers(currentTopic);
      const subscribersList = subscribers.map((peerId) => {
        return {
          peerAddr: peerId.toString(),
        };
      });
      setSubscribersToCurrentTopic(subscribersList);
    },
    [node.services],
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!currentTopic) setSubscribersToCurrentTopic([]);
      else updateSubscribers(currentTopic);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [node, updateSubscribers, currentTopic]);

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
        <div className="my-2">
          <Table
            columns={[{ header: "Topics", accessorKey: "topic" }]}
            data={subscribedTopics.map((topic) => {
              return {
                topic,
              };
            })}
          />
        </div>
      </div>
      {currentTopic && (
        <div>
          <h3>Current Topic</h3>
          <div className="my-2">
            <Select
              value={currentTopic}
              onChange={(e) => {
                const topic = e.target.value;
                setCurrentTopic(topic);
                updateSubscribers(topic);
              }}
              options={subscribedTopics.map((topic) => ({
                key: topic,
                value: topic,
                label: topic,
              }))}
            />
          </div>
          <Table
            columns={[{ header: "Peer Addrs", accessorKey: "peerAddr" }]}
            data={subscribersOnCurrentTopic}
          />
        </div>
      )}
    </section>
  );
}
