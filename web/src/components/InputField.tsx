export interface InputFieldProps {
  inputId: string;
  label: string;
  placeholder: string;
  description: string;
}

export default function InputField({
  inputId,
  label,
  placeholder,
  description,
}: InputFieldProps) {
  return (
    <div className="gap-1">
      <label
        htmlFor="multiaddr"
        className="font-heading text-2xl font-semibold"
      >
        {label}
      </label>
      <p className="text-sm">{description}</p>
      <input
        id={inputId}
        type="text"
        placeholder={placeholder}
        className="w-full rounded-md p-2"
      />
    </div>
  );
}
