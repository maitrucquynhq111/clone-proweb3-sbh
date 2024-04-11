import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Toggle } from 'rsuite';
import { useLayoutEffect } from 'react';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { useHasPermissions, OrderPermission } from '~app/utils/shield';

type Props = {
  grandTotal: number;
  className?: string;
};

const DeliveryToggle = ({ grandTotal, className }: Props) => {
  const canCreatePendingOrder = useHasPermissions([OrderPermission.ORDER_CART_CREATE]);
  const canCompleteOrder = useHasPermissions([OrderPermission.ORDER_CART_COMPLETE]);
  const canCreateAndComplete = canCreatePendingOrder && canCompleteOrder;

  const { t } = useTranslation('pos');
  const {
    setting: { pos },
  } = useOfflineContext();
  const [isOpenDelivery, setStore] = useSelectedOrderStore((store) => store.is_open_delivery);

  const handleChange = (checked: boolean) => {
    setStore((store) => ({
      ...store,
      debit: {
        ...store.debit,
        buyer_pay: checked ? 0 : grandTotal,
        is_debit: checked ? false : true,
      },
      is_open_delivery: checked,
    }));
  };

  useLayoutEffect(() => {
    if (canCreatePendingOrder && !canCreateAndComplete) {
      handleChange(true);
    }
  }, [canCreatePendingOrder, canCreateAndComplete]);

  return canCreateAndComplete ? (
    <div className={cx('pw-flex pw-py-1 pw-justify-between pw-items-center', className)}>
      <div className="pw-flex pw-items-center pw-gap-x-3">
        <span className="pw-text-base pw-text-neutral-primary">
          {pos?.fnb_active ? t('action.save_order') : t('delivery_later')}
        </span>
        <div className="blue-toggle">
          <Toggle checked={isOpenDelivery} onChange={handleChange} className="blue-toggle" />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default DeliveryToggle;
