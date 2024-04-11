import cx from 'classnames';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MAX_PRICE_LENGTH, MAX_QUANTITY_DECIMAL_LENGTH, MAX_QUANTITY_LENGTH } from '~app/utils/constants';
import { formatCurrency } from '~app/utils/helpers';
import { currencyRegex } from '~app/utils/helpers/regexHelper';

type Props = {
  name: string;
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  isNumber?: boolean;
  isDecimal?: boolean;
  isForm?: boolean;
  error?: ExpectedAny;
  disabled?: boolean;
  readOnly?: boolean;
  reRender?: boolean;
  max?: number;
  onChange?(value: string): void;
  onBlur?(value: string): void;
  onClick?(e: ExpectedAny): void;
};

type NormalAutoResizeInputProps = {
  value: string;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
  onBlur(): void;
  onKeyDown?(e: ExpectedAny): void;
} & Omit<Props, 'defaultValue' | 'isForm' | 'onChange'>;

type FormAutoResizeInputProps = {
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
} & Omit<Props, 'defaultValue' | 'isForm' | 'onChange' | 'error' | 'onBlur'>;

type Ref = HTMLInputElement;

export type AutoResizeInputRef = {
  handleReset: () => void;
};

const AutoResizeInput = forwardRef<AutoResizeInputRef, Props>(
  (
    {
      name,
      className,
      placeholder,
      isNumber,
      isDecimal,
      error,
      isForm = false,
      disabled = false,
      readOnly = false,
      defaultValue = '',
      max,
      onChange,
      onBlur,
      onClick,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const textRef = useRef<HTMLSpanElement | null>(null);
    const [value, setValue] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value: inputValue } = event.target;
      if (isNumber) {
        const rawValue = inputValue.replaceAll('.', '');
        if (rawValue.length > MAX_PRICE_LENGTH) return;
        // Check null and number type
        if (rawValue && !currencyRegex.test(rawValue)) return;
        // Check max
        if (max && +rawValue >= max) {
          setValue(formatCurrency(max));
          return onChange && onChange(max.toString());
        }
        setValue(formatCurrency(Number(rawValue)));
        return onChange && onChange(rawValue);
      }
      if (isDecimal) {
        if (!value && !currencyRegex.test(inputValue)) return;
        // allow input numbers, dot, comma
        const convertNumber = +inputValue.replace(',', '.');
        const replaceValue = inputValue.replace(',', '.');
        const isLastDot = replaceValue.charAt(replaceValue.length - 1).lastIndexOf('.') > -1;
        // sometimes values has many decimal part, so has to fixed 4 decimal part
        // otherwise allow input max 4 decimal part, ex: 100,1111
        const valueBeforeDot = replaceValue.split('.')[0];
        const newValue =
          valueBeforeDot && valueBeforeDot.length <= MAX_QUANTITY_LENGTH
            ? replaceValue.substring(0, replaceValue.indexOf('.') + 5)
            : convertNumber.toFixed(4);
        if ((replaceValue.match(/\./g) || []).length > 1) {
          return setValue(replaceValue.substring(0, replaceValue.indexOf('.') + 1));
        }
        if (isLastDot) return setValue(newValue);
        const finalValue = replaceValue.includes('.') ? newValue : inputValue;
        // Invalid final value
        const maxLength = finalValue.includes('.') ? MAX_QUANTITY_DECIMAL_LENGTH : MAX_QUANTITY_LENGTH;
        if (finalValue && (finalValue.length > maxLength || !currencyRegex.test(finalValue))) return;
        if (max && +finalValue >= max) {
          setValue(max.toString());
          onChange && onChange(max.toString());
        } else {
          setValue(finalValue);
          onChange && onChange(finalValue);
        }
        return;
      }
      setValue(inputValue);
      return onChange?.(inputValue);
    };

    const handleBlur = () => {
      if (isDecimal) {
        if (
          value.charAt(value.length - 1).lastIndexOf('.') > -1 ||
          value.charAt(value.length - 1).lastIndexOf(',') > -1
        ) {
          const newValue = value.substring(0, value.indexOf('.'));
          setValue(newValue);
        } else {
          onBlur && onBlur(value);
        }
        return;
      }
      const rawValue = value.replaceAll('.', '');
      onBlur && onBlur(rawValue);
    };

    const handleKeyDown = (e: ExpectedAny) => {
      if (e.key === 'Enter') handleBlur();
    };

    const handleCalculateInputWidth = useCallback((value: string) => {
      const textEle = textRef.current;
      const inputEle = inputRef.current;
      if (!textEle || !inputEle) return;
      const totalBankSpace = value.split(' ').length - 1;
      textEle.innerText = value.trim();
      const width = textEle.getBoundingClientRect().width + totalBankSpace;
      inputEle.style.width = width + 8 + 'px';
    }, []);

    useEffect(() => {
      const inputEle = inputRef.current;
      const textEle = textRef.current;
      if (!inputEle || !textEle) return;
      if (placeholder && !value) {
        inputEle.style.width = placeholder.length * 10 + 'px';
        return;
      }
      if (value) {
        handleCalculateInputWidth(value);
      } else {
        inputEle.style.width = '8px';
      }
    }, [value, placeholder, handleCalculateInputWidth]);

    useEffect(() => {
      const newValue = isNumber ? formatCurrency(defaultValue) : defaultValue;
      if (isDecimal) return setValue(newValue);
      setValue(newValue !== '0' ? newValue : '');
    }, [defaultValue]);

    useImperativeHandle(
      ref,
      () => ({
        handleReset: () => setValue(''),
      }),
      [],
    );

    return (
      <div className="pw-overflow-hidden pw-relative">
        <span
          className={cx(
            'pw-text-base pw-invisible pw-select-none pw-w-max pw-absolute pw-overflow-hidden -pw-right-full',
            className,
          )}
          ref={textRef}
        />
        {isForm ? (
          <FormAutoResizeInput
            name={name}
            className={className}
            placeholder={placeholder}
            onChange={handleChange}
            isNumber={isNumber}
            disabled={disabled}
            readOnly={readOnly}
            max={max}
            ref={inputRef}
          />
        ) : (
          <NormalAutoResizeInput
            name={name}
            className={className}
            placeholder={placeholder}
            value={value}
            error={error}
            isNumber={isNumber}
            isDecimal={isDecimal}
            ref={inputRef}
            onBlur={handleBlur}
            onChange={handleChange}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            max={max}
            disabled={disabled}
          />
        )}
      </div>
    );
  },
);

