import Form from "./components/Form";

function App() {
  return (
    <article className="gap-4 px-4 py-4 sm:px-8">
      <header>
        <h1>Arcomm</h1>
        <p className="font-semibold">File sharing in vaults 🔐</p>
      </header>
      <main>
        <section className="gap-2">
          <div>
            <h2>Connect</h2>
            <p>Connect to a node to enter in the network.</p>
          </div>
          <Form
            inputFields={[
              {
                inputId: "multiaddr",
                label: "Multiaddress",
                placeholder: "ip4/0.0.0.0/tcp/0",
                description: "The address of the node you want to connect to.",
              },
            ]}
            submitText="Connect"
          />
        </section>
      </main>
    </article>
  );
}

export default App;
