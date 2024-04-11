import cx from 'classnames';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AutoResizeInput } from '~app/components';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';
// import { DeliveryMethodType } from '~app/features/pos/utils';

type Props = {
  className?: string;
  grandTotal: number;
};

const PaidAmountInput = ({ className, grandTotal }: Props) => {
  const { t } = useTranslation('pos');
  const [, setStore] = useSelectedOrderStore((store) => store.debit.buyer_pay);
  const [createdOrderAt] = useSelectedOrderStore((store) => store.created_order_at);
  const [debit] = useSelectedOrderStore((store) => store.debit);

  useEffect(() => {
    if (!createdOrderAt) {
      setStore((store) => ({ ...store, debit: { ...store.debit, buyer_pay: grandTotal } }));
    }
  }, [grandTotal]);

  const handleChange = (value: string) => {
    setStore((store) => ({ ...store, debit: { ...store.debit, buyer_pay: +value } }));
  };

  return (
    <div className={cx('pw-flex pw-justify-between pw-items-center', className)}>
      <span className="pw-font-semibold pw-text-sm pw-text-neutral-primary">{t('paid_amount')}</span>
      <AutoResizeInput
        name=""
        defaultValue={debit.buyer_pay.toString()}
        isForm={false}
        isNumber
        placeholder="0"
        className="!pw-text-lg !pw-font-bold"
        onChange={handleChange}
      />
    </div>
  );
};

export default PaidAmountInput;
