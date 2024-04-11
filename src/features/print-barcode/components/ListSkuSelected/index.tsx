import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { columnOptions } from './config';
import EmptyState from './EmptyState';
import { useSelectedSku } from '~app/features/print-barcode/hook';
import { StaticTable } from '~app/components';
import { removeSku, addToListSku } from '~app/features/print-barcode/utils';

const ListSkuSelected = (): JSX.Element => {
  const { t } = useTranslation('barcode');
  const [selectedList, setSelectedList] = useSelectedSku((store: ExpectedAny) => store.selected_list);

  const handleChangeQuantity = (value: string, skuItem: SkuSelected) => {
    setSelectedList((store) => ({ ...store, selected_list: addToListSku(skuItem, store.selected_list, +value) }));
  };

  const handleRemoveSku = (skuItem: SkuSelected) => {
    setSelectedList((store) => ({ ...store, selected_list: removeSku(skuItem, store.selected_list) }));
  };

  const columnConfig = useMemo(() => {
    return columnOptions({ t, handleRemoveSku: handleRemoveSku, handleChangeQuantity: handleChangeQuantity });
  }, [selectedList]);
  return selectedList.length === 0 ? (
    <EmptyState />
  ) : (
    <div className="pw-min-h-64">
      <StaticTable columnConfig={columnConfig} data={selectedList} rowKey="id" />
    </div>
  );
};
export default ListSkuSelected;
