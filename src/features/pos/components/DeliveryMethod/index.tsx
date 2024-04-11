import cx from 'classnames';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import { BsPencilFill } from 'react-icons/bs';
import DeliveryMethodSelect from './DeliveryMethodSelect';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import { DeliveryMethodType, saveLocalPendingOrders } from '~app/features/pos/utils';
import { MainRouteKeys } from '~app/routes/enums';
import { TablePermission, useHasPermissions } from '~app/utils/shield';

type Props = {
  className?: string;
};

const DeliveryMethod = ({ className }: Props) => {
  const { t } = useTranslation('pos');
  const navigate = useNavigate();
  const [pendingOrders, setPosStore] = usePosStore((store) => store.pending_orders);
  const [selectedOrder] = useSelectedOrderStore((store) => store);
  const [deliveryMethod] = useSelectedOrderStore((store) => store.delivery_method);
  const [reservationInfo] = useSelectedOrderStore((store) => store.reservation_info);

  const handleClickTable = () => {
    setPosStore((store) => {
      const newPendingOrders = pendingOrders.map((order) => {
        if (order.id === selectedOrder.id) return selectedOrder;
        return order;
      });
      saveLocalPendingOrders(newPendingOrders, selectedOrder?.id || '');
      return { ...store, pending_orders: newPendingOrders };
    });
    navigate(MainRouteKeys.Table, { state: { isChangeTable: true, order_id: selectedOrder.id } });
  };
  const canViewTableList = useHasPermissions([TablePermission.TABLE_TABLELIST_VIEW]);
  return (
    <div className={cx('pw-grid pw-grid-cols-12 pw-px-4 pw-py-3', className)}>
      <div className="pw-col-span-8 pw-flex">
        {deliveryMethod === DeliveryMethodType.TABLE ? (
          <>
            {reservationInfo ? (
              <div
                className="pw-flex pw-items-center pw-cursor-pointer pw-text-neutral-secondary pw-font-bold"
                onClick={handleClickTable}
              >
                <div className="pw-mr-3">
                  {reservationInfo.table_name} - {reservationInfo.sector_name}
                </div>
                <div className="pw-text-blue-primary">
                  <BsPencilFill size={20} />
                </div>
              </div>
            ) : canViewTableList ? (
              <Button appearance="subtle" className="!pw-text-blue-primary !pw-font-bold" onClick={handleClickTable}>
                {t('action.select_table')}
              </Button>
            ) : (
              <></>
            )}
          </>
        ) : (
          <div className="pw-flex pw-items-center pw-text-sm pw-text-neutral-secondary pw-font-bold">
            {t('select_delivery_method')}
          </div>
        )}
      </div>
      <div className="pw-col-span-4 pw-flex pw-justify-end">
        <DeliveryMethodSelect />
      </div>
    </div>
  );
};

export default memo(DeliveryMethod);
