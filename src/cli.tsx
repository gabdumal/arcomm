#!/usr/bin/env node
import { render } from "ink";
import meow from "meow";
import React from "react";
import App from "./App";
import { Behaviour } from "./types";

const cli = meow(
  `
  Usage
    $ my-cli <input>

  Options
    --behaviour, -b  Set the behaviour (choices: default, listener, relay) [default: default]

  Examples
    $ my-cli --behaviour=listener
`,
  {
    importMeta: import.meta,
    flags: {
      behaviour: {
        type: "string",
        choices: ["default", "listener", "relay"],
        isRequired: true,
        isMultiple: false,
        shortFlag: "b",
        default: "default",
      },
    },
  },
);

render(<App behaviour={cli.flags.behaviour as Behaviour} />);
