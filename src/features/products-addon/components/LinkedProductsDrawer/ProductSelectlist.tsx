import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { Placeholder } from 'rsuite';
import ProductSelectItem from './ProductSelectItem';
import { DebouncedInput, InfiniteScroll } from '~app/components';
import { useProductsQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';
import { NoDataImage } from '~app/components/Icons';

type Props = {
  linked_products: Array<PendingLinkedProductsAddOn>;
  onChange(index: number, product: Product, checked: boolean): void;
};

const ProductSelectlist = ({ linked_products, onChange }: Props) => {
  const { t } = useTranslation(['filters', 'common']);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [list, setList] = useState<Product[]>([]);
  const { data, isLoading } = useProductsQuery({
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

  const next = useCallback((newPage?: number) => {
    setPage((prevState) => newPage || prevState + 1);
  }, []);

  useEffect(() => {
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...data.data], 'id'));
    } else {
      setList(data.data);
    }
  }, [data.data, page]);

  return (
    <div>
      <DebouncedInput
        value=""
        icon="search"
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder={t('products-table.search') || ''}
      />
      {isLoading ? (
        <div className="pw-mt-6">
          <Placeholder.Graph active className="pw-rounded" height={200} />
        </div>
      ) : null}
      {list.length > 0 ? (
        <div
          className="pw-overflow-auto 
            product-select-list pw-border pw-border-solid pw-border-neutral-300 pw-mt-6"
        >
          <InfiniteScroll next={next} hasMore={!isLastPage}>
            {list.map((product, index) => {
              return (
                <ProductSelectItem
                  index={index}
                  key={product.id}
                  product={product}
                  linked_products={linked_products}
                  onChange={onChange}
                />
              );
            })}
          </InfiniteScroll>
        </div>
      ) : null}
      {list.length === 0 && !isLoading ? (
        <div className="pw-h-96 pw-flex pw-flex-col pw-items-center pw-justify-center">
          <NoDataImage />
          <div className="pw-text-base">{t('common:no-data')}</div>
        </div>
      ) : null}
    </div>
  );
};

export default memo(ProductSelectlist);
