import cx from 'classnames';
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { Radio, RadioGroup } from 'rsuite';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';
import { CASH_PAYMENT_SOURCE } from '~app/utils/constants';
import { paymentSourceStore } from '~app/features/pos/stores';

type Props = {
  className?: string;
};

const PaymentSources = ({ className }: Props) => {
  const [paymentSourceId, setStore] = useSelectedOrderStore((store) => store.payment_source_id);
  const [paymentSourceName] = useSelectedOrderStore((store) => store.payment_source_name);
  const data = useSyncExternalStore(paymentSourceStore.subscribe, paymentSourceStore.getSnapshot);

  const memoizedData = useMemo(() => {
    if (data) return data;
    return [] as Array<Payment>;
  }, [data]);

  const handleChange = (value: string) => {
    const selectedPaymentSource = memoizedData.find((item) => item.id === value);
    if (!selectedPaymentSource) return;
    setStore((store) => ({
      ...store,
      payment_method: selectedPaymentSource.name,
      payment_source_id: selectedPaymentSource.id,
      payment_source_name: selectedPaymentSource.name,
    }));
  };

  useEffect(() => {
    if (paymentSourceId) return;
    const cashPaymentSource = memoizedData.find((item) => item.name === CASH_PAYMENT_SOURCE);
    if (!cashPaymentSource) return;
    setStore((store) => ({
      ...store,
      payment_source_id: cashPaymentSource.id,
      payment_source_name: cashPaymentSource.name,
    }));
  }, [memoizedData, paymentSourceName, paymentSourceId]);

  return (
    <RadioGroup
      inline
      className={cx('pw-py-1 !pw-grid pw-items-center pw-grid-cols-3 pw-mt-2', className)}
      value={paymentSourceId}
      onChange={(value) => handleChange(value as string)}
    >
      {memoizedData.map((item) => (
        <Radio value={item.id} key={item.id} className="pw-whitespace-nowrap !pw-ml-0 line-clamp-1 pw-text-sm">
          {item.name}
        </Radio>
      ))}
    </RadioGroup>
  );
};

export default PaymentSources;
