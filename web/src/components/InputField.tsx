import Input, { InputProps } from "./Input";

export type InputFieldProps = {
  label: string;
  placeholder: string;
  description: string;
} & InputProps;

export default function InputField({
  inputId,
  name,
  label,
  description,
  disabled,
  hidden,
  ...props
}: InputFieldProps) {
  return (
    <div className="gap-1">
      {!disabled && (
        <div>
          <label
            htmlFor="multiaddr"
            className="font-heading text-2xl font-semibold"
          >
            {label}
          </label>
          <p className="text-sm">{description}</p>
        </div>
      )}
      <Input
        inputId={inputId}
        name={name}
        disabled={disabled}
        hidden={hidden}
        {...props}
      />
    </div>
  );
}
