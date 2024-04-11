import cx from 'classnames';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState, InfiniteScroll } from '~app/components';
import { EmptyStateProduct } from '~app/components/Icons';
import { useGetIngredientsQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';

type Props = {
  page: number;
  search: string;
  setPage: Dispatch<SetStateAction<number>>;
  onAddIngredient(sku: Ingredient): void;
};

const IngredientTab = ({ page, setPage, onAddIngredient, search }: Props) => {
  const { t } = useTranslation('stocktaking-form');
  const [list, setList] = useState<Ingredient[]>([]);

  const { data } = useGetIngredientsQuery({
    page,
    pageSize: 10,
    name: search,
    keepPreviousData: true,
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
    if (!data?.data) return setList([]);
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...data.data], 'id'));
    } else {
      setList(data.data as ExpectedAny);
    }
  }, [data, page]);

  return (
    <div className="pw-bg-neutral-white pw-min-w-full">
      {list.length === 0 ? (
        <EmptyState
          className="pw-mx-auto pw-px-4"
          icon={<EmptyStateProduct />}
          description1={t('empty.product')}
          hidePlusIcon={true}
          hiddenButton={true}
        />
      ) : null}
      <div className="pw-max-h-96 pw-overflow-auto scrollbar-sm">
        <InfiniteScroll next={next} hasMore={!isLastPage}>
          {list.map((item, index) => {
            return (
              <div
                key={item.id}
                className={cx(
                  'pw-flex pw-justify-between pw-items-center pw-bg-neutral-white pw-px-4 pw-py-2 pw-cursor-pointer',
                  {
                    'pw-border-t pw-border-solid pw-border-neutral-divider': index !== 0,
                  },
                )}
                onClick={() => onAddIngredient(item)}
              >
                <div className="pw-gap-x-4 pw-max-w-8/12 pw-text-sm">
                  <div className="pw-font-semibold pw-text-neutral-primary">{item.name}</div>
                  <div className="pw-text-neutral-secondary pw-mt-1">{item.uom.name}</div>
                </div>
                <div className="pw-text-sm pw-text-neutral-secondary">
                  {t('stock')}: <span className="pw-font-semibold">{item.total_quantity}</span>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default memo(IngredientTab);
