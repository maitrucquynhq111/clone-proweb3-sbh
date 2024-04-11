import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker, DatePickerProps } from 'rsuite';
import cx from 'classnames';
import FormLabel from '~app/components/FormControls/FormLabel';

type DateInputProps = {
  type?: string;
  name?: string;
  isForm?: boolean;
  placeholder?: string;
  label?: string;
  defaultValue?: Date;
  isRequired?: boolean;
  disabledDate?: (date: Date) => boolean;
  onChange: (value: ExpectedAny) => void;
} & DatePickerProps;

export default function DateInput({ type, isForm = false, onChange, ...props }: DateInputProps) {
  return <>{isForm ? <FormDateInput {...props} /> : <NormalDateInput onChange={onChange} {...props} />}</>;
}

const FormDateInput = ({
  placeholder,
  label,
  value,
  disabledDate,
  className,
  ...props
}: Omit<DateInputProps, 'onChange'>) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={props.name || ''}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <>
            {label ? <FormLabel label={label} isRequired={false} /> : null}
            <DatePicker
              {...props}
              {...field}
              block
              disabledDate={disabledDate}
              placeholder={placeholder || ''}
              format="dd-MM-yyyy"
              placement="autoVerticalEnd"
              className={cx('custom-daterange-neutral', className)}
            />
            {error && <p className="pw-text-red-500 pw-pt-1">{error.message}</p>}
          </>
        );
      }}
    />
  );
};

const NormalDateInput = ({ onChange, placeholder, defaultValue, value, className, ...props }: DateInputProps) => {
  return (
    <DatePicker
      {...props}
      block
      placeholder={placeholder || ''}
      format="dd-MM-yyyy"
      onChange={onChange}
      defaultValue={defaultValue}
      placement="autoVerticalEnd"
      className={cx('custom-daterange-neutral', className)}
    />
  );
};
