interface OptionProps {
  key: string;
  value: string;
  label: string;
}

function Option({ key, value, label }: OptionProps) {
  return (
    <option key={key} value={value}>
      {label}
    </option>
  );
}

interface SelectProps {
  value: number;
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
