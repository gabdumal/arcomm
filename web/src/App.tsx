import { useState } from "react";
import Connect from "./sections/Connect";
import Listen from "./sections/Listen";
import { Libp2pNode } from "./types";

function App() {
  const [node, setNode] = useState<Libp2pNode | null>(null);

  return (
    <article className="gap-4 px-4 py-4 sm:px-8">
      <header>
        <h1>Arcomm</h1>
        <p className="font-semibold">File sharing in vaults 🔐</p>
      </header>
      <main className="gap-4">
        <Listen node={node} setNode={setNode} />
        {node && <Connect node={node} />}
      </main>
    </article>
  );
}

export default App;
