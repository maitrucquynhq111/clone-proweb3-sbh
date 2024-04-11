import { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill } from 'react-icons/bs';
import { Button } from 'rsuite';
import { ingredientsTableConfig } from './config';
import { useGetIngredientsQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';
import { DebouncedInput, InfiniteScroll, StaticTable } from '~app/components';
import { renderIngredientsPricePerProduct } from '~app/utils/helpers';
import { NoDataImage } from '~app/components/Icons';
import { IngredientPermission, ProductPermission, useHasPermissions } from '~app/utils/shield';

type Props = {
  top: number;
  tempSelected: Ingredient[];
  setTempSelected(value: ExpectedAny): void;
  onOpenCreate(): void;
  onChange(value: ExpectedAny): void;
};

const IngredientsSelectTable = ({ top, tempSelected, setTempSelected, onOpenCreate, onChange }: Props) => {
  const { t } = useTranslation('ingredients-form');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [list, setList] = useState<Ingredient[]>([]);
  const canViewPrice = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);
  const canCreate = useHasPermissions([IngredientPermission.INGREDIENT_CREATE]);
  const { data } = useGetIngredientsQuery({
    page,
    pageSize: 10,
    name: search,
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
  }, [memoizedData, page]);

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
        placeholder={t('placeholder.search') || ''}
      />
      <div className="pw-flex pw-items-center pw-justify-between pw-mb-4">
        {canCreate && (
          <button className="pw-flex pw-items-center pw-justify-center pw-gap-x-2" type="button" onClick={onOpenCreate}>
            <BsPlusCircleFill className="pw-fill-secondary-main-blue" size={22} />
            <span className="pw-text-blue-600 pw-text-sm pw-font-bold">{t('action.create')}</span>
          </button>
        )}
        {canViewPrice && (
          <div className="pw-font-bold pw-flex pw-items-center">
            <span className="pw-mr-1">{t('cost_per_product')}:</span>
            <span className="pw-text-base pw-text-error-active">{renderIngredientsPricePerProduct(tempSelected)}</span>
          </div>
        )}
      </div>
      <div className="pw-overflow-auto scrollbar-sm" style={{ height: handleHeight() }}>
        {list.length === 0 ? (
          <div className="pw-h-full pw-flex pw-flex-col pw-items-center pw-justify-center">
            <NoDataImage width={120} height={120} />
            <div className="pw-text-base">{t('common:no-data')}</div>
          </div>
        ) : (
          <InfiniteScroll next={next} hasMore={!isLastPage}>
            <StaticTable
              columnConfig={ingredientsTableConfig({
                t,
                selected: tempSelected,
                isInPopover: true,
                onChange: setTempSelected,
              })}
              data={list}
              rowKey="id"
            />
          </InfiniteScroll>
        )}
      </div>
      <div className="pw-pt-4 pw-px-2">
        <Button
          appearance="primary"
          size="md"
          className="pw-w-full !pw-font-bold"
          onClick={() => onChange(tempSelected)}
        >
          {t('common:modal-confirm')}
        </Button>
      </div>
    </div>
  );
};

export default memo(IngredientsSelectTable);
