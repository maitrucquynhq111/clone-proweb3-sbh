import { toast } from 'react-toastify';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldErrors, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { DrawerHeader, DrawerBody, DrawerFooter, Loading } from '~app/components';
import { defaultProductAddOnGroup, productAddOnGroupYupSchema } from '~app/features/products-addon/utils';
import FormProvider from '~app/components/HookForm/FormProvider';
import FormLayout from '~app/components/HookForm/FormLayout';
import { productAddOnGroupFormSchema } from '~app/features/products-addon/create/config';
import { LinkedProductDrawer } from '~app/features/products-addon/components';
import { useCreateProductAddOnGroupMutation } from '~app/services/mutations';
import { PRODUCTS_ADDON_KEY } from '~app/services/queries';
import { queryClient } from '~app/configs/client';

const Create = ({ onClose }: { onClose: () => void }): JSX.Element => {
  const { t } = useTranslation(['modal-title', 'common', 'product-addon-form']);
  const [open, setOpen] = useState(false);

  const { mutateAsync } = useCreateProductAddOnGroupMutation();

  const methods = useForm<PendingProductAddOnGroup>({
    resolver: yupResolver(productAddOnGroupYupSchema()),
    defaultValues: defaultProductAddOnGroup,
  });

  const {
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: PendingProductAddOnGroup) => {
    try {
      const params = {
        id: data.id,
        name: data.name,
        is_required: data.is_required,
        is_multiple_items: data.is_multiple_items,
        list_product_add_on: data.list_product_add_on,
        is_multiple_options: data.is_multiple_options,
        product_ids_add: data.product_ids_add,
        product_ids_remove: data.product_ids_remove,
      } as PendingAddOnGroup;
      await mutateAsync(params);
      toast.success(t('product-addon-form:success.create'));
      queryClient.invalidateQueries([PRODUCTS_ADDON_KEY], { exact: false });
      onClose();
    } catch (_) {
      // TO DO
    }
  };

  const onError = (errors: FieldErrors<PendingProductAddOnGroup>) => {
    const list_product_add_on = getValues('list_product_add_on');
    if (list_product_add_on.length === 0) {
      return toast.error(errors.list_product_add_on?.message);
    }
    for (let index = 0; index < list_product_add_on.length; index++) {
      const errorListProductAddOn = errors.list_product_add_on;
      if (!errorListProductAddOn) break;
      const errorProductAddOn = errorListProductAddOn?.find?.((_, errorIndex) => index === errorIndex);
      if (errorProductAddOn?.name) {
        toast.error(errorProductAddOn?.name?.message || '');
        break;
      }
    }
  };

  return (
    <>
      <DrawerHeader title={t('modal-title:create-product-addon')} onClose={onClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <DrawerBody className="pw-bg-gray-100">
          <FormLayout
            formSchema={productAddOnGroupFormSchema({
              setOpen,
            })}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button onClick={onClose} className="pw-button-secondary !pw-py-3 !pw-px-6">
            <span className="pw-text-base pw-font-bold pw-text-neutral-primary">{t('common:cancel')}</span>
          </Button>
          <Button type="submit" className="pw-button-primary !pw-py-3 !pw-px-6">
            <span className="pw-text-base pw-font-bold pw-text-neutral-white">{t('common:modal-confirm')}</span>
          </Button>
        </DrawerFooter>
        {open ? <LinkedProductDrawer open={open} setOpen={setOpen} /> : null}
        {isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-[2000]" /> : null}
      </FormProvider>
    </>
  );
};
export default Create;
