import cx from 'classnames';
import { UseFormSetValue, useFormContext } from 'react-hook-form';
import { BsChevronUp } from 'react-icons/bs';
import { useState } from 'react';
import { Button } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { columnOptions } from './config';
import { StaticTable } from '~app/components';
import { removeSku, addToListSku } from '~app/features/print-barcode/utils';

export const ListSkuSelected = ({
  setValue,
  isImportGoods,
}: {
  setValue: UseFormSetValue<PendingInventoryCreate>;
  isImportGoods: boolean;
}): JSX.Element => {
  const { t } = useTranslation('purchase-order');
  const [collapse, setCollapse] = useState(false);
  const { watch } = useFormContext<PendingInventoryCreate>();
  const selectedList = watch('po_details') || [];

  const handleChangeQuantity = (value: string, skuItem: SkuSelected) => {
    setValue('po_details', addToListSku(skuItem, selectedList, +value));
  };
  const handleChangeHistoricalCost = (value: string, skuItem: SkuSelected) => {
    const newSelectedList = [...selectedList];
    const indexSelected = newSelectedList.findIndex((item: SkuSelected) => item.id === skuItem.id);
    if (indexSelected === -1) return;
    newSelectedList[indexSelected].historical_cost = +value;
    setValue('po_details', newSelectedList);
  };

  const handleRemoveSku = (skuItem: SkuSelected) => {
    setValue('po_details', removeSku(skuItem, selectedList));
  };

  return (
    <div>
      <Button
        appearance="subtle"
        startIcon={
          <BsChevronUp
            size={20}
            className={cx('pw-text-primary-main  pw-transition-all pw-duration-200 pw-ease-in', {
              'pw-rotate-180': collapse,
            })}
          />
        }
        className="!pw-text-primary-main !pw-text-base !pw-font-semibold !pw-mb-2"
        onClick={() => setCollapse(!collapse)}
      >{`${t('sku-table.product')} (${selectedList.length})`}</Button>
      {!collapse && (
        <StaticTable
          columnConfig={columnOptions({
            t,
            handleRemoveSku: handleRemoveSku,
            handleChangeQuantity: handleChangeQuantity,
            handleChangeHistoricalCost: handleChangeHistoricalCost,
            isImportGoods: isImportGoods,
          })}
          data={selectedList}
          rowKey="id"
        />
      )}
    </div>
  );
};
