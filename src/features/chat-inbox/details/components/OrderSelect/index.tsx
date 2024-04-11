import { useTranslation } from 'react-i18next';
import { Button, Placeholder } from 'rsuite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import OrderSelectItem from './OrderSelectItem';
import OrderTab, { OrderTabEnum } from './OrderTab';
import { DebouncedInput, EmptyState, InfiniteScroll } from '~app/components';
import { EmptyStateOrder, NoDataImage } from '~app/components/Icons';
import { useOrdersHistoryQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';
import { useCurrentConversation } from '~app/utils/hooks';
import { getParticipant } from '~app/features/chat-inbox/utils';

type Props = { defaultTab: string; onChange(value: string[]): void; onClose(): void };

const OrderSelect = ({ defaultTab, onChange, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('chat');
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [list, setList] = useState<OrderHistory[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const { currentConversation } = useCurrentConversation();

  const participant = useMemo(() => {
    if (!currentConversation) return null;
    const me = getParticipant(currentConversation.participants, true);
    const other = getParticipant(currentConversation.participants, false);
    return { me, other };
  }, [currentConversation]);

  const { data, isLoading } = useOrdersHistoryQuery({
    page,
    pageSize: 10,
    search,
    seller_id:
      activeTab === OrderTabEnum.ORDER_BUY ? participant?.other?.sender_id || '' : participant?.me?.sender_id || '',
    buyer_id:
      activeTab === OrderTabEnum.ORDER_BUY ? participant?.me?.sender_id || '' : participant?.other?.sender_id || '',
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
    return () => {
      onClose();
    };
  }, []);

  const handleSelect = (order: Order, checked: boolean) => {
    if (checked) {
      return setSelectedOrders([...selectedOrders, order]);
    }
    setSelectedOrders(selectedOrders.filter((selectedOrder) => selectedOrder.id !== order.id));
  };

  const handleSubmit = () => {
    onChange(selectedOrders.map((order) => order.order_number));
    onClose();
  };

  return (
    <>
      <OrderTab active={activeTab} setActive={setActiveTab} />
      {!search && list.length === 0 && (
        <EmptyState
          icon={<EmptyStateOrder size="120" />}
          description1={t('empty_state_order')}
          hiddenButton
          className="pw-mb-4 pw-mt-2 pw-mx-4"
        />
      )}
      {(search || list.length > 0) && (
        <div className="pw-p-4">
          <DebouncedInput
            value=""
            onChange={(value) => {
              page > 1 && setPage(1);
              contentRef?.current?.scroll({ top: 0 });
              setSearch(value);
            }}
            placeholder={t('placeholder.order') || ''}
          />
        </div>
      )}
      <div className="pw-p-4 pw-pt-0 pw-pr-0 pw-w-150">
        {isLoading && (
          <div className="pw-mt-3">
            <Placeholder.Graph active className="pw-rounded" height={200} />
          </div>
        )}
        {list.length > 0 && (
          <div ref={contentRef} className="pw-overflow-y-auto pw-overflow-x-hidden pw-h-[40vh]">
            <InfiniteScroll next={next} hasMore={!isLastPage}>
              {list.map((orderHistory) => {
                const checked = selectedOrders.some((selectedOrder) => selectedOrder.id === orderHistory.order_id);
                return (
                  <OrderSelectItem
                    key={orderHistory.id}
                    order={orderHistory.order}
                    checked={checked}
                    onChange={handleSelect}
                  />
                );
              })}
            </InfiniteScroll>
          </div>
        )}
        {search && list.length > 0 && (
          <div className="pw-h-[40vh] pw-flex pw-flex-col pw-items-center pw-justify-center">
            <NoDataImage width={120} height={120} />
            <div className="pw-text-base">{t('common:no-data')}</div>
          </div>
        )}
        {(search || list.length > 0) && (
          <div className="pw-flex pw-pt-4 pw-pr-6 pw-bg-white pw-shadow-sm">
            <Button
              appearance="ghost"
              className="!pw-text-neutral-primary !pw-border-neutral-border !pw-text-base !pw-font-bold !pw-py-3 pw-w-full"
              disabled={selectedOrders.length === 0}
              onClick={() => setSelectedOrders([])}
            >
              {t('action.delete_selected')}
            </Button>
            <Button
              appearance="primary"
              className="!pw-text-base !pw-font-bold !pw-py-3 pw-w-full pw-ml-4"
              disabled={selectedOrders.length === 0}
              onClick={handleSubmit}
            >
              {t('common:send')} {selectedOrders.length > 0 ? `(${selectedOrders.length})` : ''}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderSelect;
