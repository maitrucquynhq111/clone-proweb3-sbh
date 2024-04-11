import { Controller, useFormContext } from 'react-hook-form';
import { SelectPicker } from 'rsuite';
import { StaticSelectPickerProps } from '~app/components/FormControls/SelectPicker/types';

const StaticSelectPicker = ({ name, data, ...props }: StaticSelectPickerProps) => {
  const { control, setValue } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <SelectPicker
          {...field}
          {...props}
          data={data}
          placeholder={props.placeholder}
          block
          placement="autoVertical"
          searchable={props.searchable}
          onChange={(value) => setValue(name, value)}
          onSearch={(value) => {
            props?.onSearch && props.onSearch(value);
          }}
        />
      )}
    />
  );
};

export default StaticSelectPicker;
