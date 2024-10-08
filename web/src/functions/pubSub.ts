import { Message } from "@libp2p/interface";
import { FILE_SHARING_TOPIC } from "../sections/ShareFile";
import { Libp2pNode } from "../types";

interface FileChunk {
  fileName: string;
  chunkIndex: number;
  totalChunks: number;
  chunkData: number[];
}

interface File {
  fileName: string;
  totalChunks: number;
  receivedChunks: number;
  chunks: number[][]; // Array of chunks
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

      if (topic === FILE_SHARING_TOPIC) receiveFileChunk(detail.data);
      else {
        const message = new TextDecoder().decode(detail.data);
        const from = "from" in detail ? detail.from.toString() : "unknown";
        registerMessage(topic, message, from);
      }
    },
  );

  console.log("Subscribing to file sharing topic");
  node.services.pubsub.subscribe(FILE_SHARING_TOPIC);
}

const receivedFiles = new Map<string, File>();

function receiveFileChunk(data: Uint8Array) {
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

  if (file.receivedChunks === totalChunks) {
    console.log("Received all chunks for", fileName);
    downloadFile(file);
  }
}

function downloadFile(file: File) {
  const concatenatedChunks = file.chunks.flat();
  const text = new TextDecoder().decode(new Uint8Array(concatenatedChunks));
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.fileName;
  a.click();
  URL.revokeObjectURL(url);
  receivedFiles.delete(file.fileName);
}
