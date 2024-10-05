import { Text } from "ink";
import React from "react";
import { Behaviour } from "./types";

interface Props {
  behaviour: Behaviour;
}

export default function App({ behaviour }: Props) {
  return (
    <Text>
      You are acting as a <Text color="green">{behaviour}</Text> node
    </Text>
  );
}
