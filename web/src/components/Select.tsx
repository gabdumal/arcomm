interface OptionProps {
  key: string;
  value: string;
  label: string;
}

function Option({ value, label }: OptionProps) {
  return <option value={value}>{label}</option>;
}

interface SelectProps {
  value: string;
  options: OptionProps[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Select({ value, options, onChange }: SelectProps) {
  return (
    <select value={value} onChange={onChange} className="h-full rounded-md">
      {options.map((option) => (
        <Option key={option.key} value={option.value} label={option.label} />
      ))}
    </select>
  );
}
