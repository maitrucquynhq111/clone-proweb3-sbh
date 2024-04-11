import { TagPickerProps } from 'rsuite';

export type TagPickerContainerProps = {
  name: string;
  label?: string;
  async?: boolean;
  query?: ExpectedAny;
  searchKey?: string;
  createKey?: string;
  initStateFunc?: ExpectedAny;
  mapFunc?: ExpectedAny;
  mutateAsync?: ExpectedAny;
  type?: ExpectedAny;
} & TagPickerProps;

export type DynamicTagPickerProps = Omit<TagPickerContainerProps, 'data'>;

export type StaticTagPickerProps = Omit<
  TagPickerContainerProps,
  'query' | 'searchKey' | 'mutation' | 'async' | 'initStateFunc' | 'mapFunc' | 'mutateAsync'
>;
