import { GossipsubEvents } from "@chainsafe/libp2p-gossipsub";
import { Identify } from "@libp2p/identify";
import { PubSub } from "@libp2p/interface";
import { Libp2p } from "libp2p";

export type Libp2pNode = Libp2p<{
  identify: Identify;
  pubsub: PubSub<GossipsubEvents>;
  dcutr: unknown;
}>;
