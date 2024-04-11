import cx from 'classnames';
import { Tooltip, Whisper } from 'rsuite';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BsX, BsTrash } from 'react-icons/bs';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import { saveLocalPendingOrders, DeliveryMethodType } from '~app/features/pos/utils';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { ConfirmModal } from '~app/components';
import { MainRouteKeys } from '~app/routes/enums';

type Props = {
  index: number;
  pendingOrder: PendingOrderForm;
  onClick(id: string): void;
};

const OrderTabItem = ({ index, pendingOrder, onClick }: Props) => {
  const { t } = useTranslation('pos');
  const navigate = useNavigate();
  const [pendingOrders, setPosStore] = usePosStore((store) => store.pending_orders);
  const [selectedOrder, setSelectedOrderStore] = useSelectedOrderStore((store) => store);
  const [openConfirm, setOpenConfirm] = useState(false);
  const {
    setting: { pos },
  } = useOfflineContext();

  const handleSelect = () => {
    if (selectedOrder.id === pendingOrder.id) return;
    setPosStore((store) => {
      let newPendingOrders = [...store.pending_orders];
      newPendingOrders = newPendingOrders.map((order) => {
        if (order.id === selectedOrder.id) {
          return selectedOrder;
        }
        return order;
      });
      saveLocalPendingOrders(newPendingOrders, pendingOrder?.id || '');
      return { ...store, pending_orders: newPendingOrders };
    });
    setSelectedOrderStore((store) => {
      if (!pendingOrder) return store;
      return pendingOrder;
    });
  };

  const getNameTabItem = (index: number) => {
    if (!pos.fnb_active) return `${t('order')} ${index + 1}`;
    if (pendingOrder.delivery_method === DeliveryMethodType.TABLE)
      return `${pendingOrder.reservation_info?.sector_name} - ${pendingOrder.reservation_info?.table_name}`;

    return `${t(pendingOrder.delivery_method)} ${index + 1}`;
  };

  const onChangeTable = (e: ExpectedAny) => {
    e.stopPropagation();
    if (pendingOrder.delivery_method === DeliveryMethodType.TABLE && selectedOrder.id === pendingOrder.id) {
      navigate(MainRouteKeys.Table, { state: { isChangeTable: true, order_id: selectedOrder.id } });
    }
  };

  return (
    <>
      <Whisper
        placement="autoVertical"
        trigger="hover"
        speaker={<Tooltip arrow={false}>{getNameTabItem(index)}</Tooltip>}
      >
        <button
          className={cx(
            `pw-flex pw-items-center pw-justify-center pw-w-max pw-px-3 pw-pt-2 pw-pb-4 pw-gap-x-2 pw-rounded-t`,
            {
              'pw-bg-neutral-white': selectedOrder.id === pendingOrder.id,
              'pw-bg-primary-main': selectedOrder.id !== pendingOrder.id,
            },
          )}
          onClick={() => {
            handleSelect();
          }}
        >
          <span
            className={cx('pw-truncate pw-max-w-25', {
              'pw-text-base pw-text-neutral-primary pw-font-bold':
                selectedOrder.id === pendingOrder.id && selectedOrder.delivery_method !== DeliveryMethodType.TABLE,
              'pw-text-base pw-text-neutral-white pw-font-normal': selectedOrder.id !== pendingOrder.id,
              'pw-text-base pw-text-main pw-underline pw-font-bold':
                selectedOrder.id === pendingOrder.id && selectedOrder.delivery_method === DeliveryMethodType.TABLE,
            })}
            onClick={(e) => {
              if (pendingOrder.delivery_method === DeliveryMethodType.TABLE && selectedOrder.id === pendingOrder.id)
                onChangeTable(e);
            }}
          >
            {getNameTabItem(index)}
          </span>
          {pendingOrders.length > 1 ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setOpenConfirm(true);
              }}
            >
              <BsX
                size={20}
                className={cx({
                  'pw-text-neutral-primary': selectedOrder.id === pendingOrder.id,
                  'pw-text-neutral-white': selectedOrder.id !== pendingOrder.id,
                })}
              />
            </span>
          ) : null}
        </button>
      </Whisper>
      {openConfirm && (
        <ConfirmModal
          open={openConfirm}
          title={t('action.delete_order')}
          iconTitle={<BsTrash size={24} />}
          description={t('description_delete_order')}
          isDelete
          onConfirm={() => {
            onClick(pendingOrder.id || '');
            setOpenConfirm(false);
          }}
          onClose={() => setOpenConfirm(false)}
        />
      )}
    </>
  );
};

export default memo(OrderTabItem);
