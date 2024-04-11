import { useRef } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { exportGoodsFormSchema } from './config';
import { StatusInventory, defaultExportGoods } from '~app/features/warehouse/utils';
import { DrawerHeader, DrawerBody, DrawerFooter, Loading } from '~app/components';
import { ProductService } from '~app/services/api';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { ProductSelectionRef } from '~app/features/orders/components';
import { SKUS_INVENTORY_KEY, INVENTORY_KEY, INVENTORY_IMPORT_EXPORT_BOOK_KEY } from '~app/services/queries';
import { useCreateExportGoodsMutation } from '~app/services/mutations';
import { isLocalImage } from '~app/utils/helpers';
import { queryClient } from '~app/configs/client';

const CreateExportGoods = ({ onClose }: { onClose: () => void }): JSX.Element => {
  const { t } = useTranslation(['purchase-order']);
  const productSelectionRef = useRef<ProductSelectionRef>(null);
  const { mutateAsync: createExport } = useCreateExportGoodsMutation();
  const methods = useForm<ReturnType<typeof defaultExportGoods>>({
    defaultValues: defaultExportGoods({}),
  });
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: PendingCreateExportGoods) => {
    if (isSubmitting) return;
    if (data.po_details.length === 0 && data.po_detail_ingredient.length === 0) {
      return toast.error(t('at_least_one_product_export_goods'));
    }
    const newData = { ...data };
    try {
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
      await createExport({
        ...newData,
        po_details: poDetailList,
        po_detail_ingredient: poDetailIngredientList,
      });
      queryClient.invalidateQueries([SKUS_INVENTORY_KEY], { exact: false });
      queryClient.invalidateQueries([INVENTORY_IMPORT_EXPORT_BOOK_KEY], { exact: false });
      queryClient.invalidateQueries([INVENTORY_KEY], { exact: false });
      toast.success(
        data.status === StatusInventory.COMPLETED ? t('success.create-export-goods') : t('success.save-export-goods'),
      );
      handleClose();
    } catch (_) {
      //
    }
  };
  return (
    <>
      <DrawerHeader title={t('modal-title:export-goods')} onClose={handleClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-gray-100">
          <FormLayout
            formSchema={exportGoodsFormSchema({
              t,
              images: watch('media'),
              poDetails: watch('po_details') || [],
              poDetailIngredient: watch('po_detail_ingredient') || [],
              isImportGoods: false,
              productSelectionRef,
              setValue,
            })}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button
            className="pw-button-secondary !pw-py-2 !pw-px-6"
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
        </DrawerFooter>
      </FormProvider>
      {isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-2000" /> : null}
    </>
  );
};

export default CreateExportGoods;
