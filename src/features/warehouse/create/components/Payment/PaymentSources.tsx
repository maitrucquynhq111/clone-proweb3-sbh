import cx from 'classnames';
import { UseFormSetValue, useFormContext } from 'react-hook-form';
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { Radio, RadioGroup } from 'rsuite';
import { CASH_PAYMENT_SOURCE } from '~app/utils/constants';
import { paymentSourceStore } from '~app/features/pos/stores';

const PaymentSources = ({ setValue }: { setValue: UseFormSetValue<PendingInventoryCreate> }) => {
  const { watch } = useFormContext<PendingInventoryCreate>();
  const data = useSyncExternalStore(paymentSourceStore.subscribe, paymentSourceStore.getSnapshot);

  const memoizedData = useMemo(() => {
    if (data) return data;
    return [] as Array<Payment>;
  }, [data]);

  const handleChange = (value: string) => {
    const selectedPaymentSource = memoizedData.find((item) => item.id === value);
    if (!selectedPaymentSource) return;
    setValue('payment_source_id', selectedPaymentSource.id);
    setValue('payment_source_name', selectedPaymentSource.name);
  };

  useEffect(() => {
    const cashPaymentSource = memoizedData.find((item) => item.name === CASH_PAYMENT_SOURCE);
    if (!cashPaymentSource) return;
    setValue('payment_source_id', cashPaymentSource.id);
    setValue('payment_source_name', cashPaymentSource.name);
  }, [memoizedData]);

  return (
    <RadioGroup
      inline
      className={cx('pw-py-1 !pw-grid pw-items-center pw-grid-cols-3')}
      value={watch('payment_source_id')}
      onChange={(value) => handleChange(value as string)}
    >
      {memoizedData.map((item) => (
        <Radio value={item.id} key={item.id} className="pw-whitespace-nowrap !pw-ml-0 line-clamp-1">
          {item.name}
        </Radio>
      ))}
    </RadioGroup>
  );
};

export default PaymentSources;
