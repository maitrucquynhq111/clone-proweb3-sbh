import cx from 'classnames';
import { toast } from 'react-toastify';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useForm, FieldErrors } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Divider } from 'rsuite';
import { BsDownload, BsTrash } from 'react-icons/bs';
import { useSearchParams } from 'react-router-dom';
import {
  addIngredient,
  addSku,
  defaultStockTaking,
  stockTakingFormSchema,
  stockTakingYupSchema,
  toPendingStockTaking,
  toStockTakingBody,
} from '../utils';
import {
  createDownloadElement,
  formatDateToString,
  isDeepEqual,
  isLocalImage,
  revokeObjectUrl,
} from '~app/utils/helpers';
import { ConfirmModal, DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import FormProvider from '~app/components/HookForm/FormProvider';
import FormLayout from '~app/components/HookForm/FormLayout';
import { StockTakingAnalyticStatus, StockTakingAnalyticStatusOption } from '~app/utils/constants';
import { ProductService } from '~app/services/api';
import { queryClient } from '~app/configs/client';
import { LIST_STOCK_TAKE_KEY, useInventoryDetailsQuery } from '~app/services/queries';
import { useExportStockTakingDetailMutation, useUpdateStockTaking } from '~app/services/mutations';
import { PrintingButton } from '~app/features/stock-taking/components';
import { InventoryPermission, useHasPermissions } from '~app/utils/shield';

type Props = {
  onClose: () => void;
};

const DetailStockTaking = ({ onClose }: Props) => {
  const { t } = useTranslation('stocktaking-form');
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') as string;
  const po_code = searchParams.get('po_code') as string;
  const { data: inventoryDetail, isFetching } = useInventoryDetailsQuery({ po_code, id });
  const { mutateAsync } = useUpdateStockTaking();
  const { mutateAsync: exportStockTakingDetail } = useExportStockTakingDetailMutation();

  const methods = useForm<PendingStockTaking>({
    resolver: yupResolver(stockTakingYupSchema()),
    defaultValues: defaultStockTaking,
  });

  const [openConfirmStockBalance, setOpenConfirmStockBalance] = useState(false);
  const [openExitModal, setOpenExitModal] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const canPrint = useHasPermissions([InventoryPermission.INVENTORY_PURCHASEORDER_PRINT]);

  const {
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  const transContext = useMemo(() => {
    const { po_details, po_detail_ingredient } = getValues();
    if (po_details.length > 0 && po_detail_ingredient.length > 0) return undefined;
    if (po_details.length > 0) return 'sku';
    if (po_detail_ingredient.length > 0) return 'ingredient';
  }, [getValues, openConfirmStockBalance]);

  const pendingStockTaking = useMemo(() => {
    if (!inventoryDetail) return defaultStockTaking;
    return toPendingStockTaking(inventoryDetail);
  }, [inventoryDetail]);

  const handleAddSku = useCallback(
    (sku: SkuInventory) => {
      const poDetails = getValues('po_details');
      addSku(sku, poDetails, (value) => setValue('po_details', value));
    },
    [getValues, setValue],
  );

  const handleAddIngredient = useCallback(
    (ingredient: Ingredient) => {
      const poDetailIngredient = getValues('po_detail_ingredient');
      addIngredient(ingredient, poDetailIngredient, (value) => setValue('po_detail_ingredient', value));
    },
    [getValues, setValue],
  );

  const handleUploadImages = async (data: Array<string | PendingUploadImage>) => {
    const uploadedImages = await Promise.all(
      data.map(async (image) => {
        if (isLocalImage(image)) {
          return await ProductService.uploadProductImage(image as PendingUploadImage);
        }
        return image;
      }),
    );
    return uploadedImages;
  };

  const handleOpenExitModal = () => {
    if (!inventoryDetail) return;
    const data = getValues();
    if (isDeepEqual(data, toPendingStockTaking(inventoryDetail)) === false) return setOpenExitModal(true);
    handleClose();
  };

  const handleDelete = async () => {
    try {
      if (!inventoryDetail) return;
      const data = toPendingStockTaking(inventoryDetail);
      const body = toStockTakingBody(
        { ...data, status: StockTakingAnalyticStatus.CANCELLED },
        inventoryDetail.media || [],
      );
      await mutateAsync({ id: inventoryDetail?.id || '', body });
      toast.success(t('success.delete_receipt'));
      queryClient.invalidateQueries([LIST_STOCK_TAKE_KEY], { exact: false });
      handleClose();
    } catch (error) {
      // TO DO
    }
  };

  const handleDownload = async () => {
    try {
      const response = await exportStockTakingDetail(po_code);
      createDownloadElement(response);
    } catch (error) {
      //
    }
  };

  const onSubmit = async (data: PendingStockTaking) => {
    try {
      const { po_detail_ingredient, po_details, media } = data;
      // Check empty
      if (po_detail_ingredient.length === 0 && po_details.length === 0) {
        return toast.error(t('error.at_least_one_item'));
      }
      if (data.status === StockTakingAnalyticStatus.COMPLETED) {
        return setOpenConfirmStockBalance(true);
      }
      const uploadedImages = await handleUploadImages(media);
      const body = toStockTakingBody({ ...data, status: StockTakingAnalyticStatus.PROCESSING }, uploadedImages);
      await mutateAsync({ id: inventoryDetail?.id || '', body });
      toast.success(t('success.save_receipt'));
      queryClient.invalidateQueries([LIST_STOCK_TAKE_KEY], { exact: false });
      handleClose();
    } catch (error: ExpectedAny) {
      toast.error(error.message);
    }
  };

  const onError = (errors: FieldErrors<PendingStockTaking>) => {
    try {
      const poDetailIngredient = (errors?.po_detail_ingredient || []) as PendingStockTakingPoDetailIngredient[];
      const filteredPoDetailIngredient = poDetailIngredient.filter((item) => item);
      const poDetailSku = (errors?.po_details || []) as PendingStockTakingPoDetailSku[];
      const filteredPoDetailSku = poDetailSku.filter((item) => item);
      const totalEmptySkuIngredient = filteredPoDetailIngredient.length + filteredPoDetailSku.length;
      toast.error(`${totalEmptySkuIngredient} ${t('error.empty_sku_ingrident')}`);
    } catch (error) {
      // TO DO
    }
  };

  const handleClose = () => {
    const data = getValues();
    data.media.forEach((image) => {
      if (isLocalImage(image)) {
        revokeObjectUrl(image.url);
      }
    });
    onClose();
  };

  useEffect(() => {
    if (!pendingStockTaking) return;
    reset(pendingStockTaking);
  }, [pendingStockTaking, reset]);

  return (
    <>
      <DrawerHeader
        title={`${t('modal-title:stock-taking-detail')} - ${inventoryDetail?.po_code || ''} ${formatDateToString(
          inventoryDetail?.created_at || new Date(),
          'HH:mm dd/MM/yyyy',
        )}`}
        onClose={() => handleOpenExitModal()}
      >
        {inventoryDetail && inventoryDetail?.status !== StockTakingAnalyticStatus.PROCESSING ? (
          <div className="pw-flex pw-flex-1 pw-justify-end pw-gap-x-2 pw-mr-2">
            <button
              onClick={handleDownload}
              className="pw-flex pw-font-bold pw-text-neutral-primary pw-text-sm pw-py-1.5 pw-px-4 pw-rounded pw-bg-neutral-white pw-border pw-border-solid pw-border-neutral-border pw-gap-x-2 pw-items-center"
            >
              <BsDownload />
              {t('action.download_receipt')}
            </button>
            {canPrint && <PrintingButton inventoryDetail={inventoryDetail} data={pendingStockTaking} />}
          </div>
        ) : null}
      </DrawerHeader>
      <FormProvider className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden" methods={methods}>
        <DrawerBody className="pw-bg-gray-100">
          <div className="pw-flex pw-mb-6 pw-mt-2">
            {inventoryDetail?.status ? (
              <div
                className={cx(
                  'pw-text-xs pw-text-neutral-white pw-font-semibold pw-px-1 pw-w-max pw-rounded-md pw-flex pw-items-center',
                  StockTakingAnalyticStatusOption[inventoryDetail.status as StockTakingAnalyticStatus].bgColor,
                )}
              >
                {t(
                  `stocktaking-table:${
                    StockTakingAnalyticStatusOption[inventoryDetail.status as StockTakingAnalyticStatus].title
                  }`,
                )}
              </div>
            ) : null}
            <Divider vertical className="!pw-w-0.5" />
            <div>
              <span className="pw-text-sm pw-mr-0.5">{t('created_by')}:</span>
              <span className="pw-text-sm pw-font-semibold">
                {inventoryDetail?.staff_info?.staff_name || inventoryDetail?.staff_info?.phone_number}
              </span>
            </div>
          </div>
          <FormLayout
            formSchema={stockTakingFormSchema({
              images: watch('media') || [],
              status: inventoryDetail?.status || '',
              setValue,
              onAddSku: handleAddSku,
              onAddIngredient: handleAddIngredient,
            })}
          />
        </DrawerBody>
        {inventoryDetail?.status === StockTakingAnalyticStatus.PROCESSING ? (
          <DrawerFooter className="pw-justify-between">
            <Button
              appearance="subtle"
              type="button"
              className="!pw-flex pw-gap-x-2"
              onClick={() => setOpenConfirmDeleteModal(true)}
            >
              <BsTrash className="pw-w-6 pw-h-6 pw-fill-red-600" />
              <span className="pw-text-red-600 pw-text-base pw-font-bold">{t('action.delete_receipt')}</span>
            </Button>
            <div className="pw-flex pw-gap-x-4">
              <Button
                type="button"
                onClick={() => {
                  handleSubmit(
                    (data) => onSubmit({ ...data, status: StockTakingAnalyticStatus.PROCESSING }),
                    onError,
                  )();
                }}
                className="pw-button-primary-outline !pw-py-2 !pw-px-6"
              >
                <span className="pw-text-base pw-font-bold pw-text-primary-main">{t('action.save_receipt')}</span>
              </Button>
              <Button
                type="button"
                className="pw-button-primary !pw-py-2 !pw-px-6"
                onClick={() => {
                  handleSubmit((data) => onSubmit({ ...data, status: StockTakingAnalyticStatus.COMPLETED }), onError)();
                }}
              >
                <span className="pw-text-base pw-font-bold pw-text-neutral-white">{t('action.complete')}</span>
              </Button>
            </div>
          </DrawerFooter>
        ) : null}
        <ConfirmModal
          open={openConfirmStockBalance}
          title={t('modal.confirm_stock_balance')}
          description={
            <Trans
              t={t}
              i18nKey="modal.stock_balance_desc"
              context={transContext}
              values={{
                sku_count: getValues('po_details').length,
                ingredient_count: getValues('po_detail_ingredient').length,
              }}
            />
          }
          confirmText={t('common:modal-confirm-accept-btn') || ''}
          cancelText={t('common:modal-confirm-refuse-btn') || ''}
          backdropClassName="!pw-z-[1050]"
          size="sm"
          className="!pw-flex !pw-absolute !-pw-translate-x-1/2 xl:-pw-translate-y-1/2 xl:pw-top-1/2 pw-left-1/2
            pw-items-center pw-justify-center xl:!pw-my-0 center-modal !pw-z-2000"
          onConfirm={async () => {
            const data = getValues();
            const uploadedImages = await handleUploadImages(data.media);
            const body = toStockTakingBody({ ...data, status: StockTakingAnalyticStatus.COMPLETED }, uploadedImages);
            await mutateAsync({ id: inventoryDetail?.id || '', body });
            toast.success(t('success.complete'));
            queryClient.invalidateQueries([LIST_STOCK_TAKE_KEY], { exact: false });
            handleClose();
          }}
          onClose={() => setOpenConfirmStockBalance(false)}
        />
        <ConfirmModal
          open={openExitModal}
          title={t('modal.exit_without_save_title')}
          description={t('modal.exit_without_save_desc')}
          confirmText={t('common:modal-confirm-accept-btn') || ''}
          cancelText={t('common:modal-confirm-refuse-btn') || ''}
          backdropClassName="!pw-z-[1050]"
          size="sm"
          className="!pw-flex !pw-absolute !-pw-translate-x-1/2 xl:-pw-translate-y-1/2 xl:pw-top-1/2 pw-left-1/2
            pw-items-center pw-justify-center xl:!pw-my-0 center-modal !pw-z-2000"
          onConfirm={() => handleClose()}
          onClose={() => setOpenExitModal(false)}
        />
      </FormProvider>
      <ConfirmModal
        open={openConfirmDeleteModal}
        isDelete
        title={t('modal.cancel_receipt_title')}
        iconTitle={<BsTrash size={24} />}
        description={t('modal.cancel_receipt_desc')}
        confirmText={t('common:delete') || ''}
        cancelText={t('common:back') || ''}
        backdropClassName="!pw-z-[1050]"
        size="xs"
        className="!pw-flex !pw-absolute !-pw-translate-x-1/2 xl:-pw-translate-y-1/2 xl:pw-top-1/2 pw-left-1/2
            pw-items-center pw-justify-center xl:!pw-my-0 center-modal !pw-z-2000"
        onConfirm={() => handleDelete()}
        onClose={() => setOpenConfirmDeleteModal(false)}
      />
      {isSubmitting || isFetching ? <Loading backdrop={true} vertical={true} className="pw-z-2000" /> : null}
    </>
  );
};

export default DetailStockTaking;
