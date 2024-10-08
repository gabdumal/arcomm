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

interface FileInputProps {
  type: "file";
  accept: string;
}

export type InputProps = {
  inputId: string;
  name: string;
  disabled?: boolean;
  hidden?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & (NumberInputProps | TextInputProps | FileInputProps);

export default function Input({
  inputId,
  name,
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
      type={type}
      onChange={onChange}
      disabled={disabled}
      className={cx("w-full rounded-md p-2", hidden && "hidden")}
      {...props}
    />
  );
}
