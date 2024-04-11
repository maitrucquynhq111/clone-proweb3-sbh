export type RadioSelectProps = {
  name: string;
  labelName: string;
  data: ExpectedAny[];
  placeholder?: string;
  isRequired?: boolean;
  label?: string;
  labelKey?: string;
  valueKey?: string;
  async?: boolean;
  query?: ExpectedAny;
  searchKey?: string;
  searchable?: boolean;
  creatable?: boolean;
  createText?: string;
  className?: string;
  createComponent?(props: ExpectedAny): JSX.Element;
  createButton?(props: ExpectedAny): JSX.Element;
  customRadioItem?(props: ExpectedAny): JSX.Element;
  renderValue?(value?: ExpectedAny, item?: ExpectedAny, selectedElement?: ExpectedAny): void;
  initStateFunc?: ExpectedAny;
  mutateAsync?: ExpectedAny;
  onClose?(): void;
  onChange?<T>(data: T): void;
};

export type DynamicRadioSelectProps = Omit<RadioSelectProps, 'data'>;

export type StaticRadioSelectProps = Omit<
  RadioSelectProps,
  'query' | 'searchKey' | 'mutation' | 'async' | 'initStateFunc' | 'mapFunc' | 'mutateAsync'
>;
