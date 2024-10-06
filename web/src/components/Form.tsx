import Button from "./Button";
import InputField, { InputFieldProps } from "./InputField";

interface FormProps {
  inputFields: InputFieldProps[];
  submitText: string;
}

export default function Form({ inputFields, submitText }: FormProps) {
  return (
    <form className="gap-2">
      {inputFields.map((inputField) => (
        <InputField key={inputField.inputId} {...inputField} />
      ))}
      <Button text={submitText} type="submit" />
    </form>
  );
}
