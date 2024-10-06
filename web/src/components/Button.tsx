import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export type ButtonProps = {
  text: string;
  type: "button" | "reset" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
} & VariantProps<typeof button>;

export default function Button({
  text,
  type,
  intent,
  onClick,
  disabled,
  className,
}: ButtonProps) {
  return (
    <button
      className={button({ className, intent })}
      type={type}
      {...(onClick && { onClick })}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

const button = cva(
  [
    "font-heading text-lg font-extrabold",
    "flex-grow rounded-md px-2 py-1",
    "shadow-lg",
    "cursor-pointer",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-primary-common text-light shadow-primary-common/15 hover:bg-primary-dark active:bg-primary-darker",
        ],
        secondary: [
          "bg-secondary-common text-light shadow-secondary-common/15 hover:bg-secondary-dark active:bg-secondary-darker",
        ],
        accent: [
          "bg-accent-common text-light shadow-accent-common/15 hover:bg-accent-dark active:bg-accent-darker",
        ],
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  },
);
