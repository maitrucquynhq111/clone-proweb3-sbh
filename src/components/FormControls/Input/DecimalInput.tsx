import cx from 'classnames';
import { ReactNode, forwardRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, InputGroup, InputProps } from 'rsuite';
import FormLabel from '~app/components/FormControls/FormLabel';
import { MAX_QUANTITY_DECIMAL_LENGTH, MAX_QUANTITY_LENGTH } from '~app/utils/constants';
import { currencyRegex } from '~app/utils/helpers/regexHelper';

type Props = {
  name: string;
  label?: string;
  isForm?: boolean;
  inputClassName?: string;
  inputGroupClassName?: string;
  labelClassName?: string;
  PrefixIcon?: JSX.Element;
  isRequired?: boolean;
  error?: ExpectedAny;
  additionalComponent?: ReactNode;
} & InputProps;

type Ref = HTMLInputElement;

const DecimalInput = forwardRef<Ref, Props>(({ isForm = true, ...props }, ref) => {
  return <>{isForm ? <FormDecimalInput {...props} ref={ref} /> : <NormalDecimalInput {...props} />}</>;
});

const FormDecimalInput = forwardRef<Ref, Props>(
  ({ name, label, PrefixIcon, isRequired, additionalComponent, labelClassName, ...props }, ref) => {
    const { control } = useFormContext();
    const AdditionalComponent = additionalComponent ? additionalComponent : null;
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <>
              {label ? (
                <FormLabel label={label} name={name} isRequired={isRequired} className={labelClassName} />
              ) : null}
              <InputGroup
                inside
                className={cx('pw-relative', {
                  'focus-within:!pw-outline-none focus:!pw-outline-none !pw-border-error-active': error,
                })}
              >
                <Input
                  {...props}
                  {...field}
                  inputRef={ref}
                  className={cx({
                    'focus:!pw-outline-none': error,
                  })}
                  inputMode="decimal"
                  value={field.value ? field.value : ''}
                  onChange={(value) => {
                    if (!field.value && !currencyRegex.test(value)) return;
                    // allow input numbers, dot, comma
                    const convertNumber = +value.replace(',', '.');
                    const replaceValue = value.replace(',', '.');
                    const isLastDot = replaceValue.charAt(replaceValue.length - 1).lastIndexOf('.') > -1;
                    // sometimes values has many decimal part, so has to fixed 4 decimal part
                    // otherwise allow input max 4 decimal part, ex: 100,1111
                    const valueBeforeDot = replaceValue.split('.')[0];
                    const newValue =
                      valueBeforeDot && valueBeforeDot.length <= MAX_QUANTITY_LENGTH
                        ? replaceValue.substring(0, replaceValue.indexOf('.') + 5)
                        : convertNumber.toFixed(4);
                    if ((replaceValue.match(/\./g) || []).length > 1) {
                      return field.onChange(replaceValue.substring(0, replaceValue.indexOf('.') + 1));
                    }
                    if (isLastDot) return field.onChange(newValue);
                    const finalValue = replaceValue.includes('.') ? newValue : value;
                    // Invalid final value
                    const maxLength = finalValue.includes('.') ? MAX_QUANTITY_DECIMAL_LENGTH : MAX_QUANTITY_LENGTH;
                    if (finalValue && (finalValue.length > maxLength || !currencyRegex.test(finalValue))) return;
                    field.onChange(finalValue);
                  }}
                />
                {AdditionalComponent ? AdditionalComponent : null}
                {PrefixIcon ? <InputGroup.Addon>{PrefixIcon}</InputGroup.Addon> : null}
              </InputGroup>
              {error && <p className="pw-text-error-active pw-text-xs pw-font-semibold pw-pt-1">{error.message}</p>}
            </>
          );
        }}
      />
    );
  },
);

const NormalDecimalInput = forwardRef<Ref, Props>(
  (
    {
      label,
      PrefixIcon,
      isRequired,
      additionalComponent,
      labelClassName,
      inputClassName,
      inputGroupClassName,
      ...props
    },
    ref,
  ) => {
    const AdditionalComponent = additionalComponent ? additionalComponent : null;
    return (
      <>
        {label ? <FormLabel label={label} isRequired={isRequired} className={labelClassName} /> : null}
        <InputGroup
          inside
          className={cx(
            'pw-relative',
            {
              'focus-within:!pw-outline-none focus:!pw-outline-none !pw-border-error-active': props?.error,
            },
            inputGroupClassName,
          )}
        >
          <Input
            {...props}
            className={cx(
              {
                'focus:!pw-outline-none': props?.error,
              },
              inputClassName,
            )}
            inputRef={ref}
            inputMode="decimal"
            value={props?.value}
            onChange={(value, e) => {
              if (!props.onChange) return;

              if (!props.value && !currencyRegex.test(value)) return;
              // allow input numbers, dot, comma
              const convertNumber = +value.replace(',', '.');
              const replaceValue = value.replace(',', '.');
              const isLastDot = replaceValue.charAt(replaceValue.length - 1).lastIndexOf('.') > -1;
              // sometimes values has many decimal part, so has to fixed 4 decimal part
              // otherwise allow input max 4 decimal part, ex: 100,1111
              const valueBeforeDot = replaceValue.split('.')[0];
              const newValue =
                valueBeforeDot && valueBeforeDot.length <= MAX_QUANTITY_LENGTH
                  ? replaceValue.substring(0, replaceValue.indexOf('.') + 5)
                  : convertNumber.toFixed(4);
              if ((replaceValue.match(/\./g) || []).length > 1) {
                return props.onChange(replaceValue.substring(0, replaceValue.indexOf('.') + 1), e);
              }
              if (isLastDot) return props.onChange(newValue, e);
              const finalValue = replaceValue.includes('.') ? newValue : value;
              // Invalid final value
              if (finalValue && (finalValue.length > MAX_QUANTITY_LENGTH || !currencyRegex.test(finalValue))) return;
              props.onChange(finalValue, e);
            }}
          />
          {AdditionalComponent ? AdditionalComponent : null}
          {PrefixIcon ? <InputGroup.Addon>{PrefixIcon}</InputGroup.Addon> : null}
        </InputGroup>
        {props?.error && (
          <p className="pw-text-error-active pw-text-xs pw-font-semibold pw-pt-1">{props?.error.message}</p>
        )}
      </>
    );
  },
);

export default DecimalInput;
