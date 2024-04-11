import { toast } from 'react-toastify';
import { BsTrash } from 'react-icons/bs';
import { Button } from 'rsuite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNetworkState } from 'react-use';
import { ConfirmModal, ProductOutOfStock, IngredientOutOfStock } from '~app/components';
import { useCreateOrderMutation } from '~app/services/mutations';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { RequestType } from '~app/features/pos/constants';
import { OrderResponseType } from '~app/utils/constants';

type Props = {
  data: ExpectedAny;
};

const Action = ({ data }: Props) => {
  const { t } = useTranslation(['orders-table', 'common', 'notification', 'pos']);
  const { online } = useNetworkState();

  const [responseOrder, setResponseOrder] = useState<ExpectedAny>(null);
  const { offlineModeWorker } = useOfflineContext();
  const [openConfirm, setOpenConfirm] = useState(false);
  const { isLoading, mutateAsync } = useCreateOrderMutation();

  const handleSync = async (data: PendingOrderForm) => {
    try {
      const { id, ...orderForsubmit } = data;

      const response = await mutateAsync({ ...orderForsubmit });
      if (response?.status) {
        setResponseOrder(response);
        return;
      }
      offlineModeWorker.postMessage({
        action: RequestType.DELETE_ORDER,
        value: data,
      });
      toast.success(t('notification:sync-order-success'));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteOrder = () => {
    try {
      offlineModeWorker.postMessage({
        action: RequestType.DELETE_ORDER,
        value: data,
      });
      toast.success(t('notification:delete-order-success'));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pw-w-full pw-flex pw-gap-2 pw-px-1">
      {online && (
        <Button
          size="sm"
          loading={isLoading}
          disabled={isLoading}
          appearance="primary"
          block
          className="!pw-bg-blue-primary"
          onClick={() => handleSync(data as PendingOrderForm)}
        >
          <span className="pw-font-bold">{t('common:sync')}</span>
        </Button>
      )}
      <Button
        size="sm"
        onClick={() => setOpenConfirm(true)}
        block
        disabled={isLoading}
        className="!pw-mt-0 !pw-border-neutral-border !pw-text-neutral-primary"
        appearance="ghost"
      >
        <span className="pw-font-bold">{t('common:delete')}</span>
      </Button>
      {openConfirm && (
        <ConfirmModal
          open={openConfirm}
          title={t('pos:action.delete_order')}
          iconTitle={<BsTrash size={24} />}
          description={t('pos:description_delete_order')}
          isDelete
          onConfirm={() => {
            handleDeleteOrder();
            setOpenConfirm(false);
          }}
          onClose={() => setOpenConfirm(false)}
        />
      )}
      {responseOrder && responseOrder.status === OrderResponseType.SOLD_OUT && (
        <ProductOutOfStock
          data={responseOrder.items_info}
          hideDelete
          open={true}
          onClose={() => setResponseOrder(null)}
        />
      )}
      {responseOrder && responseOrder.status === OrderResponseType.SOLD_OUT_GREDIENT && (
        <IngredientOutOfStock
          data={responseOrder.list_ingredient}
          hideDelete
          open={true}
          onClose={() => setResponseOrder(null)}
        />
      )}
    </div>
  );
};

export default Action;
