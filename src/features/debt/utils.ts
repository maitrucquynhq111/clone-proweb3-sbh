import { addDays } from 'date-fns';
import { DebtbookObjectType } from '~app/utils/constants';
import {
  getCashbookCategoryName,
  getCashbookDescription,
  getCashbookTransactionType,
  getContactTransactionDescription,
  getContactTransactionType,
} from '~app/utils/helpers';

export const defaultDebtbook = (): PendingContactTransaction => ({
  transaction_type: '',
  amount: 0,
  business_id: '',
  currency: 'VND',
  description: '',
  payment_method: '',
  payment_information: null,
  contact_id: '',
  contact_name: '',
  images: [],
  action: '',
  start_time: new Date(Date.now()),
  end_time: null,
  reminder_day: addDays(new Date(), 1),
});

export const defaultContactTransaction = () => {
  return {
    transaction_type: '',
    business_id: '',
    amount: 0,
    max_amount: 0,
    images: [] as ExpectedAny[],
    description: '',
    currency: 'VND',
    contact_id: '',
    contact_name: '',
    category_id: '',
    category_name: '',
    payment_source_id: '',
    payment_source_name: '',
    payment_method: '',
    payment_information: null,
    day: new Date(Date.now()),
    start_time: new Date(Date.now()),
    end_time: null,
    reminder_day: null,
    is_pay_transaction: false,
    is_cashbook: true,
    is_contact_debt: true,
    status: 'paid',
    object_key: '',
    object_type: '',
    action: '',
  };
};

export const toPendingContactTransaction = (data: DefaultContactTransactionType): PendingContactTransaction => {
  const params = {
    amount: data.amount,
    transaction_type: getContactTransactionType(data.object_type, data.transaction_type),
    contact_id: data.contact_id,
    contact_name: data?.contact_name,
    payment_method: data?.payment_method || '',
    payment_information: null,
    object_key: data.object_key,
    object_type: data.object_type,
    start_time: (data.start_time as Date).toISOString(),
    reminder_day: data?.reminder_day ? (data.reminder_day as Date).toISOString() : null,
    end_time: data.end_time,
    action: data.action,
    currency: data.currency,
    is_pay_transaction: data.is_pay_transaction,
    description: data.description,
  } as PendingContactTransaction;
  if (data.object_type === DebtbookObjectType.ORDER) {
    params.option = DebtbookObjectType.ORDER;
  }
  if (data.object_type === DebtbookObjectType.PO) {
    params.option = DebtbookObjectType.PO;
  }
  if (data?.payment_source_id) {
    params.payment_source_name = data?.payment_source_name || '';
    params.payment_source_id = data?.payment_source_id || '';
  }
  return params;
};

export const toPendingCashbook = (data: ReturnType<typeof defaultContactTransaction>): PendingCashbook => {
  const params = {
    business_id: data.business_id,
    currency: data.currency,
    description: !data.is_contact_debt ? getCashbookDescription(data.object_type, data.object_key) : data?.contact_name,
    payment_information: data.payment_information,
    status: data.status,
    amount: data.amount,
    images: data.images,
    day: new Date(data.day as Date).toISOString(),
    object_key: data.object_key,
    object_type: data.object_type,
    category_name: getCashbookCategoryName(data.object_type),
    transaction_type: getCashbookTransactionType(data.object_type, data.transaction_type),
  } as PendingCashbook;
  if (data.is_contact_debt) {
    params.contact_id = data.contact_id;
  }
  if (data.payment_source_id) {
    params.payment_source_id = data.payment_source_id;
    params.payment_source_name = data.payment_source_name;
    params.payment_method = data.payment_source_name;
  }
  return params;
};

export type DefaultContactTransactionType = Omit<
  ReturnType<typeof defaultContactTransaction>,
  'start_time' | 'end_time' | 'reminder_day' | 'day' | 'images'
> & {
  start_time: string | Date | null;
  end_time: string | Date | null;
  reminder_day: string | Date | null;
  day: string | Date | null;
  images: Array<string | PendingUploadImage>;
};
