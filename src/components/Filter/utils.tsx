import { DebouncedInput, DateRangeInput, DateInput } from '~app/components/FormControls';
import { ComponentType } from '~app/components/HookForm/utils';

export const componentRenderer = (key: string, props: ExpectedAny, onChange: ExpectedAny) => {
  const type = props.type as keyof ComponentType;

  switch (type) {
    case ComponentType.Text:
      return <DebouncedInput key={key} {...props} onChange={(e) => onChange(key, e)} />;
    case ComponentType.DateRange:
      return <DateRangeInput key={key} {...props} onChange={(e: ExpectedAny) => onChange(key, e)} />;
    case ComponentType.Date:
      return <DateInput key={key} {...props} onChange={(e: ExpectedAny) => onChange(key, e)} />;
    case ComponentType.Custom:
      return <DebouncedInput key={key} {...props} onChange={(e) => onChange(key, e)} />;
    default:
      return null;
  }
};

export const formatFilterData = ({
  filterData,
  initValues,
  options,
}: {
  filterData: ExpectedAny;
  initValues: ExpectedAny;
  options: ExpectedAny;
}) => {
  return Object.keys(filterData)
    .filter((item) => JSON.stringify(initValues[item]) !== JSON.stringify(filterData[item]))
    .map((item: string) => {
      const value = filterData[item];
      return {
        key: item,
        label: options?.[item]?.label || '',
        value: Array.isArray(value) ? value : [value],
      };
    });
};
