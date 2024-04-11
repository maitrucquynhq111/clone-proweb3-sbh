import i18n from '~app/i18n/i18n';
import { CashBookType, DebtbookObjectType } from '~app/utils/constants';

export const getCashbookDescription = (object_type: string, object_key: string) => {
  const { t } = i18n;
  let description = t('cashbook-form:payment');
  if (object_type === DebtbookObjectType.ORDER) {
    description = `${t('cashbook-form:order_repayment')} ${object_key}`;
  }
  if (object_type === DebtbookObjectType.PO) {
    description = `${t('cashbook-form:po_repayment')} ${object_key}`;
  }
  return description;
};

export const getCashbookCategoryName = (object_type: string) => {
  const { t } = i18n;
  if (object_type === DebtbookObjectType.ORDER || object_type === DebtbookObjectType.PO) {
    return t(`cashbook-form:category_${object_type}`);
  }
  return t('cashbook-form:debt_repayment');
};

export const getCashbookTransactionType = (object_type: string, transaction_type: string) => {
  if (object_type === DebtbookObjectType.ORDER && transaction_type === CashBookType.OUT) {
    return CashBookType.IN;
  }
  if (object_type === DebtbookObjectType.PO && transaction_type === CashBookType.IN) {
    return CashBookType.OUT;
  }
  return transaction_type;
};
