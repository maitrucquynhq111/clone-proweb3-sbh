import { useCallback, useState, useRef, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { initFilterValues, columnOptions, filterOptions, selectAllAction, convertFilter } from './config';
import {
  OrderStatusAnalytics,
  HeaderSelectAll,
  TableHeaderAction,
} from '~app/features/contacts/details/components/ContactTabs/Order/components';
import { Table, Filter, ProductOutOfStock, IngredientOutOfStock } from '~app/components';
import { CancelOrderModal, RefuseOrderModal } from '~app/features/orders/components';
import { useOrdersQuery, usePaymentSourcesQuery, ORDERS_ANALYTICS_KEY, ORDERS_KEY } from '~app/services/queries';
import { useUpdateOrderMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import { EmptyStateOrder } from '~app/components/Icons';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { OrderResponseType, OrderStatusType } from '~app/utils/constants';
import { defaultUpdateOrder } from '~app/features/orders/utils';
import { OrderPermission, useHasPermissions } from '~app/utils/shield';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  order?: Order | null;
  orderId?: string;
  id?: string;
  amount?: number;
  onSuccess?(): void;
};

const Order = (): JSX.Element => {
  const { t } = useTranslation(['orders-table', 'common']);
  const tableRef = useRef<ExpectedAny>();
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [selectedRow, setSelectedRow] = useState<Order | null>(null);
  const [responseOrder, setResponseOrder] = useState<ExpectedAny>(null);
  const [isCancel, setIsCancel] = useState(false);
  const [searchParams] = useSearchParams();
  const contact_id = searchParams.get('id') as string;
  const canDelete = useHasPermissions([OrderPermission.ORDER_ORDERDETAIL_DELETE]);
  const canViewDetail = useHasPermissions([OrderPermission.ORDER_ORDERDETAIL_UPDATE]);

  const { mutateAsync } = useUpdateOrderMutation();
  const { data: dataPaymentSource } = usePaymentSourcesQuery({
    page: 1,
    page_size: 10,
    type: 'default',
    sort: 'priority asc',
  });
  const [variablesFilter, setVariablesFilter] = useState<ExpectedAny>(convertFilter(initFilterValues.primary));

  const metaData = useMemo(() => {
    return tableRef?.current?.getMetaData();
  }, [variablesFilter]);

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

  const handleSuccess = () => {
    setSelectedRow(null);
  };

  const handleCloseCancel = () => {
    setIsCancel(false);
    setSelectedRow(null);
  };

  const reValidateQuery = () => {
    queryClient.invalidateQueries([ORDERS_KEY], { exact: false });
    queryClient.invalidateQueries([ORDERS_ANALYTICS_KEY], { exact: false });
  };

  const handleSubmitCancelSuccess = () => {
    setIsCancel(false);
    setSelectedRow(null);
    reValidateQuery();
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

  const handleClickAction = async (order: Order, action?: string) => {
    try {
      if (!canViewDetail) return;
      if (action === 'edit') {
        const modalData: ModalData = {
          modal: ModalTypes.OrderDetails,
          size: ModalSize.Full,
          placement: ModalPlacement.Top,
          id: order.order_number,
          onSuccess: () => {
            setModalData(null);
            return;
          },
        };
        return setModalData(modalData);
      }
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
      if (dataPaymentSource?.data?.[0]) {
        // state = waiting_confirm
        let nextOrder = defaultUpdateOrder({
          state: OrderStatusType.DELIVERING,
          buyer_pay: order.amount_paid,
          paymentMethod: dataPaymentSource.data[0],
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

  const emptyDescription = variablesFilter?.state ? t(`common:empty-state.${variablesFilter.state}`) : null;

  return (
    <div className="pw-mt-4">
      <Table<ExpectedAny, ExpectedAny>
        headerSelectAll={({ selectedData }: { selectedData: Order[] }) => {
          return <HeaderSelectAll selected={selectedData} />;
        }}
        ref={tableRef}
        selectAllAction={selectAllAction()}
        columnOptions={columnOptions({ status: variablesFilter.state, onClick: handleClickAction })}
        variables={{ ...convertFilter(initFilterValues.primary), contact_id }}
        query={useOrdersQuery}
        onRowClick={(rowData: Order) => handleClickAction(rowData, 'edit')}
        selectable={canDelete}
        compact
        dataKey="id"
        headerButton={<TableHeaderAction options={variablesFilter} />}
        headerFilter={<Filter initValues={initFilterValues} onFilter={handleFilter} filterOptions={filterOptions()} />}
        emptyIcon={variablesFilter.state ? <EmptyStateOrder /> : null}
        emptyDescription={emptyDescription}
        subHeader={
          <OrderStatusAnalytics dataMeta={metaData} value={variablesFilter.state} onChange={handleFilterStatus} />
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

export default Order;
