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

type InputProps = {
  inputId: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & (NumberInputProps | TextInputProps);

export default function Input({
  inputId,
  name,
  defaultValue,
  onChange,
  type,
  ...props
}: InputProps) {
  return (
    <input
      id={inputId}
      name={name}
      defaultValue={defaultValue}
      type={type}
      onChange={onChange}
      className="w-full rounded-md p-2"
      {...props}
    />
  );
}
