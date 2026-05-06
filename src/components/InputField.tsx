import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (name: string, value: string) => void;
}

export function InputField({
  label,
  name,
  value,
  type = "text",
  placeholder,
  onChange,
}: InputFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </Field>
  );
}
