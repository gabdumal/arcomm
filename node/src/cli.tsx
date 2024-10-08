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
    --example, -e  Set the example (choices: ${Example.Kademlia}, ${Example.MDNS}, ${Example.PubSub}, ${Example.Echo_Remote}, ${Example.Echo_Local}, ${Example.Request_Remote}, ${Example.Request_Local}, ${Example.Relay}, ${Example.Listener}, ${Example.Dialer}) [default: ${Example.Kademlia}]

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
          Example.Request_Remote,
          Example.Request_Local,
          Example.Relay,
          Example.Listener,
          Example.Dialer,
        ],
        isRequired: false,
        isMultiple: false,
        shortFlag: "e",
      },
    },
  },
);

render(
  <App example={cli.flags.example ? (cli.flags.example as Example) : null} />,
  {
    exitOnCtrlC: true,
  },
);
