import Input from "./Input";

export interface InputFieldProps {
  inputId: string;
  name: string;
  label: string;
  placeholder: string;
  description: string;
}

export default function InputField({
  inputId,
  name,
  label,
  placeholder,
  description,
}: InputFieldProps) {
  return (
    <div className="gap-1">
      <div>
        <label
          htmlFor="multiaddr"
          className="font-heading text-2xl font-semibold"
        >
          {label}
        </label>
        <p className="text-sm">{description}</p>
      </div>
      <Input
        inputId={inputId}
        name={name}
        type="text"
        placeholder={placeholder}
      />
    </div>
  );
}
