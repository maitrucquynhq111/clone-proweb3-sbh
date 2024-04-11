import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Toggle } from 'rsuite';
import { defaultPoDetail } from '~app/features/products/utils';

type Props = {
  isCreate?: boolean;
  disabled?: boolean;
};

const AdvanceStockToggle = ({ isCreate = true, disabled = false }: Props) => {
  const { setValue, getValues, watch } = useFormContext();
  const { t } = useTranslation('products-form');
  const is_advance_stock: boolean = watch('is_advance_stock');

  const handleTurnOnAdvanceStock = (value: boolean) => {
    if (is_advance_stock && isCreate === false) return;
    const skus = [...getValues('skus')] as PendingSku[];
    const newSkus = skus.map((sku) => ({
      ...sku,
      po_details: sku?.po_details ? sku.po_details : defaultPoDetail,
      sku_type: is_advance_stock ? 'non_stock' : 'stock',
    }));
    setValue('skus', newSkus);
    setValue('is_advance_stock', value);
  };

  return (
    <>
      <h4 className="pw-text-base pw-font-bold">{t('tracking_stock_quantity')}</h4>
      <Toggle disabled={disabled} checked={is_advance_stock} onChange={handleTurnOnAdvanceStock} />
    </>
  );
};

export default AdvanceStockToggle;
