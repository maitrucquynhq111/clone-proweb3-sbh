import { useFormContext, Controller } from 'react-hook-form';
import { Checkbox as RSuiteCheckbox, CheckboxProps } from 'rsuite';

type Props = {
  name: string;
  label?: string;
} & Omit<CheckboxProps, 'className'>;

const Checkbox = ({ name, label }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <>
            <RSuiteCheckbox
              {...field}
              value={undefined}
              checked={field.value}
              onChange={(_, checked) => {
                field.onChange(checked);
              }}
            >
              {label ? label : ''}
            </RSuiteCheckbox>
          </>
        );
      }}
    />
  );
};

export default Checkbox;
