import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useForm, FieldErrors } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import {
  defaultStockTaking,
  toStockTakingBody,
  stockTakingYupSchema,
  stockTakingFormSchema,
  addSku,
  addIngredient,
} from '../utils';
import { isDeepEqual, isLocalImage, revokeObjectUrl } from '~app/utils/helpers';
import { ConfirmModal, DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import FormProvider from '~app/components/HookForm/FormProvider';
import FormLayout from '~app/components/HookForm/FormLayout';
import { StockTakingAnalyticStatus } from '~app/utils/constants';
import { useCreateStockTaking } from '~app/services/mutations';
import { ProductService } from '~app/services/api';
import { queryClient } from '~app/configs/client';
import { LIST_STOCK_TAKE_KEY } from '~app/services/queries';

const CreateStockTaking = ({
  onSuccess,
  onClose,
}: {
  onSuccess?: (data: ExpectedAny) => void;
  onClose: () => void;
}) => {
  const { t } = useTranslation('stocktaking-form');
  const { mutateAsync } = useCreateStockTaking();
  const methods = useForm<PendingStockTaking>({
    resolver: yupResolver(stockTakingYupSchema()),
    defaultValues: defaultStockTaking,
  });
  const [openConfirmStockBalance, setOpenConfirmStockBalance] = useState(false);
  const [openExitModal, setOpenExitModal] = useState(false);

  const {
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const transContext = useMemo(() => {
    const { po_details, po_detail_ingredient } = getValues();
    if (po_details.length > 0 && po_detail_ingredient.length > 0) return undefined;
    if (po_details.length > 0) return 'sku';
    if (po_detail_ingredient.length > 0) return 'ingredient';
  }, [getValues, openConfirmStockBalance]);

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
    const data = getValues();
    if (isDeepEqual(data, defaultStockTaking) === false) return setOpenExitModal(true);
    handleClose();
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
      await mutateAsync(body);
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

  return (
    <>
      <DrawerHeader title={t('modal-title:stock-taking')} onClose={() => handleOpenExitModal()} />
      <FormProvider className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden" methods={methods}>
        <DrawerBody className="pw-bg-gray-100">
          <FormLayout
            formSchema={stockTakingFormSchema({
              images: watch('media') || [],
              status: getValues('status'),
              setValue,
              onAddSku: handleAddSku,
              onAddIngredient: handleAddIngredient,
            })}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button
            type="button"
            onClick={() => {
              handleSubmit((data) => onSubmit({ ...data, status: StockTakingAnalyticStatus.PROCESSING }), onError)();
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
        </DrawerFooter>
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
            const response = await mutateAsync(body);
            onSuccess?.(response);
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
      {isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-2000" /> : null}
    </>
  );
};

export default CreateStockTaking;
