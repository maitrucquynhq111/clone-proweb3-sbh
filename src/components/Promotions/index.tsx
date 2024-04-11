import { useTranslation } from 'react-i18next';
import { Button, Drawer } from 'rsuite';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'react-use';
import { promotionFormSchema, promotionsInitStateFunc } from './config';
import { CommingSoonModal, DrawerBody, DrawerFooter, DrawerHeader } from '~app/components';
import FormLayout from '~app/components/HookForm/FormLayout';
import { usePromotionsQuery } from '~app/services/queries/usePromotionsQuery';
import { checkValidPromotion } from '~app/features/pos/utils';

type Props = {
  orderTotal: number;
  open: boolean;
  promotionCode?: string;
  onChange: (promotion: SelectedPromotion | null) => void;
  onClose: () => void;
};

const useDataQuery = ({ query, initStateFunc, orderTotal, selectedPromotion }: ExpectedAny) => {
  const { isLoading, data, queryKey, refetch } = query(initStateFunc());
  const memoizedData = useMemo(() => {
    const result = (data?.data || []) as SelectedPromotion[] & { valid: boolean };
    return result
      .sort((a, b) => +(a.min_order_price > orderTotal) - +(b.min_order_price > orderTotal))
      .map((promotion) => {
        const valid = checkValidPromotion({ promotion, orderTotal });
        return { ...promotion, valid, selected: selectedPromotion?.promotion_code === promotion.promotion_code };
      });
  }, [data, selectedPromotion, orderTotal]);

  const total_page = useMemo(() => {
    if (data?.meta) return data.meta.total_pages as number;
    return 0;
  }, [data]);

  return {
    data: memoizedData,
    total_page,
    isLoading,
    queryKey,
    refetch,
  };
};

const Promotions = ({ orderTotal, open, promotionCode, onChange, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('pos');
  const [search, setSearch] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [selectedPromotion, setSelectedPromotion] = useState<SelectedPromotion | null>(null);
  const [commingSoon, setCommingSoon] = useState(false);

  const { data } = useDataQuery({
    query: usePromotionsQuery,
    initStateFunc: () => ({
      ...promotionsInitStateFunc(),
      page,
      name: debouncedSearchValue,
    }),
    orderTotal,
    selectedPromotion,
  });

  const allInvalid = useMemo(() => data.every((promotion) => !promotion.valid), []);

  useEffect(() => {
    if (promotionCode) {
      setSelectedPromotion(data.find((promotion) => promotion.promotion_code === promotionCode) || null);
    }
  }, [promotionCode]);

  useDebounce(
    () => {
      setDebouncedSearchValue(search);
      setPage(1);
    },
    300,
    [search],
  );

  const handleClose = () => {
    onClose();
  };

  const handleApply = () => {
    try {
      // check has selected and all invalid (cus unqualified promotion when change price)
      // then remove selected promotion when submit
      onChange(allInvalid && promotionCode ? null : selectedPromotion);
      handleClose();
    } catch (_) {
      // TO DO
    }
  };

  const handleClick = () => {
    setCommingSoon(true);
  };

  return (
    <Drawer open={open} onClose={handleClose} size="md" keyboard={false} backdrop="static">
      <div className="pw-flex pw-flex-col !pw-h-screen">
        <DrawerHeader title={t('apply_promotion')} onClose={handleClose} />
        <div className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden">
          <DrawerBody className="pw-bg-white">
            <FormLayout
              formSchema={promotionFormSchema({
                data,
                search,
                selectedPromotion,
                setSelectedPromotion,
                setSearch,
                handleClick,
              })}
            />
          </DrawerBody>
          <DrawerFooter>
            <Button appearance="ghost" onClick={handleClose}>
              {t('common:cancel')}
            </Button>
            {data.length > 0 && (
              <Button appearance="primary" disabled={!selectedPromotion && !promotionCode} onClick={handleApply}>
                <span>{allInvalid && promotionCode ? t('remove_promotion_and_continue') : t('common:apply')}</span>
              </Button>
            )}
          </DrawerFooter>
        </div>
      </div>
      {commingSoon && <CommingSoonModal open={true} onClose={() => setCommingSoon(false)} />}
    </Drawer>
  );
};

export default Promotions;
