import { TagPickerProps } from 'rsuite';

export type CheckPickerContainerProps = {
  name: string;
  label?: string;
  async?: boolean;
  query?: ExpectedAny;
  searchKey?: string;
  initStateFunc?: ExpectedAny;
  mapFunc?: ExpectedAny;
  mutateAsync?: ExpectedAny;
  _ref?: ExpectedAny;
} & TagPickerProps;

export type DynamicCheckPickerProps = Omit<CheckPickerContainerProps, 'data'>;

export type StaticCheckPickerProps = Omit<
  CheckPickerContainerProps,
  'query' | 'searchKey' | 'mutation' | 'async' | 'initStateFunc' | 'mapFunc' | 'mutateAsync'
>;
