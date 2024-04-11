import { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill, BsCheck2All } from 'react-icons/bs';
import { useProductRecipeQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';
import { DebouncedInput, InfiniteScroll, ImageTextCell } from '~app/components';
import { NoDataImage } from '~app/components/Icons';

type Props = {
  top: number;
  idSelected?: string;
  onOpenCreate(): void;
  onChange(rowData: ProductRecipe): void;
};

const ProductsSelectTable = ({ top, idSelected, onOpenCreate, onChange }: Props) => {
  const { t } = useTranslation('recipe-table');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [list, setList] = useState<ProductRecipe[]>([]);
  const { data } = useProductRecipeQuery({
    page,
    pageSize: 10,
    search: search,
  });

  const memoizedData = useMemo(() => {
    if (data?.data) return data.data;
    return [];
  }, [data]);

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
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...memoizedData], 'id'));
    } else {
      setList(memoizedData);
    }
  }, [JSON.stringify(memoizedData), page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleHeight = () => {
    const screenHeight = window.innerHeight;
    if (top > 0) {
      return `calc(${screenHeight}px - ${top}px - 200px)`;
    }
    return `calc(${screenHeight}px + ${top}px - 300px)`;
  };

  return (
    <div className="pw-p-1 pw-bg-neutral-white pw-w-150">
      <DebouncedInput
        className="pw-mb-4"
        value=""
        icon="search"
        onChange={(value) => setSearch(value)}
        placeholder={t('filters:products-table.search') || ''}
      />
      <div className="pw-flex pw-items-center pw-justify-between pw-mb-4">
        <button className="pw-flex pw-items-center pw-justify-center pw-gap-x-2" type="button" onClick={onOpenCreate}>
          <BsPlusCircleFill className="pw-fill-secondary-main-blue" size={22} />
          <span className="pw-text-blue-600 pw-text-sm pw-font-bold">{t('action.create-fast-product')}</span>
        </button>
      </div>
      <div className="pw-overflow-auto scrollbar-sm" style={{ height: handleHeight() }}>
        {list.length === 0 ? (
          <div className="pw-h-full pw-flex pw-flex-col pw-items-center pw-justify-center">
            <NoDataImage width={120} height={120} />
            <div className="pw-text-base">{t('common:no-data')}</div>
          </div>
        ) : (
          <InfiniteScroll next={next} hasMore={!isLastPage}>
            {list.map((rowData: ProductRecipe) => {
              return (
                <div
                  key={rowData.id}
                  className="pw-flex pw-mb-4 pw-cursor-pointer pw-items-center"
                  onClick={() => {
                    if (rowData.has_recipe) {
                      return toast.error('Không thể chọn sản phẩm đã có công thức');
                    }
                    onChange(rowData);
                  }}
                >
                  <ImageTextCell
                    image={rowData.images?.[0] || ''}
                    text={rowData.name}
                    secondText={
                      rowData.list_sku.length > 1
                        ? `${rowData.list_sku.length} ${t('variant')}`
                        : rowData.list_sku?.[0]?.sku_code
                    }
                    className="!pw-px-0"
                    textClassName="pw-font-bold pw-mb-1 pw-text-base"
                    secondTextClassName="pw-text-sm pw-text-neutral-secondary"
                  />
                  {rowData.has_recipe ? (
                    <p className="pw-flex pw-p-1 pw-rounded-md pw-text-xs pw-text-success-active pw-font-semibold pw-bg-success-background pw-whitespace-nowrap">
                      {t('have_recipe')}
                    </p>
                  ) : idSelected && idSelected === rowData.id ? (
                    <BsCheck2All size={24} className="pw-text-success-active" />
                  ) : null}
                </div>
              );
            })}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default memo(ProductsSelectTable);
