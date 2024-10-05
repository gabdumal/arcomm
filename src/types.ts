export const enum Behaviour {
  Common = "common",
  Listener = "listener",
  Relay = "relay",
}

export enum Action {
  Submit = "submit",
  Clear = "clear",
  Exit = "exit",
}

export interface Item {
  label: string;
  value: Action;
  handler: Function;
}
