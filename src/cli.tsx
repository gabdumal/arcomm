#!/usr/bin/env node
import { render } from "ink";
import meow from "meow";
import App from "./App.tsx";
import { Example } from "./examples/types.ts";

const cli = meow(
  `
  Usage
    $ my-cli <input>

  Options
    --example, -e  Set the example (choices: ${Example.Kademlia}, ${Example.MDNS}, ${Example.PubSub}, ${Example.Echo_Remote}, ${Example.Echo_Local}, ${Example.Relay}, ${Example.Listener}, ${Example.Dialer}) [default: ${Example.Kademlia}]

  Examples
    $ my-cli --example=${Example.Kademlia}
`,
  {
    importMeta: import.meta,
    flags: {
      example: {
        type: "string",
        choices: [
          Example.Kademlia,
          Example.MDNS,
          Example.PubSub,
          Example.Echo_Remote,
          Example.Echo_Local,
          Example.Relay,
          Example.Listener,
          Example.Dialer,
        ],
        isRequired: true,
        isMultiple: false,
        shortFlag: "b",
        default: Example.Kademlia,
      },
    },
  },
);

render(<App example={cli.flags.example as Example} />, {
  exitOnCtrlC: true,
});
