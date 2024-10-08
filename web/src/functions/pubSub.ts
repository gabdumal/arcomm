import { Message } from "@libp2p/interface";
import { FILE_SHARING_TOPIC } from "../sections/ShareFile";
import { Libp2pNode } from "../types";

interface FileChunk {
  fileName: string;
  chunkIndex: number;
  totalChunks: number;
  chunkData: Uint8Array[];
}

interface File {
  fileName: string;
  totalChunks: number;
  receivedChunks: number;
  chunks: Uint8Array[][];
}

const receivedFiles = new Map<string, File>();

function receiveFile(node: Libp2pNode, data: Uint8Array) {
  const decoder = new TextDecoder();
  const message = decoder.decode(data);
  console.log("Received file message", message);
  const { fileName, chunkIndex, totalChunks, chunkData } = JSON.parse(
    message,
  ) as FileChunk;

  let file = receivedFiles.get(fileName);
  if (!file) {
    receivedFiles.set(fileName, {
      fileName,
      totalChunks,
      receivedChunks: 0,
      chunks: [],
    });
    file = receivedFiles.get(fileName);
  }
  if (!file) return;

  const isRepeatedChunk = file.chunks[chunkIndex];
  if (isRepeatedChunk) return;
  file.chunks[chunkIndex] = chunkData;
  file.receivedChunks++;
  console.log(file);
}

export function addListener(
  node: Libp2pNode,
  registerMessage: (topic: string, message: string, from: string) => void,
) {
  node.services.pubsub.addEventListener(
    "message",
    (event: CustomEvent<Message>) => {
      const detail = event.detail;
      const topic = detail.topic;

      if (topic === FILE_SHARING_TOPIC) receiveFile(node, detail.data);
      else {
        const message = new TextDecoder().decode(detail.data);
        const from = "from" in detail ? detail.from.toString() : "unknown";
        registerMessage(topic, message, from);
      }
    },
  );
}
