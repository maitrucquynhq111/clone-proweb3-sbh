import cx from 'classnames';
import { memo, useEffect, useCallback, useSyncExternalStore } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { BsPlusCircleFill } from 'react-icons/bs';
import { useLocation } from 'react-router-dom';
import { IconButton } from 'rsuite';
import { SCROLL_RACE, WIDTH_HEADER_EXCEPT_ORDER_TABS } from '../../constants';
import OrderTabItem from '~app/features/pos/components/OrderTabs/OrderTabItem';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import {
  getLocalPendingOrders,
  initialOrder,
  saveLocalPendingOrders,
  getLocalSelectedOrderId,
  DeliveryMethodType,
  initialOrderTable,
} from '~app/features/pos/utils';
import { useOrderDetailQuery, usePromotionsQuery } from '~app/services/queries';
import { productStore } from '~app/features/pos/stores/productStore';

type Props = {
  className?: string;
};

const OrderTabs = ({ className }: Props) => {
  const location = useLocation();
  const [pendingOrders, setPosStore] = usePosStore((store) => store.pending_orders);
  const [selectedOrder, setSelectedOrderStore] = useSelectedOrderStore((store) => store);
  const { data: orderDetail } = useOrderDetailQuery(!location.state?.is_change_table ? location.state?.order_id : '');
  const { data: promotions } = usePromotionsQuery({
    page: 1,
    page_size: 1,
    name: orderDetail?.promotion_code || '',
    enabled: !!orderDetail?.promotion_code,
  });
  const products = useSyncExternalStore(productStore.subscribe, productStore.getSnapshot);
  const tabsOrderElement = document.getElementById('pw-order-tabs');

  const handleCreateTab = (deliveryMethod?: string) => {
    const orders = getLocalPendingOrders();
    const newPendingOrder = initialOrder();
    if (deliveryMethod) newPendingOrder.delivery_method = deliveryMethod;
    setPosStore((store) => {
      let newPendingOrders = [...orders];
      newPendingOrders = newPendingOrders.map((order) => {
        if (order.id === selectedOrder.id) {
          return selectedOrder;
        }
        return order;
      });
      newPendingOrders.push(newPendingOrder);
      saveLocalPendingOrders(newPendingOrders, selectedOrder?.id || '');
      return { ...store, pending_orders: newPendingOrders };
    });
    setSelectedOrderStore(() => newPendingOrder);
  };

  const handleCreateTabFromTable = ({ reservation }: { reservation?: ReservationMeta }) => {
    const orders = getLocalPendingOrders();
    const existedOrder = orders.find((order) => order.reservation_info?.table_id === reservation?.table_id);
    // if click table again then not create new order
    if (existedOrder) {
      setPosStore((store) => {
        saveLocalPendingOrders(orders, existedOrder.id || '');
        return { ...store, pending_orders: orders };
      });
      setSelectedOrderStore(() => existedOrder);
      return;
    }
    const newPendingOrder = initialOrder(reservation);
    setPosStore((store) => {
      const newPendingOrders = [...orders, newPendingOrder];
      saveLocalPendingOrders(newPendingOrders, newPendingOrder.id || '');
      return { ...store, pending_orders: newPendingOrders };
    });
    setSelectedOrderStore(() => newPendingOrder);
  };

  const handleRemoveTab = (id: string) => {
    if (selectedOrder.id !== id) {
      return setPosStore((store) => {
        const newPendingOrders = store.pending_orders.filter((order) => order.id !== id);
        saveLocalPendingOrders(newPendingOrders, selectedOrder?.id || '');
        return { ...store, pending_orders: newPendingOrders };
      });
    } else {
      const newPendingOrders = pendingOrders.filter((order) => order.id !== id);
      setPosStore((store) => {
        saveLocalPendingOrders(newPendingOrders, selectedOrder?.id || '');
        return { ...store, pending_orders: newPendingOrders };
      });
      setSelectedOrderStore((store) => {
        const newPendingOrder = newPendingOrders[0];
        if (!newPendingOrder) return store;
        return { ...newPendingOrder };
      });
    }
  };

  const getMaxWidthOrderTabs = () => {
    return screen.width - WIDTH_HEADER_EXCEPT_ORDER_TABS;
  };

  const moveOrderTabs = (position: number) => {
    if (tabsOrderElement) {
      tabsOrderElement.scrollLeft += position;
    }
  };

  const getPositionSelectedTab = () => {
    const newOrderIndex = pendingOrders.findIndex((order) => order.id === selectedOrder.id);
    if (tabsOrderElement && newOrderIndex > -1) {
      let position = 0;
      for (let index = 0; index < newOrderIndex; index++) {
        position += tabsOrderElement.children[index]?.getBoundingClientRect()?.width || 0;
      }
      return position;
    }
    return 0;
  };

  const handleScrollHorizontal = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (tabsOrderElement) {
        if (e.deltaY > 0)
          // Scroll right
          tabsOrderElement.scrollLeft += SCROLL_RACE;
        // Scroll left
        else tabsOrderElement.scrollLeft -= SCROLL_RACE;
      }
    },
    [tabsOrderElement],
  );

  useEffect(() => {
    if (tabsOrderElement) {
      tabsOrderElement.addEventListener('wheel', handleScrollHorizontal);
      return () => {
        tabsOrderElement.removeEventListener('wheel', handleScrollHorizontal);
      };
    }
  }, [tabsOrderElement]);

  useEffect(() => {
    if (tabsOrderElement) {
      // Scroll to active tab when create/remove tab
      tabsOrderElement.scrollLeft = Math.round(getPositionSelectedTab());
    }
  }, [pendingOrders.length]);

  useEffect(() => {
    // create order from using table
    if (orderDetail && products.length > 0) {
      const orders = getLocalPendingOrders();
      const existedOrder = orders.find((order) => order.id === orderDetail.id);
      let newPendingOrder = initialOrderTable({
        order: orderDetail,
        products,
        promotion: (promotions?.data && promotions.data[0]) || null,
      });
      if (existedOrder) {
        // Update newest detail order
        newPendingOrder = { ...existedOrder, ...newPendingOrder };
      }
      setPosStore((store) => {
        const newPendingOrders = removeDuplicates([...orders, newPendingOrder], 'id');
        saveLocalPendingOrders(newPendingOrders, newPendingOrder.id || '');
        return { ...store, pending_orders: newPendingOrders };
      });
      setSelectedOrderStore(() => newPendingOrder);
    }
  }, [orderDetail, promotions]);

  useEffect(() => {
    let newPendingOrders = getLocalPendingOrders();
    const selectedOrderId = getLocalSelectedOrderId();
    const newOrder = newPendingOrders.find((order) => order.id === selectedOrderId) || newPendingOrders[0];
    if (!newOrder) return;
    const locationState: SelectedTable & { tab_method: string } = location.state;
    if (locationState) {
      const { order_id, is_change_table, tab_method, ...reservation_info } = locationState;
      // create order from available table
      if (tab_method === DeliveryMethodType.TABLE && !is_change_table && !order_id) {
        handleCreateTabFromTable({ reservation: reservation_info });
      }
      // change table from existed order
      if (tab_method === DeliveryMethodType.TABLE && is_change_table) {
        const newPendingOrder = {
          ...selectedOrder,
          ...newOrder,
          delivery_method: DeliveryMethodType.TABLE,
          reservation_info: { ...reservation_info, order_id },
        };
        setSelectedOrderStore(() => newPendingOrder);
        setPosStore((store) => {
          newPendingOrders = removeDuplicates([...newPendingOrders, newPendingOrder], 'id');
          saveLocalPendingOrders(newPendingOrders, newPendingOrder.id || '');
          return { ...store, pending_orders: newPendingOrders };
        });
      }
      // create new tab
      if (tab_method !== DeliveryMethodType.TABLE) {
        handleCreateTab(tab_method);
      }
      window.history.replaceState({}, document.title);
    } else {
      setSelectedOrderStore((store) => {
        return { ...store, ...newOrder };
      });
      setPosStore((store) => ({ ...store, pending_orders: newPendingOrders }));
    }
  }, []);

  return (
    <div className={cx(`pw-flex pw-items-start pw-gap-x-2`, className)}>
      {getMaxWidthOrderTabs() < (tabsOrderElement?.scrollWidth || 300) && (
        <button className="pw-flex pw-h-10 pw-justify-center pw-items-center pw-rounded pw-bg-neutral-white">
          <HiChevronLeft size={20} onClick={() => moveOrderTabs(SCROLL_RACE * -1)} />
        </button>
      )}
      <div
        id="pw-order-tabs"
        style={{ maxWidth: `${getMaxWidthOrderTabs()}px` }}
        className="pw-flex pw-gap-x-2 pw-whitespace-nowrap pw-overflow-x-auto scrollbar-none"
      >
        {pendingOrders.map((item, index) => {
          return (
            <div key={item.id} className="pw-max-w-37.5 pw-duration-200">
              <OrderTabItem key={item.id} index={index} pendingOrder={item} onClick={handleRemoveTab} />
            </div>
          );
        })}
      </div>
      {getMaxWidthOrderTabs() < (tabsOrderElement?.scrollWidth || 300) && (
        <button className="pw-flex pw-h-10 pw-justify-center pw-items-center pw-rounded pw-bg-neutral-white">
          <HiChevronRight size={20} onClick={() => moveOrderTabs(SCROLL_RACE)} />
        </button>
      )}
      <IconButton
        onClick={() => handleCreateTab()}
        className="!pw-bg-transparent !pw-overflow-visible !pw-w-max !pw-py-2 !pw-px-0"
        icon={<BsPlusCircleFill size={24} className="pw-text-neutral-white" />}
      />
    </div>
  );
};

export default memo(OrderTabs);
