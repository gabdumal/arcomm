import { cx } from "class-variance-authority";
import { useState } from "react";
import Form from "../components/Form";

function action(formData: FormData) {
  const multiaddr = formData.get("multiaddr") as string;
  console.log(`Connecting to ${multiaddr}`);
}

export default function Listen() {
  const [listeningAddrs, setListeningAddrs] = useState<string[]>([]);

  return (
    <section className="gap-2">
      <div>
        <h2>Listen</h2>
        <p>Listen to a port to accept incoming connections.</p>
      </div>
      <Form
        inputFields={[
          {
            inputId: "multiaddr",
            name: "multiaddr",
            label: "Multiaddress",
            placeholder: "ip4/0.0.0.0/tcp/0",
            description: "The address you want to listen to.",
          },
        ]}
        submitText="Listen"
        action={action}
      />
      <div className="mt-2 gap-2">
        <h3>Listening</h3>
        <table>
          <thead>
            <tr>
              <th className="text-start text-xl">Multiaddress</th>
            </tr>
          </thead>
          <tbody className="h-max-40 overflow-scroll">
            {listeningAddrs.length === 0 ? (
              <tr className={tableRow}>
                <td colSpan={1} className={tableData}>
                  No addresses
                </td>
              </tr>
            ) : (
              listeningAddrs.map((addr, index) => (
                <tr key={index} className={tableRow}>
                  <td className={tableData}>{addr}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const tableRow = cx(["odd:bg-faint-common", "even:bg-faint-light"]);
const tableData = cx(["bg-opacity-0", "px-2 py-1"]);
