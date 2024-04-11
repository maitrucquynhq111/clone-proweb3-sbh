import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { useMemo } from 'react';
import PaymentSources from '~app/features/pos/components/OrderPayment/PaymentSources';
import PaidAmountInput from '~app/features/pos/components/OrderPayment/PaidAmountInput';
import DebitToggle from '~app/features/pos/components/OrderPayment/DebitToggle';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { getListSuggestAmountPaid } from '~app/features/pos/utils';
import { formatCurrency } from '~app/utils/helpers';

type Props = {
  className?: string;
  orderTotal: number;
  grandTotal: number;
};

const PaymentInfo = ({ orderTotal, grandTotal, className }: Props): JSX.Element => {
  const { t } = useTranslation('pos');
  const [, setStore] = useSelectedOrderStore((store) => store);
  const [debit] = useSelectedOrderStore((store) => store.debit);
  const [listOrderItem] = useSelectedOrderStore((store) => store.list_order_item);

  const debitOrExcessCash = useMemo(() => debit.buyer_pay - grandTotal, [debit, grandTotal]);
  const listSuggestAmountPaid = useMemo(() => getListSuggestAmountPaid(grandTotal), [grandTotal]);

  const handleChangeAmountPaid = (value: number) => {
    setStore((store) => ({ ...store, debit: { ...store.debit, buyer_pay: value } }));
  };

  if (listOrderItem.length === 0)
    return (
      <div className={cx(className)}>
        <div className="pw-flex pw-justify-between pw-items-center">
          <span className="pw-font-semibold pw-text-sm pw-text-neutral-primary">{t('total')}</span>
          <div className="pw-flex pw-items-center pw-gap-x-2">
            {orderTotal > grandTotal ? (
              <span className="pw-text-sm pw-text-neutral-placeholder pw-line-through">
                {formatCurrency(orderTotal)}
              </span>
            ) : null}
            <span className="pw-text-secondary-main pw-text-lg pw-font-bold">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>
    );

  return (
    <div className={cx(className)}>
      <div className="pw-flex pw-justify-between pw-items-center">
        <span className="pw-font-semibold pw-text-sm pw-text-neutral-primary">{t('total')}</span>
        <div className="pw-flex pw-items-center pw-gap-x-2">
          {orderTotal > grandTotal ? (
            <span className="pw-text-sm pw-text-neutral-placeholder pw-line-through">{formatCurrency(orderTotal)}</span>
          ) : null}
          <span className="pw-text-secondary-main pw-text-lg pw-font-bold">{formatCurrency(grandTotal)}</span>
        </div>
      </div>
      <PaidAmountInput className="pw-mt-2" grandTotal={grandTotal} />
      {debitOrExcessCash < 0 && debit.buyer_pay >= 0 && <DebitToggle className="pw-mt-2" amount={debitOrExcessCash} />}
      {debitOrExcessCash > 0 ? (
        <div className="pw-flex pw-py-1 pw-justify-between pw-items-center pw-mt-2">
          <div className="pw-flex pw-items-center pw-gap-x-3">
            <span className="pw-text-sm pw-text-neutral-primary">{t('orders-form:change_money')}</span>
          </div>
          <div className="pw-text-base pw-font-semibold pw-text-neutral-primary">
            {formatCurrency(Math.abs(debitOrExcessCash))}
          </div>
        </div>
      ) : null}
      <PaymentSources />
      <div className="pw-py-1 !pw-grid pw-items-center pw-grid-cols-4 pw-mt-2 pw-gap-2">
        {listSuggestAmountPaid.map((index: number) => (
          <span
            key={index}
            onClick={() => handleChangeAmountPaid(index)}
            className="pw-whitespace-nowrap !pw-ml-0 pw-px-2 pw-py-1 pw-rounded pw-bg-neutral-divider pw-font-semibold pw-text-sm pw-text-center pw-cursor-pointer"
          >
            {formatCurrency(index)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PaymentInfo;
