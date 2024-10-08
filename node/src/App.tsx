import { Box, Text, useApp } from "ink";
import SelectInput from "ink-select-input";
import { Libp2p } from "libp2p";
import { useState } from "react";
import ExampleDialer from "./examples/Dialer.tsx";
import ExampleEchoLocal from "./examples/echo/Local.tsx";
import ExampleEchoRemote from "./examples/echo/Remote.tsx";
import ExampleKademlia from "./examples/Kademlia.tsx";
import ExampleListener from "./examples/Listener.tsx";
import ExampleMDNS from "./examples/MDNS.tsx";
import ExamplePubSub from "./examples/PubSub.tsx";
import ExampleRelay from "./examples/Relay.tsx";
import ExampleRequestLocal from "./examples/request/Local.tsx";
import ExampleRequestRemote from "./examples/request/Remote.tsx";
import { Example } from "./examples/types.ts";
import Relay from "./relay/Relay.tsx";
import { Action } from "./types.ts";

export type LogMessage = (...messages: string[]) => void;

const items = [
  { label: "Clear log", value: Action.Clear },
  { label: "Exit", value: Action.Exit },
];

interface AppProps {
  example: Example | null;
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
    <Box flexDirection="column" margin={0}>
      <Box flexDirection="column">
        <Text backgroundColor="gray" color="yellow" bold>
          Arcana Communicatio
        </Text>
        <Box>
          {example !== null ? (
            <>
              <Text bold>Example: </Text>
              <Text bold color="green">
                {example.toLocaleUpperCase()}
              </Text>
            </>
          ) : (
            <Text bold color="green">
              RELAY
            </Text>
          )}
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
        {example === null ? (
          <Relay node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.Kademlia ? (
          <ExampleKademlia node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.MDNS ? (
          <ExampleMDNS node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.PubSub ? (
          <ExamplePubSub node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.Echo_Remote ? (
          <ExampleEchoRemote node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.Echo_Local ? (
          <ExampleEchoLocal node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.Request_Remote ? (
          <ExampleRequestRemote node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.Request_Local ? (
          <ExampleRequestLocal node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.Relay ? (
          <ExampleRelay node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.Listener ? (
          <ExampleListener node={node} setNode={setNode} setLog={setLog} />
        ) : example === Example.Dialer ? (
          <ExampleDialer node={node} setNode={setNode} setLog={setLog} />
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
