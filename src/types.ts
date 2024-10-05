export const enum Behaviour {
  Kademlia = "kademlia",
  MDNS = "mdns",
  Relay = "relay",
  Listener = "listener",
  Dialer = "dialer",
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
