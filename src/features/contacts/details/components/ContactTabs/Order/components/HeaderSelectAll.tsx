import { memo, useRef, useCallback } from 'react';
import { IconButton } from 'rsuite';
import { toast } from 'react-toastify';
import TrashIcon from '@rsuite/icons/Trash';
import { useTranslation } from 'react-i18next';
import { useCancelMultipleOrderMutation } from '~app/services/mutations';
import { ModalConfirm, ModalRefObject } from '~app/components/ActionMenu';
import { queryClient } from '~app/configs/client';
import { ORDERS_KEY, ORDERS_ANALYTICS_KEY } from '~app/services/queries';
import { OrderStatusType } from '~app/utils/constants';

type Props = {
  selected: Order[];
};

const HeaderSelectAll = ({ selected }: Props) => {
  const { t } = useTranslation(['common', 'orders-table', 'notification']);
  const { mutateAsync } = useCancelMultipleOrderMutation();
  const confirmModalRef = useRef<ModalRefObject>(null);

  const handleDelete = async () => {
    const orders = selected.filter((order: Order) => order.state !== OrderStatusType.CANCEL);

    const list_order = orders.reduce((previousObject, currentObject) => {
      return Object.assign(previousObject, {
        [currentObject.id]: currentObject.state,
      });
    }, {});

    const list_order_id = orders.map((order: Order) => order.id);

    await mutateAsync({
      list_order_id,
      list_order,
    } as ExpectedAny);
    toast.success(t('notification:cancel-order-success'));

    queryClient.invalidateQueries([ORDERS_KEY], { exact: false });
    queryClient.invalidateQueries([ORDERS_ANALYTICS_KEY], { exact: false });
  };

  const handleOpenModal = useCallback(() => {
    confirmModalRef.current?.handleOpen({
      action: handleDelete,
      title: t('delete'),
      modalTitle: t('orders-table:multiple-cancel') as string,
      acceptText: t('orders-table:multiple-cancel-confirm') as string,
      modalContent: t('orders-table:multiple-cancel-content') as string,
    });
  }, [handleDelete]);

  return (
    <div className="pw-flex pw-gap-2 pw-h-10 pw-items-center">
      <IconButton size="sm" color="red" onClick={handleOpenModal} appearance="primary" icon={<TrashIcon />} />
      <ModalConfirm ref={confirmModalRef} />
    </div>
  );
};

export default memo(HeaderSelectAll);
