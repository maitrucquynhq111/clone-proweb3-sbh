import cx from 'classnames';
import { isAfter } from 'date-fns';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker, DatePickerProps } from 'rsuite';
import { FormLabel } from '~app/components';

type Props = {
  name: string;
  label?: string;
  isRequired?: boolean;
} & Omit<DatePickerProps, 'onChange' | 'name'>;

const DateSelect = ({ name, placeholder, label, isRequired, ...props }: Props) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <>
            {label ? <FormLabel label={label} isRequired={isRequired} /> : null}
            <DatePicker
              {...props}
              block
              value={field?.value || null}
              onChange={(value) => field.onChange(value)}
              placeholder={placeholder}
              format={props.format || 'dd-MM-yyyy'}
              placement={props.placement || 'autoVerticalEnd'}
              className={cx('custom-daterange-neutral', props.className, {
                'pw-select-error': error,
              })}
              shouldDisableDate={(date: Date) => isAfter(date, new Date())}
            />
            {error && <p className="pw-text-error-active pw-text-xs pw-font-semibold pw-pt-1">{error.message}</p>}
          </>
        );
      }}
    />
  );
};

export default DateSelect;