const NormalAutoResizeInput = forwardRef<Ref, NormalAutoResizeInputProps>(
  (
    {
      name,
      className,
      placeholder,
      error,
      disabled,
      isNumber,
      isDecimal,
      readOnly,
      value = '',
      onChange,
      onBlur,
      onClick,
      onKeyDown,
    },
    ref,
  ) => {
    return (
      <input
        name={name}
        className={cx(
          `pw-w-4 pw-border-b pw-border-dashed pw-outline-none pw-text-base pw-font-semibold`,
          {
            'pw-border-error-active pw-text-error-active': error,
            'pw-text-right': isNumber || isDecimal,
            'pw-text-left': !isNumber && !isDecimal,
            'pw-text-neutral-disable pw-border-neutral-disable': disabled,
            'pw-text-blue-700 pw-border-blue-700': !disabled,
          },
          className,
        )}
        ref={ref}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        onClick={onClick}
        onKeyDown={onKeyDown}
        disabled={disabled}
        readOnly={readOnly}
      />
    );
  },
);

const FormAutoResizeInput = forwardRef<Ref, FormAutoResizeInputProps>(
  ({ name, className, placeholder, isNumber, isDecimal, disabled, onChange }, ref) => {
    const { control } = useFormContext();
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          let value = field.value;
          if (isNumber) {
            value = field.value ? formatCurrency(field.value.toString()) : '';
          }
          return (
            <input
              className={cx(
                `pw-w-4 pw-border-b pw-border-dashed pw-outline-none pw-text-base pw-font-semibold`,
                {
                  'pw-border-error-active pw-text-error-active': error,
                  'pw-text-right': isNumber || isDecimal,
                  'pw-text-left': !isNumber,
                  'pw-text-neutral-disable pw-border-neutral-disable': disabled,
                  'pw-text-blue-700 pw-border-blue-700': !disabled,
                },
                className,
              )}
              ref={ref}
              value={value}
              placeholder={placeholder}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = event.target;
                if (isNumber) {
                  const rawValue = value.replaceAll('.', '');
                  // Return if value larger than max length
                  if (rawValue.length > MAX_PRICE_LENGTH) return;
                  // Return if value not correct format
                  if (rawValue && !currencyRegex.test(rawValue)) return;
                  field.onChange(Number(rawValue));
                } else {
                  field.onChange(value);
                }
                onChange(event);
              }}
              disabled={disabled}
              onBlur={field.onBlur}
            />
          );
        }}
      />
    );
  },
);

export default AutoResizeInput;
