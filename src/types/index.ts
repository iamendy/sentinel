// types/index.ts
export interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  idNo?: string;
  gender?: string;
  maxAge?: number;
}

export interface ServiceDescription {
  title: string;
  description: string;
  icon: string;
}
