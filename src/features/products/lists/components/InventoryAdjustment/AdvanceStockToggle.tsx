import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Toggle } from 'rsuite';
import { defaultPoDetail } from '~app/features/products/utils';

type Props = {
  className?: string;
};

const AdvanceStockToggle = ({ className }: Props) => {
  const { t } = useTranslation('products-form');
  const { setValue, watch, getValues } = useFormContext<PendingSku>();
  const is_advance_stock: boolean = watch('sku_type') === 'stock';

  const handleTurnOnAdvanceStock = (value: boolean) => {
    const sku = getValues();
    const po_details = value ? (sku?.po_details ? sku.po_details : defaultPoDetail) : undefined;
    setValue('po_details', po_details);
    setValue('sku_type', value ? 'stock' : 'non_stock');
  };

  return (
    <div className={className}>
      <h4 className="pw-text-sm pw-font-semibold pw-text-neutral-primary">{t('tracking_stock_quantity')}</h4>
      <Toggle checked={is_advance_stock} onChange={handleTurnOnAdvanceStock} />
    </div>
  );
};

export default AdvanceStockToggle;
