import { useCallback, useEffect, useMemo, useState, memo, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill } from 'react-icons/bs';
import { productTableConfig } from './config';
import { usePosProductsQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';
import { EmptyState, InfiniteScroll, StaticTable } from '~app/components';
import { EmptyStateProduct } from '~app/components/Icons';

type Props = {
  search: string;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  onOpenCreateProduct(): void;
};

const ProductSelectTable = ({ search, page, setPage, onOpenCreateProduct }: Props) => {
  const { t } = useTranslation('header-button');
  const [list, setList] = useState<Sku[]>([]);
  const { data } = usePosProductsQuery({
    page,
    pageSize: 10,
    name: search,
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
    let newData: Sku[] = [];
    if (data?.data) {
      newData = data.data
        .map((product) =>
          product.list_sku.map((sku) => ({
            ...sku,
            product,
          })),
        )
        .flat();
    }
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...newData], 'id'));
    } else {
      setList(newData);
    }
  }, [data?.data, page]);

  const configs = useMemo(() => {
    return productTableConfig({ t });
  }, []);

  return (
    <div className="pw-p-4 pw-bg-neutral-white pw-min-w-full">
      {list.length > 0 ? (
        <>
          <button
            className="pw-flex pw-items-center pw-justify-center pw-gap-x-2 pw-mb-4"
            type="button"
            onClick={onOpenCreateProduct}
          >
            <BsPlusCircleFill className="pw-fill-secondary-main-blue" size={20} />
            <span className="pw-text-secondary-main-blue pw-text-sm pw-font-bold">{t('products-table.create')}</span>
          </button>
          {configs ? (
            <div className="pw-max-h-96 pw-overflow-auto scrollbar-sm pw-min-w-full">
              <InfiniteScroll next={next} hasMore={!isLastPage}>
                <StaticTable columnConfig={configs} data={list} rowKey="id" />
              </InfiniteScroll>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <EmptyState
            className="pw-mx-auto"
            icon={<EmptyStateProduct />}
            description1={t('chat:empty_state_product')}
            textBtn={t('products-table.create') || ''}
            onClick={onOpenCreateProduct}
            hidePlusIcon={true}
          />
        </>
      )}
    </div>
  );
};

export default memo(ProductSelectTable);
