import type { Message as Libp2pMessage } from "@libp2p/interface";
import { useCallback, useEffect, useState } from "react";
import { fromString } from "uint8arrays";
import Form from "../components/Form";
import Select from "../components/Select";
import Table from "../components/Table";
import { Libp2pNode } from "../types";

interface Message {
  from: string;
  data: string;
}

interface Topic {
  name: string;
  messages: Message[];
}

function addListener(
  node: Libp2pNode,
  registerMessage: (topic: string, message: string, from: string) => void,
) {
  node.services.pubsub.addEventListener(
    "message",
    (event: CustomEvent<Libp2pMessage>) => {
      console.log("Received a message!", event);
      const detail = event.detail;
      const topic = detail.topic;
      const message = new TextDecoder().decode(detail.data);
      const from = "from" in detail ? detail.from.toString() : "unknown";
      registerMessage(topic, message, from);
    },
  );
}

interface PubSubProps {
  node: Libp2pNode;
}

export default function PubSub({ node }: PubSubProps) {
  const [subscribedTopics, setSubscribedTopics] = useState<Map<string, Topic>>(
    new Map(),
  );
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [subscribersOnCurrentTopic, setSubscribersToCurrentTopic] = useState<
    { peerAddr: string }[]
  >([]);

  const registerMessage = useCallback(
    (topic: string, message: string, from: string) => {
      setSubscribedTopics((prev) => {
        const updatedTopics = new Map(prev);
        const topicObj = updatedTopics.get(topic);
        if (topicObj) {
          topicObj.messages.push({ from, data: message });
        }
        return updatedTopics;
      });
    },
    [],
  );

  useEffect(() => {
    addListener(node, registerMessage);
    return () => {
      node.services.pubsub.removeEventListener("message");
    };
  }, [node, registerMessage]);

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

  function subscribeToTopic(topic: string) {
    const trimmedTopic = topic.trim();
    const isAlreadySubscribed = subscribedTopics.has(trimmedTopic);
    if (isAlreadySubscribed) return;

    const topicObj = {
      name: trimmedTopic,
      messages: [],
    };

    const services = node.services;
    const pubSubService = services.pubsub;

    pubSubService.subscribe(trimmedTopic);
    console.log(`Subscribed to ${topic}`);

    setSubscribedTopics((prev) => new Map(prev.set(trimmedTopic, topicObj)));
  }

  function subscribeAction(formData: FormData) {
    const topic = formData.get("topic") as string;
    if (!topic) return;
    subscribeToTopic(topic);
    setCurrentTopic(topic);
  }

  async function sendMessageToTopicAction(formData: FormData) {
    const message = formData.get("message") as string;
    if (!currentTopic || !message) return;
    const services = node.services;
    const pubSubService = services.pubsub;
    await pubSubService.publish(currentTopic, fromString(message));
    console.log(`Sent message to ${currentTopic}`);
    registerMessage(currentTopic, message, "me");
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
            type: "text",
          },
        ]}
        submitText="Subscribe"
        action={subscribeAction}
      />
      <div>
        <h3>Subscribed Topics</h3>
        <div className="my-2">
          <Table
            columns={[{ header: "Topics", accessorKey: "topic" }]}
            data={Array.from(subscribedTopics.keys()).map((topic) => ({
              topic,
            }))}
          />
        </div>
      </div>
      {currentTopic && (
        <div>
          <h3>Current Topic</h3>
          <div className="mt-2">
            <Select
              value={currentTopic}
              onChange={(e) => {
                const topic = e.target.value;
                setCurrentTopic(topic);
                updateSubscribers(topic);
              }}
              options={Array.from(subscribedTopics.keys()).map((topic) => ({
                key: topic,
                value: topic,
                label: topic,
              }))}
            />
          </div>
          <div className="my-2">
            <Table
              columns={[{ header: "Peer Addrs", accessorKey: "peerAddr" }]}
              data={subscribersOnCurrentTopic}
            />
          </div>
          <Form
            inputFields={[
              {
                inputId: "message",
                name: "message",
                label: "Message",
                placeholder: "Send a message",
                description: "The message you want to send on this topic.",
                type: "text",
              },
            ]}
            submitText="Send"
            action={sendMessageToTopicAction}
          />
          <div className="my-2">
            <Table
              columns={[
                { header: "From", accessorKey: "from" },
                { header: "Data", accessorKey: "data" },
              ]}
              data={
                subscribedTopics.get(currentTopic)?.messages.map((message) => ({
                  from: message.from,
                  data: message.data,
                })) ?? []
              }
            />
          </div>
        </div>
      )}
    </section>
  );
}
