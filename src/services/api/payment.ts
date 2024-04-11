import qs from 'qs';
import AuthService from './auth';
import { API_URI } from '~app/configs';
import { fetchAll, fetchData, post } from '~app/utils/helpers';

type GetPaymentsProps = {
  type?: string;
  page: number;
  page_size: number;
  sort?: string;
};

async function getPayments({ type, sort, page = 1, page_size = 75 }: GetPaymentsProps) {
  const business_id = await AuthService.getBusinessId();
  const params = {
    business_id,
    page,
    page_size,
    sort: sort || 'created_at asc',
  };

  if (type) {
    Object.assign(params, { type });
  }
  return fetchAll<{ data: Payment[]; meta: ResponseMeta }>(
    `${API_URI}/finan-transaction/api/v1/payment-source/get-list?${qs.stringify(params)}`,
    {
      authorization: true,
    },
  );
}

async function createPayment(payment: PendingPayment) {
  const business_id = await AuthService.getBusinessId();
  return await post<JSONRecord<Payment>>(
    `${API_URI}/finan-transaction/api/v1/payment-source/create`,
    { ...payment, business_id },
    { authorization: true },
  );
}

async function getPaymentsInfo() {
  const business_id = await AuthService.getBusinessId();
  const params = {
    business_id,
    sort: 'payment_method',
  };

  return fetchData<Array<PaymentInfo>>(
    `${API_URI}/ms-payment-management/api/payment-info/get-list?${qs.stringify(params)}`,
    {
      authorization: true,
    },
  );
}

async function getLinkedBanks() {
  return fetchData<Array<LinkedBank>>(`${API_URI}/banking-account-management/api/v1/account/get-list-linked-bank`, {
    authorization: true,
  });
}

async function getEPaymentMethods(payment_type?: string) {
  const params = {
    payment_type,
  };
  return fetchData<Array<EPaymentMethod>>(
    `${API_URI}/ms-payment-management/api/v1/e-payment-method/get-list?${qs.stringify(params)}`,
    {
      authorization: true,
    },
  );
}

async function checkTurnOnNeoX() {
  const business_id = await AuthService.getBusinessId();
  return fetchData<ExpectedAny>(
    `${API_URI}/finan-metadata/api/v1/per-setting/get-payment-method?object_id=${business_id}&object_type=business&setting_key=neopay`,
    {
      authorization: true,
    },
  );
}

const PaymentService = {
  getPayments,
  createPayment,
  getPaymentsInfo,
  getLinkedBanks,
  getEPaymentMethods,
  checkTurnOnNeoX,
};

export default PaymentService;
