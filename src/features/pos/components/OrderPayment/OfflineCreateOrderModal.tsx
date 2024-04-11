import { Modal, Button } from 'rsuite';
import { forwardRef, Ref, useImperativeHandle, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useOfflineContext } from '../../context/OfflineContext';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import { RequestType } from '~app/features/pos/constants';
import { initialOrder, saveLocalPendingOrders } from '~app/features/pos/utils';
import { NoInternet } from '~app/components/Icons';

type Props = {
  open: boolean;
  onClose: () => void;
};

export type ModalRefObject = {
  setOfflineOrder: (value: PendingOrderForm) => void;
};

const OfflineCreateOrderModal = ({ open, onClose }: Props, ref: Ref<ModalRefObject>) => {
  const [, setPosStore] = usePosStore((store) => store.pending_orders);
  const [selectedOrder, setSelectedOrderStore] = useSelectedOrderStore((store) => store);
  const { offlineModeWorker } = useOfflineContext();
  const { t } = useTranslation(['pos', 'common']);
  const [order, setOrder] = useState<PendingOrderForm | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      setOfflineOrder: (order: PendingOrderForm) => {
        setOrder(order);
      },
    }),
    [],
  );

  const handleCreateOrderOffline = () => {
    if (order) {
      offlineModeWorker.postMessage({
        action: RequestType.CREATE_ORDER,
        value: order,
      });
      const newPendingOrder = initialOrder();
      setPosStore((store) => {
        const newPendingOrders = [newPendingOrder];
        saveLocalPendingOrders(newPendingOrders, selectedOrder?.id || '');
        return { ...store, pending_orders: newPendingOrders };
      });
      setSelectedOrderStore(() => newPendingOrder);
      toast.success(t('success.creat_order'));
      onClose();
    }
  };

  return (
    <Modal backdrop={true} keyboard={false} open={open} size="xs">
      <Modal.Body>
        <div className="pw-flex pw-flex-col pw-items-center pw-justify-center">
          <NoInternet />
          <div className="pw-font-bold pw-text-base pw-mb-2">{t('no-internet-modal.title')}</div>
          <div>{t('no-internet-modal.description')}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCreateOrderOffline} appearance="primary">
          {t('common:confirm')}
        </Button>
        <Button onClick={onClose} appearance="subtle">
          {t('common:close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default forwardRef(OfflineCreateOrderModal);
