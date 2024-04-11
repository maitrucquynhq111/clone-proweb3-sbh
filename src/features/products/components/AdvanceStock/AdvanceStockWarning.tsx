import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Toggle } from 'rsuite';
import { CurrencyInput } from '~app/components';

type Props = {
  name: string;
  disabled?: boolean;
};

const AdvanceStockWarning = ({ name, disabled = false }: Props) => {
  const { t } = useTranslation('products-form');
  const { getValues, setValue } = useFormContext();
  const [isWarning, setIsWarning] = useState(false);

  const handleChange = (value: boolean) => {
    if (value === false) {
      setValue(name, 0);
    }
    setIsWarning(value);
  };

  useEffect(() => {
    const warning_value = getValues(name) as number;
    if (warning_value) {
      setIsWarning(true);
    }
  }, [getValues(name)]);

  return (
    <div className="pw-flex pw-gap-x-4 pw-w-full pw-justify-end pw-items-center">
      <div className="pw-flex pw-flex-2 pw-gap-x-2 pw-items-center">
        <h3 className="pw-text-sm pw-font-normal">{t('warning_stock')}</h3>
        <Toggle disabled={disabled} checked={isWarning} onChange={handleChange} />
      </div>
      {isWarning ? (
        <div className="pw-max-w-[30%]">
          <CurrencyInput disabled={disabled} name={name} />
        </div>
      ) : null}
    </div>
  );
};

export default AdvanceStockWarning;
