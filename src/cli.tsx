#!/usr/bin/env node
import { render } from "ink";
import meow from "meow";
import App from "./App.tsx";
import { Behaviour } from "./types.ts";

const cli = meow(
  `
  Usage
    $ my-cli <input>

  Options
    --behaviour, -b  Set the behaviour (choices: ${Behaviour.Kademlia}, ${Behaviour.MDNS}, ${Behaviour.PubSub} ${Behaviour.Relay}, ${Behaviour.Listener}, ${Behaviour.Dialer}) [default: ${Behaviour.Kademlia}]

  Examples
    $ my-cli --behaviour=${Behaviour.Kademlia}
`,
  {
    importMeta: import.meta,
    flags: {
      behaviour: {
        type: "string",
        choices: [
          Behaviour.Kademlia,
          Behaviour.MDNS,
          Behaviour.PubSub,
          Behaviour.Relay,
          Behaviour.Listener,
          Behaviour.Dialer,
        ],
        isRequired: true,
        isMultiple: false,
        shortFlag: "b",
        default: Behaviour.Kademlia,
      },
    },
  },
);

render(<App behaviour={cli.flags.behaviour as Behaviour} />, {
  exitOnCtrlC: false,
});
