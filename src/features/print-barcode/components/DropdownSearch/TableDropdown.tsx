import { useMemo, useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { skuListConfig } from './config';
import { InfiniteScroll, StaticTable } from '~app/components';
import { NoDataImage } from '~app/components/Icons';
import { useSkuQueryInventory } from '~app/services/queries';
import { removeDuplicates, sortArrayDescByKey } from '~app/utils/helpers/arrayHelpers';

const TableDropdown = ({
  search,
  setPage,
  page,
  rowHeight,
  selectedList,
  handleChangeQuantity,
}: {
  search: string;
  rowHeight?: number;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  selectedList: Array<SkuSelected>;
  handleChangeQuantity: (value: string, skuItem: ExpectedAny) => void;
}): JSX.Element => {
  const { t } = useTranslation('barcode');
  const [list, setList] = useState<ExpectedAny[]>([]);
  const { data } = useSkuQueryInventory({
    page,
    pageSize: 10,
    search: search,
  });

  const total_page = useMemo(() => {
    if (data?.meta) return data.meta.total_pages as number;
    return 0;
  }, [data]);

  const isLastPage = useMemo(() => {
    return page >= total_page;
  }, [total_page, page]);

  const next = useCallback(() => {
    setPage((prevState) => prevState + 1);
  }, []);

  useEffect(() => {
    setList((prevState) => {
      let newData;
      if (page > 1) {
        newData = removeDuplicates([...prevState, ...(data?.data || [])], 'id');
      } else {
        newData = data?.data || [];
      }
      newData = newData.map((sku: SkuInventory) => {
        const isSelectedIndex = selectedList.findIndex((skuSelected: SkuSelected) => skuSelected.id === sku.id);
        if (isSelectedIndex !== -1) {
          return { ...sku, quantity: selectedList[isSelectedIndex]?.quantity || 0 };
        }
        return { ...sku, quantity: 0 };
      });
      return sortArrayDescByKey(newData, 'quantity');
    });
  }, [JSON.stringify(data?.data), page]);

  const columnConfig = useMemo(() => {
    return skuListConfig({
      t,
      selectedList,
      handleChangeQuantity,
    });
  }, [JSON.stringify(selectedList)]);
  return (
    <>
      {list.length > 0 ? (
        <>
          {columnConfig ? (
            <div className="pw-overflow-auto scrollbar-sm pw-min-w-full pw-h-[50vh]">
              <InfiniteScroll next={next} hasMore={!isLastPage}>
                <StaticTable columnConfig={columnConfig} data={list} rowKey="id" rowHeight={rowHeight} />
              </InfiniteScroll>
            </div>
          ) : null}
        </>
      ) : (
        <div className="pw-flex pw-flex-col pw-items-center pw-justify-center">
          <NoDataImage width={150} height={150} />
          <div className="pw-text-base">{t('common:no-data')}</div>
        </div>
      )}
    </>
  );
};
export default TableDropdown;
