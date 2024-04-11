import { Controller, useFormContext } from 'react-hook-form';
import { TagPicker } from 'rsuite';
import { StaticTagPickerProps } from '~app/components/FormControls/TagPicker/types';

const StaticTagPicker = ({ name, data, label, placement, ...props }: StaticTagPickerProps) => {
  const { control, setValue } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TagPicker
          {...field}
          {...props}
          data={data}
          placeholder={props.placeholder}
          block
          placement={placement}
          creatable={props.creatable || false}
          onChange={(value) => setValue(name, value)}
          onSearch={(value) => {
            props?.onSearch && props.onSearch(value);
          }}
          onCreate={(value, item, event) => {
            props?.onCreate && props.onCreate(value, item, event);
          }}
        />
      )}
    />
  );
};

export default StaticTagPicker;
