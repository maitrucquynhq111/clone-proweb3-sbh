import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const Summary = () => {
  const { t } = useTranslation('stocktaking-form');
  const { control } = useFormContext<PendingStockTaking>();

  const poDetailSkus = useWatch({
    control,
    name: 'po_details',
    defaultValue: [] as PendingStockTakingPoDetailSku[],
  }) as PendingStockTakingPoDetailSku[];

  const poDetailIngredients = useWatch({
    control,
    name: 'po_detail_ingredient',
    defaultValue: [] as PendingStockTakingPoDetailIngredient[],
  }) as PendingStockTakingPoDetailIngredient[];

  const totalBeforeChangeQuantity = useMemo(() => {
    const totalBeforeChangeQuantitySku = poDetailSkus.reduce((prev, cur) => {
      return prev + cur.before_change_quantity;
    }, 0);
    const totalBeforeChangeQuantityIngredient = poDetailIngredients.reduce((prev, cur) => {
      return prev + cur.before_change_quantity;
    }, 0);
    return totalBeforeChangeQuantitySku + totalBeforeChangeQuantityIngredient;
  }, [poDetailSkus, poDetailIngredients]);

  const totalAfterChangeQuantity = useMemo(() => {
    const totalAfterChangeQuantitySku = poDetailSkus.reduce((prev, cur) => {
      return prev + Number(cur.after_change_quantity);
    }, 0);
    const totalAfterChangeQuantityIngredient = poDetailIngredients.reduce((prev, cur) => {
      return prev + Number(cur.after_change_quantity);
    }, 0);
    return totalAfterChangeQuantitySku + totalAfterChangeQuantityIngredient;
  }, [poDetailSkus, poDetailIngredients]);

  if (poDetailSkus.length === 0 && poDetailIngredients.length === 0) return null;

  return (
    <div className="pw-w-full pw-flex pw-flex-col pw-items-end pw-mt-6">
      <div className="pw-flex pw-w-full pw-max-w-1/2 pw-justify-between pw-py-1 pw-mb-2">
        <div className="pw-text-base pw-text-neutral-primary">{t('total_before_change_quantity')}</div>
        <div className="pw-text-base pw-text-neutral-primary pw-font-semibold">
          {Number(totalBeforeChangeQuantity.toFixed(4))}
        </div>
      </div>
      <div className="pw-flex pw-w-full pw-max-w-1/2 pw-justify-between pw-py-1 pw-mb-2">
        <div className="pw-text-base pw-text-neutral-primary">{t('total_after_change_quantity')}</div>
        <div className="pw-text-base pw-text-neutral-primary pw-font-semibold">
          {Number(totalAfterChangeQuantity.toFixed(4))}
        </div>
      </div>
      <div className="pw-flex pw-w-full pw-max-w-1/2 pw-justify-between pw-py-1">
        <div className="pw-text-base pw-text-neutral-primary">{t('total_quantity')}</div>
        <div className="pw-text-base pw-text-neutral-primary pw-font-semibold">
          {Number((totalAfterChangeQuantity - totalBeforeChangeQuantity).toFixed(4))}
        </div>
      </div>
    </div>
  );
};

export default Summary;
