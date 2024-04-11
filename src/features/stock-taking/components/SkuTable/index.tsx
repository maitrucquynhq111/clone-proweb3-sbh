import cx from 'classnames';
import { memo, useCallback, useMemo, useState } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HiChevronUp } from 'react-icons/hi';
import { skuColumnsConfig } from './config';
import { EmptyState, StaticTable } from '~app/components';
import { EmptyStateProduct } from '~app/components/Icons';

const SkuTable = () => {
  const { t } = useTranslation('stocktaking-form');
  const { control, getValues, setValue } = useFormContext<PendingStockTaking>();
  const [collapse, setCollapse] = useState(false);

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

  const status = useWatch({
    control,
    name: 'status',
  });

  const handleRemove = useCallback((sku: PendingStockTakingPoDetailSku) => {
    const poDetailSkus = getValues('po_details');
    const newPoDetailSkus = poDetailSkus.filter((item) => item.sku_id !== sku.sku_id);
    setValue('po_details', newPoDetailSkus);
  }, []);

  const configs = useMemo(() => {
    return skuColumnsConfig({ t, onRemove: handleRemove, status });
  }, [t, handleRemove, status]);

  if (poDetailSkus.length === 0 && poDetailIngredients.length === 0) {
    return (
      <EmptyState
        className="pw-mx-auto pw-mt-6"
        icon={<EmptyStateProduct />}
        description1={t('empty.product_ingredient')}
        hidePlusIcon={true}
        hiddenButton={true}
      />
    );
  }

  if (poDetailSkus.length === 0) return null;

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
          {t('product')} ({poDetailSkus.length})
        </span>
      </button>
      {collapse ? null : (
        <div className="pw-max-h-80 pw-overflow-auto scrollbar-sm pw-min-w-full">
          <StaticTable columnConfig={configs} data={poDetailSkus} rowKey="sku_id" />
        </div>
      )}
    </div>
  );
};

export default memo(SkuTable);
