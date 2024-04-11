import { useCallback, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { OrderStatusAnalytics, HeaderSelectAll, TableHeaderAction } from './components';
import { getInitFilterValues, columnOptions, filterOptions, selectAllAction, convertFilter } from './config';
import { Table, Filter, ProductOutOfStock, IngredientOutOfStock } from '~app/components';
import { ORDERS_ANALYTICS_KEY, ORDERS_KEY, useOrdersQuery, usePaymentSourcesQuery } from '~app/services/queries';
import { defaultUpdateOrder } from '~app/features/orders/utils';
import { OrderResponseType, OrderStatusType } from '~app/utils/constants';
import { useUpdateOrderMutation } from '~app/services/mutations/useUpdateOrderMutation';
import { queryClient } from '~app/configs/client';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { CancelOrderModal, RefuseOrderModal } from '~app/features/orders/components';
import { OrderPermission, useHasPermissions } from '~app/utils/shield';
import { EmptyStateOrder } from '~app/components/Icons';
import { isJsonString } from '~app/utils/helpers';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  order?: Order | null;
  orderId?: string;
  amount?: number;
  onSuccess?(): void;
};

const OnlineOrders = (): JSX.Element => {
  const { t } = useTranslation(['orders-table', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  const stateDefault = location.state?.state && location.state.state;
  const initFilterValues = getInitFilterValues({
    stateDefault: stateDefault,
    dateRangeDefault: stateDefault ? [] : undefined,
  });

  const tableRef = useRef<ExpectedAny>();
  const filterRef = useRef<ExpectedAny>();
  const [selectedRow, setSelectedRow] = useState<Order | null>(null);
  const [isCancel, setIsCancel] = useState(false);
  const [variablesFilter, setVariablesFilter] = useState<ExpectedAny>(convertFilter(initFilterValues.primary));
  const [responseOrder, setResponseOrder] = useState<ExpectedAny>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const { mutateAsync } = useUpdateOrderMutation();
  const canCreateOrder = useHasPermissions([OrderPermission.ORDER_CART_CREATE]);
  const canViewDetail = useHasPermissions([OrderPermission.ORDER_ORDERDETAIL_UPDATE]);

  const { data } = usePaymentSourcesQuery({
    page: 1,
    page_size: 10,
    type: 'default',
    sort: 'priority asc',
  });

  const handleSuccess = () => {
    setSelectedRow(null);
  };

  useEffect(() => {
    if (location.state) {
      const paymentStatusState =
        location.state?.payment_status && isJsonString(location.state?.payment_status)
          ? JSON.parse(location.state?.payment_status)
          : [];
      filterRef?.current?.handleSetSecondaryVariables({
        payment_status: paymentStatusState,
      });
      filterRef?.current?.setValueSecondaryFilter('payment_status', paymentStatusState);
      // clear the state location
      navigate(location.pathname, { replace: true });
    }
  }, []);

  const handleFilter = useCallback(
    (values: ExpectedAny) => {
      const variables = convertFilter({ ...values, state: variablesFilter.state });
      setVariablesFilter(variables);
      tableRef?.current?.setVariables(variables);
    },
    [variablesFilter],
  );

  const handleFilterStatus = useCallback(
    (state: ExpectedAny) => {
      const variables = { ...variablesFilter, state };
      setVariablesFilter(variables);
      tableRef?.current?.setVariables(variables);
    },
    [variablesFilter],
  );

  const reValidateQuery = () => {
    queryClient.invalidateQueries([ORDERS_KEY], { exact: false });
    queryClient.invalidateQueries([ORDERS_ANALYTICS_KEY], { exact: false });
  };

  const handleSubmitCancelSuccess = () => {
    setIsCancel(false);
    setSelectedRow(null);
    reValidateQuery();
  };

  const handleClickAction = async (order: Order, action?: string) => {
    try {
      if (action === 'cancel') {
        if (order.state === OrderStatusType.COMPLETE) {
          const amount = order?.amount_paid || 0;
          const modalData: ModalData = {
            modal: ModalTypes.CancelCompleteOrder,
            size: ModalSize.Xsmall,
            placement: ModalPlacement.Right,
            orderId: order.id,
            amount: amount,
            onSuccess: () => {
              setModalData(null);
              handleSubmitCancelSuccess();
              return;
            },
          };
          return setModalData(modalData);
        }
        // state waiting_confirm & delivering
        setIsCancel(true);
        setSelectedRow(order);
        return;
      }
      if (order.state === OrderStatusType.DELIVERING) {
        if (order.amount_paid - order.grand_total >= 0) {
          const body = {
            state: OrderStatusType.COMPLETE,
            additional_info: {},
            payment_source_id: null,
            payment_source_name: null,
            reservation_info: null,
          };
          const response = await mutateAsync({ id: order.id, body });
          if (response?.status) return setResponseOrder(response);
          reValidateQuery();
          return toast.success(t('orders-form:success.update'));
        }
        setModalData({
          modal: ModalTypes.ConfirmPaying,
          size: ModalSize.Xsmall,
          placement: ModalPlacement.Right,
          order: order,
          onSuccess: handleSuccess,
        });
        setSelectedRow(order);
        return;
      }
      if (data?.data?.[0]) {
        // state = waiting_confirm
        let nextOrder = defaultUpdateOrder({
          state: OrderStatusType.DELIVERING,
          buyer_pay: order.amount_paid,
          paymentMethod: data.data[0],
        });
        if (order.state === OrderStatusType.DELIVERING) {
          nextOrder = defaultUpdateOrder({
            state: OrderStatusType.COMPLETE,
            buyer_pay: order.amount_paid,
            paymentMethod: {
              id: order.payment_order_history[0]?.id || '',
              name: order.payment_order_history[0]?.name || '',
            },
          });
        }
        const response = await mutateAsync({ id: order.id, body: nextOrder });
        if (response?.status) {
          setResponseOrder(response);
          return;
        }
        reValidateQuery();
        toast.success(t('orders-form:success.update'));
      }
    } catch (_) {
      // TO DO
    }
  };

  const handleCancelOrder = async (cancel_transaction?: string[]) => {
    try {
      if (!selectedRow) return;
      if (selectedRow.state === OrderStatusType.WAITING_CONFIRM) {
        const body = {
          state: OrderStatusType.CANCEL,
          debit: null,
          additional_info: {},
          payment_source_id: null,
          payment_source_name: null,
          reservation_info: null,
        };
        await mutateAsync({ id: selectedRow.id, body });
        handleSubmitCancelSuccess();
        toast.success(t('orders-form:success.update'));
      }
      if (selectedRow.state === OrderStatusType.DELIVERING) {
        const body = {
          state: OrderStatusType.CANCEL,
          debit: null,
          additional_info: {},
          payment_source_id: null,
          payment_source_name: null,
          reservation_info: selectedRow?.reservation_meta ? selectedRow.reservation_meta : null,
          is_customer_point: selectedRow?.customer_point_discount > 0 ? true : false,
          cancel_transaction,
        };
        await mutateAsync({ id: selectedRow.id, body });
        handleSubmitCancelSuccess();
        toast.success(t('orders-form:success.update'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseCancel = () => {
    setIsCancel(false);
    setSelectedRow(null);
  };

  const onRowClick = (rowData: Order) => {
    if (!canViewDetail) return;
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.OrderDetails,
        id: rowData.order_number,
      })}`,
    });
  };
  const emptyDescription = variablesFilter?.state ? t(`common:empty-state.${variablesFilter.state}`) : null;

  return (
    <div>
      <Table<ExpectedAny, ExpectedAny>
        headerSelectAll={({ selectedData }: { selectedData: Order[] }) => {
          return <HeaderSelectAll selected={selectedData} />;
        }}
        ref={tableRef}
        selectAllAction={selectAllAction()}
        columnOptions={columnOptions({ status: variablesFilter.state, onClick: handleClickAction })}
        variables={convertFilter(initFilterValues.primary)}
        query={useOrdersQuery}
        onRowClick={onRowClick}
        selectable
        compact
        dataKey="id"
        headerButton={<TableHeaderAction options={variablesFilter} canCreateOrder={canCreateOrder} />}
        headerFilter={
          <Filter
            ref={filterRef}
            initValues={initFilterValues}
            onFilter={handleFilter}
            filterOptions={filterOptions({
              dateRangeDefault: stateDefault ? [null, null] : undefined,
            })}
          />
        }
        emptyIcon={variablesFilter.state ? <EmptyStateOrder /> : null}
        emptyDescription={emptyDescription}
        subHeader={
          <OrderStatusAnalytics
            initValues={variablesFilter}
            value={variablesFilter.state}
            onChange={handleFilterStatus}
          />
        }
      />
      {modalData && !isCancel && (
        <ModalRendererInline
          onClose={() => {
            setSelectedRow(null);
            setModalData(null);
          }}
          {...modalData}
        />
      )}
      {selectedRow && selectedRow.state === OrderStatusType.WAITING_CONFIRM && isCancel && (
        <RefuseOrderModal open={isCancel} setOpen={handleCloseCancel} onClick={handleCancelOrder} />
      )}
      {selectedRow && selectedRow.state === OrderStatusType.DELIVERING && isCancel && (
        <CancelOrderModal
          paymentOrderHistory={selectedRow?.payment_order_history || []}
          open={isCancel}
          onClose={handleCloseCancel}
          onClick={handleCancelOrder}
        />
      )}
      {responseOrder && responseOrder.status === OrderResponseType.SOLD_OUT && (
        <ProductOutOfStock
          data={responseOrder.items_info}
          hideDelete
          open={true}
          onClose={() => setResponseOrder(null)}
        />
      )}
      {responseOrder && responseOrder.status === OrderResponseType.SOLD_OUT_GREDIENT && (
        <IngredientOutOfStock
          data={responseOrder.list_ingredient}
          hideDelete
          open={true}
          onClose={() => setResponseOrder(null)}
        />
      )}
    </div>
  );
};
export default OnlineOrders;
