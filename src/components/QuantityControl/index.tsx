import cx from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'rsuite';
import { MdAdd, MdRemove } from 'react-icons/md';
import { MAX_QUANTITY_DECIMAL_LENGTH, MAX_QUANTITY_LENGTH, QuantityControlSize } from '~app/utils/constants';
import { currencyRegex } from '~app/utils/helpers/regexHelper';

const getIconSize = (size: QuantityControlSize) => {
  if (size === QuantityControlSize.Large) {
    return 22;
  }
  if (size === QuantityControlSize.Medium) {
    return 20;
  }
  if (size === QuantityControlSize.Small) {
    return 18;
  }
  return 16;
};

type Props = {
  defaultValue?: string;
  className?: string;
  classNameTextInput?: string;
  maxQuantity?: number;
  size: QuantityControlSize;
  disabled?: boolean;
  placeholder?: string;
  errorMessage?: string;
  showErrorMessage?: boolean;
  onChange?(value: string, isInput?: boolean): void;
  onBlur?(value: string, isInput?: boolean): void;
};

const QuantityControl = ({
  defaultValue = '',
  className = '',
  classNameTextInput = '',
  size = QuantityControlSize.Small,
  maxQuantity,
  disabled = false,
  placeholder = '',
  errorMessage = '',
  showErrorMessage = true,
  onChange,
  onBlur,
}: Props) => {
  const { t } = useTranslation('common');
  const [quantity, setQuantity] = useState(defaultValue ? defaultValue : '');
  const [error, setError] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const handleChangeQuantity = (value: string, isInput?: boolean) => {
    if (!quantity && !currencyRegex.test(value)) return;
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
      return setQuantity(replaceValue.substring(0, replaceValue.indexOf('.') + 1));
    }
    if (isLastDot) return setQuantity(newValue);
    const finalValue = replaceValue.includes('.') ? newValue : value;
    // Invalid final value
    const maxLength = finalValue.includes('.') ? MAX_QUANTITY_DECIMAL_LENGTH : MAX_QUANTITY_LENGTH;
    if (finalValue && (finalValue.length > maxLength || !currencyRegex.test(finalValue))) return;
    if (maxQuantity && +finalValue >= maxQuantity) {
      setQuantity(Number(maxQuantity).toString());
      onChange && onChange(maxQuantity.toString(), isInput);
      setError(errorMessage ? errorMessage : t('common:error.max_quantity') || '');
    } else {
      setQuantity(Number(finalValue).toString());
      onChange && onChange(finalValue, isInput);
      setError('');
    }
  };
  const handleBlur = () => {
    if (
      quantity.charAt(quantity.length - 1).lastIndexOf('.') > -1 ||
      quantity.charAt(quantity.length - 1).lastIndexOf(',') > -1
    ) {
      const newValue = quantity.substring(0, quantity.indexOf('.'));
      setQuantity(newValue);
    } else {
      onBlur && onBlur(quantity);
    }
    setIsFocus(false);
  };

  const handleIncreaseQuantity = () => {
    const nextQuantity = (+(quantity || 0) + 1).toString();
    return handleChangeQuantity(nextQuantity, false);
  };

  const handleDecreaseQuantity = () => {
    if (+quantity <= 0) {
      return handleChangeQuantity('0');
    }
    handleChangeQuantity((+quantity - 1).toString(), false);
  };

  useEffect(() => {
    setQuantity(defaultValue ? defaultValue : '');
  }, [defaultValue]);

  return (
    <>
      <div
        className={cx(
          `pw-flex pw-justify-between pw-items-center pw-w-full pw-rounded
            pw-border pw-border-solid pw-bg-white pw-transition-all`,
          {
            'pw-px-4 pw-py-3': size === QuantityControlSize.Large,
            'pw-px-3 pw-py-2': size === QuantityControlSize.Medium,
            'pw-px-2 pw-py-1.5': size === QuantityControlSize.Small,
            'pw-px-0 pw-py-1.5': size === QuantityControlSize.Xsmall,
            'pw-border-green-600': !error && isFocus,
            'pw-border-neutral-200': !error && !isFocus,
            'pw-border-error-active': error,
          },
          className,
        )}
      >
        <IconButton
          size="xs"
          className="!pw-p-0.5"
          disabled={disabled}
          icon={<MdRemove size={getIconSize(size)} />}
          appearance="subtle"
          onClick={handleDecreaseQuantity}
        />
        <input
          className={cx(
            '!pw-bg-transparent pw-outline-none pw-border-none pw-text-center pw-font-bold pw-text-sm pw-text-black pw-w-5/12',
            classNameTextInput,
          )}
          placeholder={placeholder}
          value={quantity}
          disabled={disabled}
          onFocus={() => setIsFocus(true)}
          onBlur={handleBlur}
          onChange={(event) => {
            handleChangeQuantity(event.target.value, true);
          }}
          inputMode="decimal"
        />
        <IconButton
          size="xs"
          className="!pw-p-px"
          disabled={disabled}
          icon={<MdAdd size={getIconSize(size)} className="pw-text-primary-main" />}
          appearance="subtle"
          onClick={handleIncreaseQuantity}
        />
      </div>
      {error && showErrorMessage && (
        <p className="pw-text-error-active pw-text-sm pw-font-semibold pw-pt-1 pw-text-center">{error}</p>
      )}
    </>
  );
};

export default QuantityControl;
