type FormType =
  | 'container'
  | 'item'
  | 'text'
  | 'currency'
  | 'upload'
  | 'custom'
  | 'daterange'
  | 'number'
  | 'tagpicker'
  | 'selectpicker'
  | 'currency';

export type FormSchema = {
  className?: string;
  name: string;
  type: FormType;
  label?: string;
  placeholder?: string;
  required?: boolean;
  value?: ExpectedAny;
  delay?: number;
  data?: Array<ExpectedAny>;
  onSearch?: ExpectedAny;
  creatable?: boolean;
  onCreate?: ExpectedAny;
  visible?: boolean;
  children?: Array<FormSchema>;
} & ExpectedAny;
