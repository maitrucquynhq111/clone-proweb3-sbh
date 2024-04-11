import cx from 'classnames';
import { ReactNode, forwardRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, InputGroup, InputProps } from 'rsuite';
import FormLabel from '~app/components/FormControls/FormLabel';
import { MAX_PRICE_LENGTH } from '~app/utils/constants';
import { currencyRegex } from '~app/utils/helpers/regexHelper';
import { currencyFormat } from '~app/utils/helpers/stringHelpers';

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
  autoFocus?: boolean;
  max?: number;
} & InputProps;

type Ref = HTMLInputElement;

const CurrencyInput = forwardRef<Ref, Props>(({ isForm = true, ...props }, ref) => {
  return <>{isForm ? <FormCurrencyInput {...props} ref={ref} /> : <NormalCurrencyInput {...props} ref={ref} />}</>;
});

const FormCurrencyInput = forwardRef<Ref, Props>(
  ({ name, label, PrefixIcon, isRequired, additionalComponent, labelClassName, max, ...props }, ref) => {
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
                  autoFocus={props.autoFocus}
                  className={cx({
                    'focus:!pw-outline-none': error,
                  })}
                  value={field.value ? currencyFormat(field.value.toString()) : ''}
                  onChange={(value) => {
                    const rawValue = value.replaceAll('.', '');
                    // Return if value larger than max length
                    if (rawValue.length > MAX_PRICE_LENGTH) return;

                    // Return if value not correct format
                    if (rawValue && !currencyRegex.test(rawValue)) return;

                    field.onChange(max !== undefined && Number(rawValue) > max ? max : Number(rawValue));
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

const NormalCurrencyInput = forwardRef<Ref, Props>(
  (
    {
      label,
      PrefixIcon,
      isRequired,
      additionalComponent,
      labelClassName,
      inputClassName,
      inputGroupClassName,
      max,
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
            autoFocus={props.autoFocus}
            autoSelect={true}
            inputRef={ref}
            value={props?.value ? currencyFormat(props?.value.toString()) : ''}
            onChange={(value, e) => {
              const rawValue = value.replaceAll('.', '');
              // Return if value larger than max length
              if (rawValue.length > MAX_PRICE_LENGTH) return;

              // Return if value not correct format
              if (rawValue && !currencyRegex.test(rawValue)) return;
              props?.onChange?.(max !== undefined && Number(rawValue) > max ? String(max) : rawValue, e);
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

export default CurrencyInput;
