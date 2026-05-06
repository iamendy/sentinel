import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function InputField({ value, onChange }: InputFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="input">Phone number</FieldLabel>
      <Input
        id="input"
        type="text"
        placeholder="+234803xxxxxx"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}
