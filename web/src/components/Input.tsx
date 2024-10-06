import { cx } from "class-variance-authority";

interface NumberInputProps {
  type: "number";
  step: number;
  min: number;
  max: number;
  defaultValue?: number;
}

interface TextInputProps {
  type: "text";
  placeholder: string;
  defaultValue?: string;
}

export type InputProps = {
  inputId: string;
  name: string;
  disabled?: boolean;
  hidden?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & (NumberInputProps | TextInputProps);

export default function Input({
  inputId,
  name,
  defaultValue,
  onChange,
  type,
  disabled,
  hidden,
  ...props
}: InputProps) {
  return (
    <input
      id={inputId}
      name={name}
      defaultValue={defaultValue}
      type={type}
      onChange={onChange}
      disabled={disabled}
      className={cx("w-full rounded-md p-2", hidden && "hidden")}
      {...props}
    />
  );
}
