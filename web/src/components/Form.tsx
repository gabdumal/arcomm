import Button from "./Button";
import InputField, { InputFieldProps } from "./InputField";

interface FormProps {
  inputFields: InputFieldProps[];
  submitText: string;
  action:
    | ((formData: FormData) => void)
    | ((formData: FormData) => Promise<void>);
}

export default function Form({ inputFields, submitText, action }: FormProps) {
  return (
    <form
      className="gap-2"
      onSubmit={(event) => {
        const handleSubmit = async (
          event: React.FormEvent<HTMLFormElement>,
        ) => {
          event.preventDefault();
          await action(new FormData(event.target as HTMLFormElement));
        };
        handleSubmit(event).catch((error: unknown) => {
          console.error(error);
        });
      }}
    >
      {inputFields.map((inputField) => (
        <InputField key={inputField.inputId} {...inputField} />
      ))}
      <Button text={submitText} type="submit" intent="accent" />
    </form>
  );
}
