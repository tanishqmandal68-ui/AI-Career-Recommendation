import { inputClass, labelClass } from "../../lib/formStyles";

interface AuthFormFieldProps {
  label: string;
  type?: string;
  required?: boolean;
  minLength?: number;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AuthFormField({
  label,
  type = "text",
  required,
  minLength,
  value,
  onChange,
  placeholder,
}: AuthFormFieldProps) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        type={type}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        placeholder={placeholder}
      />
    </label>
  );
}
