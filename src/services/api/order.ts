import qs from 'querystring';
import AuthService from './auth';
import { API_URI } from '~app/configs';
import { fetchData, fetchAll, put, post, patch } from '~app/utils/helpers';

async function getOrders({
  page,
  pageSize,
  state,
  search,
  start_time,
  end_time,
  staff_creator_ids = [],
  payment_status = [],
  create_method = [],
  payment_method = [],
  sort = 'created_at desc',
  contact_id,
}: OrdersParams & {
  payment_status?: string[];
  create_method?: string[];
  payment_method?: string[];
}) {
  const business_id = await AuthService.getBusinessId();
  const { data, meta } = await fetchAll<{
    data: Order[];
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-order/api/v3/get-list-order?${qs.stringify({
      business_id: business_id,
      state: state || undefined,
      search: search || undefined,
      page: page,
      size: pageSize,
      contact_id,
      date_from: start_time || '2020-04-05T17:00:00.000Z',
      date_to: end_time || '2080-04-05T17:23:59.000Z',
      sort,
      staff_creator_ids: staff_creator_ids.join(','),
      payment_status: payment_status.join(','),
      create_method: create_method.join(','),
      payment_method: payment_method.join(','),
    })}`,
    { authorization: true },
  );

  return { data, meta };
}

async function createOrder(body: PendingOrderForm) {
  const business_id = await AuthService.getBusinessId();
  return await post<Order>(
    `${API_URI}/finan-order/api/v8/seller/create-order`,
    {
      ...body,
      business_id,
    },
    {
      authorization: true,
    },
  );
}

async function updateOrder(id: string, body: UpdateOrderInput) {
  return await put<Order>(`${API_URI}/finan-order/api/v7/seller/update-order/${id}`, body, {
    authorization: true,
  });
}

async function cancelCompleteOrder(id: string, body: CancelCompleteOrderBody) {
  return await patch<Order>(`${API_URI}/finan-order/api/v1/seller/cancel-order/${id}`, body, {
    authorization: true,
  });
}

async function cancelMultiOrder(body: CancelMultiOrderBody) {
  return await put<{ data: string }>(`${API_URI}/finan-order/api/v1/order/cancel-multi`, body, {
    authorization: true,
  });
}

async function updateOrderDetail({ id, body }: { id: string; body: CreateOrderInput }) {
  const res = await put<Order>(`${API_URI}/finan-order/api/v6/seller/update-detail-order/${id}`, body, {
    authorization: true,
  });
  return res;
}

async function updateOrderRefund({ id, body }: { id: string; body: UpdateOrderRefundBody }) {
  const business_id = await AuthService.getBusinessId();
  const res = await put<Order>(
    `${API_URI}/finan-order/api/v1/order-refund/update/${id}`,
    { ...body, business_id },
    {
      authorization: true,
    },
  );
  return res;
}

async function getOrder(orderNumber: string) {
  const order = await fetchData<JSONRecord<Order>>(`${API_URI}/finan-order/api/v3/order/get-detail/${orderNumber}`, {
    authorization: true,
  });
  return order;
}

async function getOrderTracking(order_id: string) {
  return fetchData<Array<OrderTracking>>(
    `${API_URI}/finan-order/api/v1/get-order-tracking?${qs.stringify({
      order_id: order_id,
    })}`,
    {
      authorization: true,
    },
  );
}

async function createCustomPaid(customPaid: CreateCustomPaid) {
  const custompaid = await post<CreateCustomPaid>(
    `${API_URI}/finan-order/api/v1/payment-order-history/create`,
    { ...customPaid },
    {
      authorization: true,
    },
  );
  return custompaid;
}

async function getCustomPaid(business_id: string, order_id: string) {
  const custompaid = await fetchData<Array<JSONRecord<PaymentOrderHistory>>>(
    `${API_URI}/finan-order/api/v1/payment-order-history/get-list?${qs.stringify({
      business_id: business_id,
      order_id: order_id,
    })}`,
    {
      authorization: true,
    },
  );
  return custompaid;
}

async function getOrderAnalysis({
  business_id,
  start_time,
  end_time,
  staff_creator_ids,
  payment_status,
  create_method,
  payment_method,
  search,
}: {
  business_id: string;
  start_time: string;
  end_time: string;
  staff_creator_ids: string[];
  payment_status: string[];
  create_method: string[];
  payment_method: string[];
  search: string;
}) {
  const orderAnalysis = await fetchData<OrderStateAnalytics>(
    `${API_URI}/finan-order/api/v2/count-order-state?${qs.stringify({
      business_id,
      date_from: start_time || '2020-04-05T17:00:00.000Z',
      date_to: end_time || '2080-04-05T17:23:59.000Z',
      search,
      staff_creator_ids,
      payment_status,
      create_method,
      payment_method,
    })}`,
    {
      authorization: true,
    },
  );
  return orderAnalysis;
}

async function getListStaffs() {
  const orderAnalysis = await fetchAll<{ data: Staff[] }>(
    `${API_URI}/finan-order/api/v1/order/get-list-staff?${qs.stringify({
      group_by: 'creator_id',
    })}`,
    {
      authorization: true,
    },
  );
  return orderAnalysis;
}

async function getConfigInvoice(phone: string) {
  const configInvoice = await post<ConfigInvoice>(
    `${API_URI}/finan-business/api/v1/invoice/get-one-or-create`,
    { phone_number: phone },

    {
      authorization: true,
    },
  );
  return configInvoice;
}

async function getDebtAmountInvoice(contactId: string) {
  const debtAmount = await fetchData<{ debt_amount: number }>(
    `${API_URI}/finan-business/api/v1/contact/get-debt-amount?${qs.stringify({
      contact_id: contactId,
    })}`,
    {
      authorization: true,
    },
  );
  return debtAmount;
}

async function exportData({
  start_time,
  end_time,
  state,
  search,
}: {
  start_time?: string;
  end_time?: string;
  state?: string;
  search?: string;
}) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<string>(
    `${API_URI}/finan-order/api/v3/export-order-report`,
    {
      business_id,
      source: 'order',
      start_time: start_time || '2020-04-05T17:00:00.000Z',
      end_time: end_time || '2080-04-05T17:23:59.000Z',
      state,
      search,
    },
    { authorization: true },
  );
}

const createChatOrder = async (body: PendingChatOrderForm) => {
  const business_id = await AuthService.getBusinessId();
  return await post<Order>(
    `${API_URI}/finan-order/api/v1/chat-order/create`,
    {
      ...body,
      business_id,
    },
    {
      authorization: true,
    },
  );
};

const OrderService = {
  getOrders,
  updateOrder,
  cancelMultiOrder,
  cancelCompleteOrder,
  getOrder,
  getOrderTracking,
  createCustomPaid,
  getCustomPaid,
  updateOrderDetail,
  createOrder,
  getOrderAnalysis,
  getConfigInvoice,
  getDebtAmountInvoice,
  getListStaffs,
  exportData,
  updateOrderRefund,
  createChatOrder,
};
export default OrderService;
