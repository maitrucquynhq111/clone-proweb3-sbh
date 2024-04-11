import { useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { purchaseFormSchema, purchaseYupSchema } from './config';
import { defaultImportGoods, INVENTORY_TYPE, PaymentStateInventory } from '~app/features/warehouse/utils';
import { DrawerHeader, DrawerBody, DrawerFooter, Loading } from '~app/components';
import { ProductService } from '~app/services/api';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { ProductSelectionRef } from '~app/features/orders/components';
import { SKUS_INVENTORY_KEY, INVENTORY_KEY, INVENTORY_IMPORT_EXPORT_BOOK_KEY } from '~app/services/queries';
import { useCreateImportGoodsMutation } from '~app/services/mutations';
import { isLocalImage } from '~app/utils/helpers';
import { queryClient } from '~app/configs/client';

const CreateImportGoods = ({
  onSuccess,
  onClose,
}: {
  onSuccess?: (data: JSONRecord<InventoryCreateForm>) => void;
  onClose: () => void;
}): JSX.Element => {
  const { t } = useTranslation(['purchase-order']);
  const productSelectionRef = useRef<ProductSelectionRef>(null);
  const { mutateAsync: createImport } = useCreateImportGoodsMutation();
  const methods = useForm<ReturnType<typeof defaultImportGoods>>({
    resolver: yupResolver(purchaseYupSchema()),
    defaultValues: defaultImportGoods({
      action_type: INVENTORY_TYPE.in,
    }),
  });
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const handleContactChange = useCallback((data: Contact) => {
    setValue('contact_phone', data.phone_number);
    setValue('contact_avatar', data.avatar);
    setValue('contact_debt_amount', data.debt_amount || 0);
  }, []);

  const handleRemoveContact = () => {
    setValue('contact_id', '');
    setValue('contact_phone', '');
    setValue('contact_avatar', '');
    setValue('contact_name', '');
    setValue('contact_debt_amount', 0);
  };

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: PendingInventoryCreate) => {
    if (isSubmitting) return;
    if (data.po_details.length === 0 && data.po_detail_ingredient.length === 0) {
      return toast.error(t('at_least_one_product_import_goods'));
    }
    const newData = { ...data };
    try {
      const buyerPay = data.buyer_pay?.toFixed(0) || 0;
      const poAmount = data.po_details.reduce((acc, curr) => acc + curr.quantity * curr.pricing, 0);
      const poIngredientAmount = (data.po_detail_ingredient || []).reduce(
        (acc, curr) => acc + curr.quantity * curr.price,
        0,
      );
      newData.payment_state =
        (data?.buyer_pay && data.buyer_pay > 0) || poAmount + poIngredientAmount === 0
          ? PaymentStateInventory.PAID
          : PaymentStateInventory.UNPAID;
      newData.buyer_pay = +buyerPay;
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
      delete newData.contact_avatar;
      delete newData.contact_name;
      delete newData.contact_phone;
      delete newData.contact_debt_amount;
      const response = await createImport({
        ...newData,
        po_details: poDetailList,
        po_detail_ingredient: poDetailIngredientList,
      });
      onSuccess?.(response);
      queryClient.invalidateQueries([SKUS_INVENTORY_KEY], { exact: false });
      queryClient.invalidateQueries([INVENTORY_IMPORT_EXPORT_BOOK_KEY], { exact: false });
      queryClient.invalidateQueries([INVENTORY_KEY], { exact: false });
      toast.success(t('success.create-import-goods'));
      handleClose();
    } catch (_) {
      //
    }
  };
  return (
    <>
      <DrawerHeader title={t('modal-title:import-goods')} onClose={handleClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-gray-100">
          <FormLayout
            formSchema={purchaseFormSchema({
              hasContact: !!watch('contact_id'),
              images: watch('media'),
              poDetails: watch('po_details') || [],
              poDetailIngredient: watch('po_detail_ingredient') || [],
              isImportGoods: true,
              productSelectionRef,
              onRemoveContact: handleRemoveContact,
              onContactChange: handleContactChange,
              setValue,
            })}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button onClick={handleClose} className="pw-button-secondary !pw-py-3 !pw-px-6">
            <span className="pw-text-base pw-font-bold pw-text-neutral-primary">{t('common:cancel')}</span>
          </Button>
          <Button type="submit" className="pw-button-primary !pw-py-3 !pw-px-6">
            <span className="pw-text-base pw-font-bold pw-text-neutral-white">{t('common:modal-confirm')}</span>
          </Button>
        </DrawerFooter>
      </FormProvider>
      {isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-2000" /> : null}
    </>
  );
};

export default CreateImportGoods;
