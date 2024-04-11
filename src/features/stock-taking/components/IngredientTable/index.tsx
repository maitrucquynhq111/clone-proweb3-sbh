import cx from 'classnames';
import { memo, useCallback, useMemo, useState } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HiChevronUp } from 'react-icons/hi';
import { skuColumnsConfig } from './config';
import { StaticTable } from '~app/components';

const IngredientTable = () => {
  const { t } = useTranslation('stocktaking-form');
  const { control, getValues, setValue } = useFormContext<PendingStockTaking>();
  const [collapse, setCollapse] = useState(false);

  const poDetailIngredients = useWatch({
    control,
    name: 'po_detail_ingredient',
    defaultValue: [] as PendingStockTakingPoDetailIngredient[],
  }) as PendingStockTakingPoDetailIngredient[];

  const status = useWatch({
    control,
    name: 'status',
  });

  const handleRemoveSku = useCallback((sku: PendingStockTakingPoDetailIngredient) => {
    const poDetailIngredients = getValues('po_detail_ingredient');
    const newPoDetailIngredients = poDetailIngredients.filter((item) => item.sku_id !== sku.sku_id);
    setValue('po_detail_ingredient', newPoDetailIngredients);
  }, []);

  const configs = useMemo(() => {
    return skuColumnsConfig({ t, onRemove: handleRemoveSku, status });
  }, [t, handleRemoveSku, status]);

  if (poDetailIngredients.length === 0) return null;

  return (
    <div className="pw-w-full pw-mt-6">
      <button
        type="button"
        className="pw-flex pw-items-center pw-gap-x-2 pw-mb-4"
        onClick={() => setCollapse((prevState) => !prevState)}
      >
        <HiChevronUp
          size={24}
          className={cx('pw-text-primary-main  pw-transition-all pw-duration-200 pw-ease-in pw-font-semibold', {
            'pw-rotate-180': collapse,
          })}
        />
        <span className="pw-text-primary-main pw-text-base pw-font-semibold">
          {t('ingredient')} ({poDetailIngredients.length})
        </span>
      </button>
      {collapse ? null : (
        <div className="pw-max-h-80 pw-overflow-auto scrollbar-sm pw-min-w-full">
          <StaticTable columnConfig={configs} data={poDetailIngredients} rowKey="sku_id" />
        </div>
      )}
    </div>
  );
};

export default memo(IngredientTable);
