import cx from 'classnames';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { EmptyState, ImageTextCell, InfiniteScroll } from '~app/components';
import { EmptyStateProduct } from '~app/components/Icons';
import { ProductService } from '~app/services/api';
import { SKUS_INVENTORY_KEY } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';
import { OpenInventory } from '~app/features/warehouse/lists/components';
import { queryClient } from '~app/configs/client';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';

type Props = {
  page: number;
  search: string;
  setPage: Dispatch<SetStateAction<number>>;
  onAddSku(sku: SkuInventory): void;
};

const SkuTab = ({ page, setPage, onAddSku, search }: Props) => {
  const { t } = useTranslation('stocktaking-form');
  const [list, setList] = useState<SkuInventory[]>([]);

  const canUpdateInventory = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_INVENTORY_VIEW]);

  const { data } = useQuery<{ data: SkuInventory[]; meta: ResponseMeta }, Error>({
    queryKey: [SKUS_INVENTORY_KEY, { page, search }],
    queryFn: () =>
      ProductService.getSkusInventory({
        page,
        pageSize: 10,
        search,
      }),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: 1000 * 30,
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

  const handleUpdateStock = (sku: SkuInventory, currentPage: number) => {
    const queryKey = [SKUS_INVENTORY_KEY, { page: currentPage, search }];
    queryClient.setQueryData<ExpectedAny>(queryKey, (oldData: ExpectedAny) => {
      const { data } = oldData;
      const newData = data.map((item: ExpectedAny) => {
        if (item.id === sku.id) {
          return { ...sku };
        }
        return item;
      });
      setList((prevState) => {
        const newState = [...prevState];
        return newState.map((item) => {
          if (item.id === sku.id) {
            return { ...sku };
          }
          return item;
        });
      });
      return { ...oldData, data: newData };
    });
  };

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
            const currentPage = Math.floor(index / 10 + 1);
            return (
              <div
                key={item.id}
                className={cx(
                  'pw-flex pw-justify-between pw-items-center pw-bg-neutral-white pw-px-4 pw-py-2 pw-cursor-pointer hover:pw-bg-secondary-background',
                  {
                    'pw-border-t pw-border-solid pw-border-neutral-divider': index !== 0,
                  },
                )}
                onClick={() => onAddSku(item)}
              >
                <div className="pw-flex pw-gap-x-4 pw-max-w-8/12">
                  <ImageTextCell
                    image={item?.media?.[0] || ''}
                    text={item?.product_name || ''}
                    textClassName="pw-font-semibold pw-text-sm pw-text-neutral-primary line-clamp-2"
                    secondText={item.sku_name}
                    secondTextClassName="pw-font-normal pw-text-neutral-secondary pw-text-sm"
                  />
                </div>
                {item.sku_type === 'non_stock' && canUpdateInventory ? (
                  <OpenInventory
                    sku={item}
                    onSuccess={(sku) => handleUpdateStock(sku, currentPage)}
                    canUpdate={canUpdateInventory}
                  />
                ) : (
                  <div className="pw-text-sm pw-text-neutral-secondary">
                    {t('stock')}: <span className="pw-font-semibold">{item.total_quantity}</span>
                  </div>
                )}
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default memo(SkuTab);
