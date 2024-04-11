import { useEffect, useMemo, useState } from 'react';
import { Button } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { BsDownload, BsTrash, BsPrinterFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { importGoodsFormSchema } from './config';
import { DrawerHeader, DrawerBody, DrawerFooter, ConfirmModal } from '~app/components';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import {
  INVENTORY_BOOK_ANALYTICS_KEY,
  INVENTORY_DETAILS_KEY,
  INVENTORY_IMPORT_EXPORT_BOOK_KEY,
  INVENTORY_KEY,
  useInventoryDetailsQuery,
  usePaymentSourcesQuery,
} from '~app/services/queries';
import { useCancelPurchaseOrderMutation, useExportDetailInboundMutation } from '~app/services/mutations';
import { createDownloadElement } from '~app/utils/helpers';
import { InventoryPermission, useHasPermissions } from '~app/utils/shield';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { PaymentStateInventory, StatusInventory } from '~app/features/warehouse/utils';
import { queryClient } from '~app/configs/client';
import { cancelPurchaseOrderDefault } from '~app/features/inventory/CancelPurchaseOrder/config';
import { useGoodsPrinting } from '~app/utils/hooks';
import { InventoryCategory } from '~app/utils/constants';

type Props = {
  onClose: () => void;
};

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  detail: InventoryDetail;
  onSuccess?(): void;
};

const ImportGoodsDetails = ({ onClose }: Props): JSX.Element => {
  const { t } = useTranslation(['purchase-order']);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') as string;
  const po_code = searchParams.get('po_code') as string;
  const { data: inventoryDetail } = useInventoryDetailsQuery({ po_code, id });
  const { mutateAsync: exportDetailInbound } = useExportDetailInboundMutation();
  const { mutateAsync: cancelDetailInbound } = useCancelPurchaseOrderMutation();
  const { data: paymentSource } = usePaymentSourcesQuery({
    page: 1,
    page_size: 10,
    type: 'default',
    sort: 'priority asc',
  });
  const { showDataPrint, handlePrint } = useGoodsPrinting({
    inventoryDetail: inventoryDetail,
  });
  const canDelete = useHasPermissions([InventoryPermission.INVENTORY_PURCHASEORDER_DELETE]);
  const canPrint = useHasPermissions([InventoryPermission.INVENTORY_PURCHASEORDER_PRINT]);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const hideCancelButton = useMemo(
    () =>
      !canDelete ||
      inventoryDetail?.category.name === InventoryCategory.INBOUND_CANCELLED ||
      inventoryDetail?.status === StatusInventory.CANCELLED,
    [inventoryDetail],
  );

  const methods = useForm<InventoryDetail>();
  const { watch, reset } = methods;

  const handleClose = () => {
    onClose();
  };

  const handleDownload = async () => {
    try {
      const response = await exportDetailInbound(po_code);
      createDownloadElement(response);
      toast.success(t('success.download'));
    } catch (error) {
      //
    }
  };

  const handleOpenCancel = () => {
    if (!inventoryDetail) return;
    if (
      inventoryDetail.payment_state === PaymentStateInventory.UNPAID ||
      inventoryDetail.payment_state === PaymentStateInventory.IN_DEBIT
    ) {
      return setConfirmCancel(true);
    }
    setModalData({
      modal: ModalTypes.CancelPurchaseOrder,
      size: ModalSize.Xsmall,
      placement: ModalPlacement.Right,
      detail: inventoryDetail,
      onSuccess: handleClose,
    });
  };

  const handleConfirmCancel = async () => {
    try {
      if (inventoryDetail && paymentSource?.data?.[0]) {
        const body = cancelPurchaseOrderDefault({
          refundAmount: 0,
          paymentSource: paymentSource.data[0],
        });
        await cancelDetailInbound({ id: inventoryDetail.id, body });
        queryClient.invalidateQueries([INVENTORY_DETAILS_KEY], { exact: false });
        queryClient.invalidateQueries([INVENTORY_KEY], { exact: false });
        queryClient.invalidateQueries([INVENTORY_BOOK_ANALYTICS_KEY], { exact: false });
        queryClient.invalidateQueries([INVENTORY_IMPORT_EXPORT_BOOK_KEY], { exact: false });
        toast.success(t('success.cancel-purchase'));
        handleClose();
      }
    } catch (_) {
      // TO DO
    }
  };

  useEffect(() => {
    if (inventoryDetail) {
      reset(inventoryDetail);
    }
  }, [inventoryDetail]);

  return (
    <>
      <DrawerHeader
        title={`${t('modal-title:import-goods-details')} - ${inventoryDetail?.po_code} ${
          inventoryDetail ? format(new Date(inventoryDetail.created_at), 'HH:mm dd/MM/yyyy') : ''
        }`}
        onClose={handleClose}
      >
        <div className="pw-flex pw-flex-1 pw-justify-end pw-gap-x-2 pw-mr-2">
          <button
            className="pw-flex pw-font-bold pw-text-neutral-primary pw-text-sm pw-py-1.5 pw-px-4 pw-rounded
                  pw-bg-neutral-white pw-border pw-border-solid pw-border-neutral-border pw-gap-x-2 pw-items-center"
            onClick={handleDownload}
          >
            <BsDownload />
            {t('action.download')}
          </button>
          {canPrint && (
            <button
              className="pw-flex pw-font-bold pw-text-neutral-primary pw-text-sm pw-py-1.5 pw-px-4 pw-rounded pw-bg-neutral-white pw-border pw-border-solid pw-border-neutral-border pw-gap-x-2 pw-items-center"
              onClick={handlePrint}
            >
              <BsPrinterFill />
              {t('action.print')}
            </button>
          )}
          <div className="pw-hidden">{showDataPrint()}</div>
        </div>
      </DrawerHeader>
      <FormProvider className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden" methods={methods}>
        <DrawerBody className="pw-bg-gray-100">
          <FormLayout
            formSchema={importGoodsFormSchema({
              inventoryDetail: watch() || null,
            })}
          />
        </DrawerBody>
        {!hideCancelButton && (
          <DrawerFooter className="!pw-justify-start">
            <Button
              appearance="subtle"
              startIcon={<BsTrash size={20} />}
              className="!pw-border-none !pw-text-error-active !pw-py-2 !pw-px-6"
              onClick={handleOpenCancel}
            >
              <span className="pw-text-base pw-font-bold">{t('common:delete')}</span>
            </Button>
          </DrawerFooter>
        )}
      </FormProvider>
      {confirmCancel && (
        <ConfirmModal
          open={true}
          title={t('modal.cancel_import_goods')}
          description={t('modal.cancel_import_goods_description')}
          iconTitle={<BsTrash size={24} />}
          isDelete={true}
          onConfirm={handleConfirmCancel}
          onClose={() => setConfirmCancel(false)}
        />
      )}
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </>
  );
};

export default ImportGoodsDetails;
