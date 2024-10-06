import Button from "./Button";
import InputField, { InputFieldProps } from "./InputField";

interface FormProps {
  inputFields: InputFieldProps[];
  submitText: string;
  action: (formData: FormData) => void;
}

export default function Form({ inputFields, submitText, action }: FormProps) {
  return (
    <form
      className="gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        action(new FormData(event.target as HTMLFormElement));
      }}
    >
      {inputFields.map((inputField) => (
        <InputField key={inputField.inputId} {...inputField} />
      ))}
      <Button text={submitText} type="submit" intent="accent" />
    </form>
  );
}
