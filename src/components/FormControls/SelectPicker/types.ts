import { TagPickerProps } from 'rsuite';

export type SelectPickerContainerProps = {
  name: string;
  label?: string;
  async?: boolean;
  query?: ExpectedAny;
  searchKey?: string;
  searchable?: boolean;
  initStateFunc?: ExpectedAny;
  mapFunc?: ExpectedAny;
  mutateAsync?: ExpectedAny;
  _ref?: ExpectedAny;
} & TagPickerProps;

export type DynamicSelectPickerProps = Omit<SelectPickerContainerProps, 'data'>;

export type StaticSelectPickerProps = Omit<
  SelectPickerContainerProps,
  'query' | 'searchKey' | 'mutation' | 'async' | 'initStateFunc' | 'mapFunc' | 'mutateAsync'
>;
