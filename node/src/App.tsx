import { Box, Text, useApp } from "ink";
import SelectInput from "ink-select-input";
import { Libp2p } from "libp2p";
import { useState } from "react";
import Dialer from "./examples/Dialer.tsx";
import EchoLocal from "./examples/echo/Local.tsx";
import EchoRemote from "./examples/echo/Remote.tsx";
import Kademlia from "./examples/Kademlia.tsx";
import Listener from "./examples/Listener.tsx";
import MDNS from "./examples/MDNS.tsx";
import PubSub from "./examples/PubSub.tsx";
import Relay from "./examples/Relay.tsx";
import RequestLocal from "./examples/request/Local.tsx";
import RequestRemote from "./examples/request/Remote.tsx";
import { Example } from "./examples/types.ts";
import { Action } from "./types.ts";

export type LogMessage = (...messages: string[]) => void;

const items = [
  { label: "Clear log", value: Action.Clear },
  { label: "Exit", value: Action.Exit },
];

interface AppProps {
  example: Example;
}
export default function App({ example }: AppProps) {
  const { exit } = useApp();

  const [log, setLog] = useState<string>("");
  const [node, setNode] = useState<Libp2p | null>(null);

  const handleSelect = (item: { value: Action }) => {
    if (item.value === Action.Exit) {
      exit();
      process.exit(0);
    }
    if (item.value === Action.Clear) {
      setLog("");
    }
  };

  const multiaddrsList =
    node?.getMultiaddrs().map((addr) => addr.toString()) ?? [];

  return (
    <Box flexDirection="column" margin={1}>
      <Box flexDirection="column">
        <Text backgroundColor="gray" color="yellow" bold>
          Arcana Communicatio
        </Text>
        <Box>
          <Text bold>Example: </Text>
          <Text bold color="green">
            {example.toLocaleUpperCase()}
          </Text>
        </Box>
        <Box>
          <Text bold>Public key: </Text>
          <Text bold color="blue">
            {node?.peerId?.publicKey?.toString() ?? "undefined"}
          </Text>
        </Box>
        <Box>
          <Text bold>Listening on: </Text>
          {
            <Box flexDirection="column">
              {multiaddrsList.length === 0 ? (
                <Text color="magenta">none</Text>
              ) : (
                multiaddrsList?.map((addr, index) => (
                  <Text key={index} color="magenta" wrap="wrap">
                    {addr}
                  </Text>
                ))
              )}
            </Box>
          }
        </Box>
      </Box>
      <Box marginTop={1}>
        <Text>{log}</Text>
      </Box>
      <Box>
        {example === Example.Kademlia ? (
          <Kademlia node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.MDNS ? (
          <MDNS node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.PubSub ? (
          <PubSub node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.Echo_Remote ? (
          <EchoRemote node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.Echo_Local ? (
          <EchoLocal node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.Request_Remote ? (
          <RequestRemote node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.Request_Local ? (
          <RequestLocal node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.Relay ? (
          <Relay node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.Listener ? (
          <Listener node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.Dialer ? (
          <Dialer node={node} setNode={setNode} setLog={setLog} />
        ) : (
          <Text>Unknown example</Text>
        )}
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text color="grey" bold>
          Choose an action:
        </Text>
        <SelectInput items={[...items]} onSelect={handleSelect} />
      </Box>
    </Box>
  );
}
