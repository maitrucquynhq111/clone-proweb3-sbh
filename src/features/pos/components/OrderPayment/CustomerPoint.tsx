import { useState, memo, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Toggle } from 'rsuite';
import { AutoResizeInput } from '~app/components';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { formatCurrency } from '~app/utils/helpers';
import { CustomerPermission, useHasPermissions } from '~app/utils/shield';

const CustomerPoint = ({ orderTotal }: { orderTotal: number }) => {
  const { t } = useTranslation('pos');
  const [buyerInfo] = useSelectedOrderStore((store) => store.buyer_info);
  const [isCustomerPoint, setIsCustomerPoint] = useSelectedOrderStore((store) => store.is_customer_point);
  const [customerPoint] = useSelectedOrderStore((store) => store.customer_point);
  const [createOrderAt] = useSelectedOrderStore((store) => store.created_order_at);
  const [customerPointDiscount, setCustomerPointDiscount] = useSelectedOrderStore(
    (store) => store.customer_point_discount,
  );
  const [error, setError] = useState('');
  const canUse = useHasPermissions([CustomerPermission.CUSTOMER_LOYALTY_CONFIG_UPDATE]);

  const maxDiscount = useMemo(
    () => (orderTotal <= customerPoint ? orderTotal : customerPoint),
    [orderTotal, buyerInfo],
  );

  useEffect(() => {
    if (error) setError('');
  }, [orderTotal, buyerInfo]);

  const handlePointChange = (value: string) => {
    if (+value >= maxDiscount) {
      setError(`${t('error.max_customer_point')} ${formatCurrency(maxDiscount)} ${t('common:point')}` || '');
      return setCustomerPointDiscount((store) => ({ ...store, customer_point_discount: maxDiscount }));
    }
    setError('');
    setCustomerPointDiscount((store) => ({ ...store, customer_point_discount: +value }));
  };

  return (
    <>
      <div className="pw-flex pw-items-center pw-justify-between pw-mt-3">
        <div className="pw-flex pw-items-center pw-gap-x-3">
          <span className="pw-font-normal pw-text-sm pw-text-neutral-primary">{t('customer_point')}</span>
          <Toggle
            checked={isCustomerPoint}
            disabled={!!createOrderAt || !canUse}
            onChange={(value) => {
              if (!value) setError('');
              setIsCustomerPoint((prevState) => ({ ...prevState, is_customer_point: value }));
            }}
          />
        </div>
        <AutoResizeInput
          name=""
          className="!pw-bg-transparent"
          placeholder="0"
          onChange={handlePointChange}
          defaultValue={customerPointDiscount.toString()}
          max={maxDiscount}
          isNumber
          error={error}
          disabled={!isCustomerPoint || !!createOrderAt}
        />
      </div>
      {error ? <p className="pw-text-red-500 pw-mt-1 pw-text-right">{error}</p> : null}
      {isCustomerPoint ? (
        <div className="pw-flex pw-items-center pw-justify-between pw-mt-3 pw-ml-8 pw-p-2 pw-bg-secondary-background">
          <span className="pw-font-normal pw-text-sm pw-text-neutral-primary">{t('customer_point_discount')}</span>
          <span className="pw-font-semibold pw-text-base pw-text-neutral-primary">
            {formatCurrency(customerPointDiscount)}
          </span>
        </div>
      ) : null}
    </>
  );
};

export default memo(CustomerPoint);
