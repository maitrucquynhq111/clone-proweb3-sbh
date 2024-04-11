import i18n from '~app/i18n/i18n';

import { DebtbookObjectType, DebtType } from '~app/utils/constants';

export const showPayment = (data: ContactTransaction) => {
  if (data?.is_debit === false) return false;

  if (
    data?.transaction_type === DebtType.IN &&
    data?.reminder_debt_amount < 0 &&
    data.object_type === DebtbookObjectType.ORDER
  )
    return false;

  return true;
};

export const getContactTransactionDescription = (object_type: string, object_key: string) => {
  const { t } = i18n;
  let description = t('debtbook-form:payment');
  if (object_type === DebtbookObjectType.ORDER) {
    description = `${t('debtbook-form:order_payment')} ${object_key}`;
  }
  if (object_type === DebtbookObjectType.PO) {
    description = `${t('debtbook-form:po_payment')} ${object_key}`;
  }
  return description;
};

export const getContactTransactionType = (object_type: string, transaction_type: string) => {
  if (object_type === DebtbookObjectType.ORDER && transaction_type === DebtType.OUT) {
    return DebtType.OUT;
  }
  if (object_type === DebtbookObjectType.PO && transaction_type === DebtType.IN) {
    return DebtType.IN;
  }
  return transaction_type === DebtType.IN ? DebtType.OUT : DebtType.IN;
};
