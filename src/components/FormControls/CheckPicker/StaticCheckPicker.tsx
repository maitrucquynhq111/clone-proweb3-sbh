import { Controller, useFormContext } from 'react-hook-form';
import { CheckPicker } from 'rsuite';
import { StaticCheckPickerProps } from '~app/components/FormControls/CheckPicker/types';

const StaticCheckPicker = ({ name, data, ...props }: StaticCheckPickerProps) => {
  const { control, setValue } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <CheckPicker
          {...field}
          {...props}
          data={data}
          placeholder={props.placeholder}
          block
          onChange={(value) => setValue(name, value)}
          onSearch={(value) => {
            props?.onSearch && props.onSearch(value);
          }}
        />
      )}
    />
  );
};

export default StaticCheckPicker;
