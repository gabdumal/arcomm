interface ButtonProps {
  text: string;
  type: "button" | "reset" | "submit";
}

export default function Button({ text, type }: ButtonProps) {
  return (
    <button
      className="rounded-md bg-accent-common px-2 py-1 font-heading text-lg font-extrabold text-light shadow-xl shadow-accent-common/15"
      type={type}
    >
      {text}
    </button>
  );
}
