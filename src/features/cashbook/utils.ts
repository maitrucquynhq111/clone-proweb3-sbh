import { addDays } from 'date-fns';

export const defaultCashbook = () => ({
  amount: 0,
  business_id: '',
  currency: 'VND',
  day: new Date(Date.now()),
  description: '',
  payment_information: null,
  transaction_type: '',
  status: 'paid',
  images: [],
  category_id: '',
  category_name: '',
  payment_source_id: '',
  payment_source_name: '',
  payment_method: '',
  is_debit: false,
  contact_id: '',
  contact_name: '',
  end_time: null,
  reminder_day: addDays(new Date(), 1),
});

export const defaultCashbookDetail = (): PendingCashbook => {
  return {
    amount: 0,
    business_id: '',
    currency: 'VND',
    day: new Date(Date.now()),
    description: '',
    payment_information: null,
    transaction_type: '',
    status: 'paid',
    images: [],
    category_id: '',
    category_name: '',
    payment_source_id: '',
    payment_source_name: '',
    payment_method: '',
  };
};

export const toPendingContactTransaction = (
  data: ReturnType<typeof defaultCashbook>,
  transaction_type: string,
  action: string,
): PendingContactTransaction => {
  return {
    business_id: '',
    transaction_type,
    payment_method: '',
    payment_information: null,
    amount: data.amount,
    currency: data.currency,
    contact_id: data.contact_id,
    contact_name: data.contact_name,
    images: data.images,
    description: data.description,
    start_time: data.day.toISOString(),
    end_time: null,
    action,
    reminder_day: data.reminder_day.toISOString(),
  };
};

export const toPendingCashbook = (
  data: ReturnType<typeof defaultCashbook>,
  transaction_type: string,
): PendingCashbook => {
  const params = {
    business_id: data.business_id,
    currency: data.currency,
    description: data.description,
    payment_information: data.payment_information,
    status: data.status,
    amount: data.amount,
    images: data.images,
    day: new Date(data.day as Date).toISOString(),
    transaction_type,
  } as PendingCashbook;
  if (data.category_id) {
    params.category_id = data.category_id;
    params.category_name = data.category_name;
  }
  if (data.payment_source_id) {
    params.payment_source_id = data.payment_source_id;
    params.payment_source_name = data.payment_source_name;
    params.payment_method = data.payment_source_name;
  }
  return params;
};

export const toPendingCashbookDetail = (data: Cashbook): PendingCashbook => {
  const params = {
    id: data.id,
    business_id: data.business_id,
    currency: data.currency,
    description: data.description,
    payment_information: data.payment_information,
    status: data.status,
    amount: data.amount,
    images: data?.images || [],
    day: new Date(data.day as string),
    transaction_type: data.transaction_type,
  } as PendingCashbook;
  if (data?.category_name) {
    params.category_id = data.category_id;
    params.category_name = data.category_name;
  }
  if (data?.payment_source_name) {
    params.payment_source_id = data.payment_source_id;
    params.payment_source_name = data.payment_source_name;
    params.payment_method = data.payment_source_name;
  }
  return params;
};
