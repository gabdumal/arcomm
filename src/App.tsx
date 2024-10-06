import { Box, Text, useApp } from "ink";
import SelectInput from "ink-select-input";
import { Libp2p } from "libp2p";
import { useState } from "react";
import Dialer from "./behaviours/Dialer.tsx";
import Kademlia from "./behaviours/Kademlia.tsx";
import Listener from "./behaviours/Listener.tsx";
import MDNS from "./behaviours/MDNS.tsx";
import PubSub from "./behaviours/PubSub.tsx";
import Relay from "./behaviours/Relay.tsx";
import { Action, Behaviour } from "./types.ts";

export type LogMessage = (...messages: string[]) => void;

const items = [
  { label: "Clear log", value: Action.Clear },
  { label: "Exit", value: Action.Exit },
];

interface AppProps {
  behaviour: Behaviour;
}
export default function App({ behaviour }: AppProps) {
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
          <Text bold>Behaviour: </Text>
          <Text bold color="green">
            {behaviour.toLocaleUpperCase()}
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
        {behaviour === Behaviour.Kademlia ? (
          <Kademlia node={node} setNode={setNode} setLog={setLog} />
        ) : behaviour === Behaviour.MDNS ? (
          <MDNS node={node} setNode={setNode} setLog={setLog} />
        ) : behaviour === Behaviour.PubSub ? (
          <PubSub node={node} setNode={setNode} setLog={setLog} />
        ) : behaviour === Behaviour.Relay ? (
          <Relay node={node} setNode={setNode} setLog={setLog} />
        ) : behaviour === Behaviour.Listener ? (
          <Listener node={node} setNode={setNode} setLog={setLog} />
        ) : behaviour === Behaviour.Dialer ? (
          <Dialer node={node} setNode={setNode} setLog={setLog} />
        ) : (
          <Text>Unknown behaviour</Text>
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
