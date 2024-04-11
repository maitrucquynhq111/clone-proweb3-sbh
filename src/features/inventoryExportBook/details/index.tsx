import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { BsDownload, BsTrash, BsPrinterFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { exportGoodsDetailsSchema } from './config';
import { DrawerHeader, DrawerBody, DrawerFooter, ConfirmModal } from '~app/components';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import {
  INVENTORY_BOOK_ANALYTICS_KEY,
  INVENTORY_IMPORT_EXPORT_BOOK_KEY,
  INVENTORY_KEY,
  SKUS_INVENTORY_KEY,
  useInventoryDetailsQuery,
} from '~app/services/queries';
import {
  useCancelDetailOutboundMutation,
  useExportDetailOutboundMutation,
  useUpdateExportGoodsMutation,
} from '~app/services/mutations';
import { createDownloadElement, isLocalImage } from '~app/utils/helpers';
import { InventoryPermission, useHasPermissions } from '~app/utils/shield';
import { queryClient } from '~app/configs/client';
import { StatusInventory, defaultExportGoods, isDeepEqualExportGoods } from '~app/features/warehouse/utils';
import { ProductService } from '~app/services/api';
import { exportGoodsFormSchema } from '~app/features/warehouse/create/ExportGoods/config';
import { ProductSelectionRef } from '~app/features/orders/components';
import { useGoodsPrinting } from '~app/utils/hooks';
import { InventoryCategory } from '~app/utils/constants';

type Props = {
  onClose: () => void;
};

const ExportGoodsDetails = ({ onClose }: Props): JSX.Element => {
  const { t } = useTranslation(['purchase-order']);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') as string;
  const po_code = searchParams.get('po_code') as string;
  const productSelectionRef = useRef<ProductSelectionRef>(null);
  const { data: inventoryDetail } = useInventoryDetailsQuery({ po_code, id });
  const { mutateAsync: updateDetailOutbound } = useUpdateExportGoodsMutation();
  const { mutateAsync: exportDetailOutbound } = useExportDetailOutboundMutation();
  const { mutateAsync: cancelDetailOutbound } = useCancelDetailOutboundMutation();
  const { showDataPrint, handlePrint } = useGoodsPrinting({
    inventoryDetail: inventoryDetail,
  });
  const canDelete = useHasPermissions([InventoryPermission.INVENTORY_OUTBOUND_CANCEL]);
  const canPrint = useHasPermissions([InventoryPermission.INVENTORY_PURCHASEORDER_PRINT]);
  const [confirmModal, setConfirmModal] = useState('');

  const hideCancelButton = useMemo(
    () =>
      !canDelete ||
      inventoryDetail?.category.name === InventoryCategory.INBOUND_CANCELLED ||
      inventoryDetail?.status === StatusInventory.CANCELLED,
    [inventoryDetail],
  );

  const methods = useForm<ReturnType<typeof defaultExportGoods>>({
    defaultValues: defaultExportGoods({}),
  });
  const {
    handleSubmit,
    watch,
    reset,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    if (
      isDeepEqualExportGoods({ currentData: getValues(), defaultData: defaultExportGoods({ detail: inventoryDetail }) })
    ) {
      return setConfirmModal('exit_not_save');
    }
    onClose();
  };

  const handleDownload = async () => {
    try {
      const response = await exportDetailOutbound(po_code);
      createDownloadElement(response);
      toast.success(t('success.download'));
    } catch (error) {
      //
    }
  };

  const handleConfirmCancel = async () => {
    try {
      if (inventoryDetail) {
        await cancelDetailOutbound({ id: inventoryDetail.id });
        queryClient.invalidateQueries([INVENTORY_KEY], { exact: false });
        queryClient.invalidateQueries([INVENTORY_BOOK_ANALYTICS_KEY], { exact: false });
        queryClient.invalidateQueries([INVENTORY_IMPORT_EXPORT_BOOK_KEY], { exact: false });
        toast.success(t('success.delete_export_goods'));
        onClose();
        setConfirmModal('');
      }
    } catch (_) {
      // TO DO
    }
  };

  const refetch = () => {
    queryClient.invalidateQueries([SKUS_INVENTORY_KEY], { exact: false });
    queryClient.invalidateQueries([INVENTORY_IMPORT_EXPORT_BOOK_KEY], { exact: false });
    queryClient.invalidateQueries([INVENTORY_KEY], { exact: false });
  };

  const onSubmit = async (data: PendingCreateExportGoods) => {
    try {
      if (isSubmitting) return;
      if (data.status === StatusInventory.CANCELLED) {
        await updateDetailOutbound({
          id,
          body: { ...defaultExportGoods({}), status: StatusInventory.CANCELLED },
        });
        refetch();
        toast.success(t('success.delete_export_goods'));
        onClose();
        return;
      }
      if (data.po_details.length === 0 && data.po_detail_ingredient.length === 0) {
        return toast.error(t('at_least_one_product_export_goods'));
      }
      const newData = { ...data };
      const uploadedImages = await Promise.all(
        newData.media.map(async (image) => {
          try {
            if (isLocalImage(image)) {
              return await ProductService.uploadProductImage(image as PendingUploadImage);
            }
            return image;
          } catch (error: ExpectedAny) {
            toast.error(error.message);
            return image;
          }
        }),
      );
      const poDetailList = newData.po_details.map((skuSelected: SkuSelected) => {
        return {
          sku_id: skuSelected.id,
          pricing: +skuSelected.historical_cost.toFixed(0),
          quantity: +skuSelected.quantity.toFixed(0),
        };
      });
      const poDetailIngredientList: ExpectedAny = newData.po_detail_ingredient.map(
        (ingredient: PendingPoDetailsIngredient) => ({
          sku_id: ingredient.id,
          pricing: +ingredient.price.toFixed(0),
          quantity: +ingredient.quantity.toFixed(0),
          uom_id: ingredient.uom_id,
        }),
      );
      newData.media = uploadedImages;
      await updateDetailOutbound({
        id,
        body: {
          ...newData,
          po_details: poDetailList,
          po_detail_ingredient: poDetailIngredientList,
        },
      });
      refetch();
      toast.success(
        data.status === StatusInventory.COMPLETED ? t('success.create-export-goods') : t('success.save-export-goods'),
      );
      onClose();
    } catch (_) {
      //
    }
  };

  useEffect(() => {
    if (inventoryDetail) {
      reset(defaultExportGoods({ detail: inventoryDetail }) as ExpectedAny);
    }
  }, [inventoryDetail]);

  return (
    <>
      <DrawerHeader
        title={`${t('modal-title:export-goods-details')} - ${inventoryDetail?.po_code} ${
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
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-gray-100">
          {inventoryDetail?.status === StatusInventory.PROCESSING ? (
            <FormLayout
              formSchema={exportGoodsFormSchema({
                t,
                isEdit: true,
                status: inventoryDetail?.status,
                staff_info: inventoryDetail?.staff_info,
                images: watch('media'),
                poDetails: (watch('po_details') as ExpectedAny) || [],
                poDetailIngredient: (watch('po_detail_ingredient') as ExpectedAny) || [],
                isImportGoods: false,
                productSelectionRef,
                setValue,
              })}
            />
          ) : (
            <FormLayout
              formSchema={exportGoodsDetailsSchema({
                t,
                inventoryDetail: inventoryDetail || null,
              })}
            />
          )}
        </DrawerBody>
        {!hideCancelButton && (
          <DrawerFooter>
            {(inventoryDetail?.status === StatusInventory.COMPLETED ||
              inventoryDetail?.status === StatusInventory.EMPTY) && (
              <Button
                appearance="ghost"
                className="!pw-border-neutral-border !pw-text-neutral-primary !pw-py-2 !pw-px-6"
                onClick={() => setConfirmModal('cancel')}
              >
                <span className="pw-text-base pw-font-bold">{t('common:cancel')}</span>
              </Button>
            )}
            {inventoryDetail?.status === StatusInventory.PROCESSING && (
              <div className="pw-w-full pw-flex pw-justify-between">
                <Button
                  appearance="subtle"
                  startIcon={<BsTrash size={20} />}
                  className="!pw-border-none !pw-text-error-active !pw-py-2 !pw-px-6"
                  onClick={() => setConfirmModal('delete')}
                >
                  <span className="pw-text-base pw-font-bold">{t('common:delete')}</span>
                </Button>
                <div className="pw-flex">
                  <Button
                    className="pw-button-secondary !pw-py-2 !pw-px-6 pw-mr-4"
                    onClick={() => {
                      handleSubmit((data) => onSubmit({ ...data, status: StatusInventory.PROCESSING }))();
                    }}
                  >
                    <span className="pw-text-base pw-font-bold pw-text-neutral-primary">{t('action.save')}</span>
                  </Button>
                  <Button
                    className="pw-button-primary !pw-py-2 !pw-px-6"
                    onClick={() => {
                      handleSubmit((data) => onSubmit({ ...data, status: StatusInventory.COMPLETED }))();
                    }}
                  >
                    <span className="pw-text-base pw-font-bold pw-text-neutral-white">{t('common:complete')}</span>
                  </Button>
                </div>
              </div>
            )}
          </DrawerFooter>
        )}
      </FormProvider>
      {confirmModal === 'delete' && (
        <ConfirmModal
          open={true}
          title={t('modal.delete_export_goods')}
          description={t('modal.delete_export_goods_description')}
          iconTitle={<BsTrash size={24} />}
          cancelText={t('common:modal-confirm-refuse-btn') || ''}
          confirmText={t('common:modal-confirm-accept-btn') || ''}
          isDelete
          onConfirm={() => handleSubmit((data) => onSubmit({ ...data, status: StatusInventory.CANCELLED }))()}
          onClose={() => setConfirmModal('')}
        />
      )}
      {confirmModal === 'cancel' && (
        <ConfirmModal
          open={true}
          title={t('modal.cancel_export_goods')}
          description={t('modal.cancel_export_goods_description')}
          iconTitle={<BsTrash size={24} />}
          cancelText={t('common:modal-confirm-refuse-btn') || ''}
          confirmText={t('common:modal-confirm-accept-btn') || ''}
          onConfirm={handleConfirmCancel}
          onClose={() => setConfirmModal('')}
        />
      )}
      {confirmModal === 'exit_not_save' && (
        <ConfirmModal
          open={true}
          title={t('modal.exit_not_save')}
          description={t('modal.exit_not_save_description')}
          cancelText={t('common:modal-confirm-refuse-btn') || ''}
          confirmText={t('common:modal-confirm-accept-btn') || ''}
          onConfirm={onClose}
          onClose={() => setConfirmModal('')}
        />
      )}
    </>
  );
};

export default ExportGoodsDetails;
