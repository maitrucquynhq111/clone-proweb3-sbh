import { memo } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CurrencyInput } from '~app/components';

type Props = {
  name: string;
};

const HistoricalCostInput = ({ name }: Props) => {
  const { t } = useTranslation('products-form');
  const { control } = useFormContext();

  const sku_type = useWatch({
    control,
    name: `${name}.sku_type`,
    defaultValue: 'non_stock',
  });

  return (
    <Controller
      name={`${name}.historical_cost`}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <CurrencyInput
            isForm={false}
            error={error}
            name={`${name}.historical_cost`}
            value={field.value}
            isRequired={sku_type === 'stock'}
            label={t('historical_cost') || ''}
            placeholder="0"
            onChange={(value) => {
              if (value === '') return field.onChange(null);
              field.onChange(value);
            }}
            onBlur={field.onBlur}
          />
        );
      }}
    />
  );
};

export default memo(HistoricalCostInput);
