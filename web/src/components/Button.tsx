import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export type ButtonProps = {
  text: string;
  type: "button" | "reset" | "submit";
} & VariantProps<typeof button>;

export default function Button({ text, type, intent }: ButtonProps) {
  return (
    <button className={button({ intent })} type={type}>
      {text}
    </button>
  );
}

const button = cva(
  ["font-heading text-lg font-extrabold", "rounded-md px-2 py-1", "shadow-lg"],
  {
    variants: {
      intent: {
        primary: ["bg-accent-common text-light shadow-accent-common/15"],
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  },
);
