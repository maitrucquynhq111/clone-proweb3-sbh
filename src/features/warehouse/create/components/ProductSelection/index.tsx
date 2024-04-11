import { UseFormSetValue, useFormContext } from 'react-hook-form';
import { Dispatch, SetStateAction, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { BsPlusCircleFill } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { productTableConfig } from './config';
import { ModalPlacement, ModalSize, ModalTypes } from '~app/modals';
import { useSkuQueryInventory } from '~app/services/queries';
import { removeDuplicates, sortArrayDescByKey } from '~app/utils/helpers/arrayHelpers';
import { InfiniteScroll, StaticTable } from '~app/components';
import { NoDataImage } from '~app/components/Icons';
import { addToListSku } from '~app/features/print-barcode/utils';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  onSuccess?(): void;
};

type Props = {
  isImportGoods: boolean;
  search: string;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setValue: UseFormSetValue<ExpectedAny>;
  setModalData(value: ModalData): void;
  onCreateSuccess?(): void;
};

export const ProductSelection = memo(
  ({ isImportGoods, search, page, setPage, setValue, setModalData, onCreateSuccess }: Props) => {
    const { t } = useTranslation('purchase-order');
    const [list, setList] = useState<ExpectedAny[]>([]);
    const { data } = useSkuQueryInventory({
      page,
      pageSize: 10,
      search,
    });
    const { watch } = useFormContext<ExpectedAny>();
    const selectedList = watch('po_details') || [];

    const handleOpenCreateProduct = () => {
      setModalData({
        modal: ModalTypes.ProductCreate,
        size: ModalSize.Full,
        placement: ModalPlacement.Top,
        onSuccess: () => {
          onCreateSuccess?.();
        },
      });
    };

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

    const handleChangeQuantity = (value: string, skuItem: SkuSelected) => {
      if (!isImportGoods && +value > skuItem.can_pick_quantity) return;
      setValue('po_details', addToListSku(skuItem, selectedList, +value));
    };

    useEffect(() => {
      setList((prevState) => {
        let newData;
        if (search) {
          newData = removeDuplicates([...(data?.data || [])], 'id');
        } else {
          newData = removeDuplicates([...prevState, ...(data?.data || [])], 'id');
        }
        newData = newData.map((sku: SkuInventory) => {
          const isSelectedIndex = selectedList.findIndex((skuSelected: SkuSelected) => skuSelected.id === sku.id);
          if (isSelectedIndex !== -1) {
            return { ...sku, quantity: selectedList[isSelectedIndex].quantity };
          }
          return { ...sku, quantity: 0 };
        });
        return sortArrayDescByKey(newData, 'quantity');
      });
    }, [data?.data, page]);

    const configs = useMemo(() => {
      return productTableConfig({ t, handleChangeQuantity, selectedList, isImportGoods });
    }, [search, selectedList.length]);

    return (
      <>
        <div className="pw-p-4 pw-bg-neutral-white pw-min-w-full">
          {search && list.length === 0 && (
            <div className="pw-h-[35vh] pw-flex pw-flex-col pw-items-center pw-justify-center">
              <NoDataImage width={120} height={120} />
              <div className="pw-text-base">{t('common:no-data')}</div>
            </div>
          )}
          {list.length > 0 && (
            <>
              <button
                className="pw-flex pw-items-center pw-justify-center pw-gap-x-2 pw-mb-4"
                type="button"
                onClick={handleOpenCreateProduct}
              >
                <BsPlusCircleFill className="pw-fill-secondary-main-blue" size={20} />
                <span className="pw-text-secondary-main-blue pw-text-sm pw-font-bold">
                  {t('header-button:products-table.create')}
                </span>
              </button>
              {configs ? (
                <div className="pw-max-h-96 pw-overflow-auto scrollbar-sm pw-min-w-full">
                  <InfiniteScroll next={next} hasMore={!isLastPage}>
                    <StaticTable columnConfig={configs} data={list} rowKey="id" />
                  </InfiniteScroll>
                </div>
              ) : null}
            </>
          )}
        </div>
      </>
    );
  },
);
