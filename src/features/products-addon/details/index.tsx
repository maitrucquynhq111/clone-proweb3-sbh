import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BsTrash } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { Button } from 'rsuite';
import { DrawerHeader, DrawerBody, DrawerFooter, Loading, ModalRefObject, ModalConfirm } from '~app/components';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { queryClient } from '~app/configs/client';
import { LinkedProductDrawer } from '~app/features/products-addon/components';
import { productAddOnGroupFormSchema } from '~app/features/products-addon/details/config';
import {
  defaultProductAddOnGroup,
  productAddOnGroupYupSchema,
  toPendingLinkedProductsAddOn,
  toPendingProductAddOnGroup,
} from '~app/features/products-addon/utils';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { SyncType } from '~app/features/pos/constants';
import { useDeleteProductAddonMutation, useUpdateProductAddOnGroupMutation } from '~app/services/mutations';
import { PRODUCTS_ADDON_KEY, useAddonGroupDetailQuery, useLinkedProductAddonQuery } from '~app/services/queries';

const Details = ({ onClose, id }: { id?: string; onClose: () => void }): JSX.Element => {
  const { syncDataByTypes } = useOfflineContext();
  const confirmModalRef = useRef<ModalRefObject>(null);
  const { t } = useTranslation(['modal-title', 'common']);
  const [open, setOpen] = useState(false);

  const { mutateAsync } = useUpdateProductAddOnGroupMutation();
  const { mutateAsync: deleteMutateAsync } = useDeleteProductAddonMutation();
  const { data: productAddonGroupDetail, isLoading, isError } = useAddonGroupDetailQuery(id ? id : '');
  const { data: linked_product } = useLinkedProductAddonQuery({
    id: id ? id : '',
    page: 1,
    page_size: 75,
  });

  const methods = useForm<PendingProductAddOnGroup>({
    resolver: yupResolver(productAddOnGroupYupSchema()),
    defaultValues: defaultProductAddOnGroup,
  });

  const {
    handleSubmit,
    reset,
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
      const product_ids_remove =
        linked_product?.data
          .filter((item) => !data.linked_products.find((product) => product.product_id === item.id))
          .map((item) => item.id) || [];
      const product_ids_add = data.linked_products
        .filter((item) => !linked_product?.data.find((product) => product.id === item.product_id))
        .map((item) => item.product_id);
      params.product_ids_add = product_ids_add;
      params.product_ids_remove = product_ids_remove;
      await mutateAsync(params);
      toast.success(t('product-addon-form:success.update'));
      queryClient.invalidateQueries([PRODUCTS_ADDON_KEY], { exact: false });
      syncDataByTypes([SyncType.PRODUCTS]);
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

  const handleDelete = async () => {
    try {
      await deleteMutateAsync({
        id,
      } as ExpectedAny);
      toast.success(t('product-addon-form:success.delete'));
      queryClient.invalidateQueries([PRODUCTS_ADDON_KEY], { exact: false });
      onClose();
    } catch (error) {
      // TO DO
    }
  };

  const handleOpenDeleteConfirm = () => {
    const confirmModalData = {
      title: '',
      modalTitle: t('common:modal-confirm-title'),
      modalContent: t('common:ensure_to_perform'),
      acceptText: t('common:modal-confirm-accept-btn'),
      cancelText: t('common:modal-confirm-refuse-btn'),
      action: () => {
        handleDelete();
      },
    };
    confirmModalRef.current?.handleOpen(confirmModalData);
  };

  useEffect(() => {
    if (!productAddonGroupDetail) return;
    const params = toPendingProductAddOnGroup(productAddonGroupDetail);
    if (linked_product) {
      params.linked_products = linked_product.data.map((item) => toPendingLinkedProductsAddOn(item));
    }
    reset(params);
  }, [productAddonGroupDetail, linked_product]);

  useEffect(() => {
    if (isError) {
      onClose();
    }
  }, [isError]);

  return (
    <>
      <DrawerHeader title={t('modal-title:detail-product-addon')} onClose={onClose} />
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
        <DrawerFooter className="pw-justify-between">
          <Button appearance="subtle" onClick={handleOpenDeleteConfirm} type="button" className="!pw-flex pw-gap-x-2">
            <BsTrash className="pw-w-6 pw-h-6 pw-fill-red-600" />
            <span className="pw-text-red-600 pw-text-base pw-font-bold">{t('common:delete')}</span>
          </Button>
          <div>
            <Button onClick={onClose} className="pw-button-secondary pw-mr-2 !pw-py-3 !pw-px-6">
              <span className="pw-text-base pw-font-bold pw-text-neutral-primary">{t('common:cancel')}</span>
            </Button>
            <Button type="submit" className="pw-button-primary !pw-py-3 !pw-px-6">
              <span className="pw-text-base pw-font-bold pw-text-neutral-white">{t('common:modal-confirm')}</span>
            </Button>
          </div>
        </DrawerFooter>
        {open ? <LinkedProductDrawer open={open} setOpen={setOpen} /> : null}
        {isLoading || isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-[2000]" /> : null}
      </FormProvider>
      <ModalConfirm ref={confirmModalRef} backdropClassName="!pw-z-[1050]" />
    </>
  );
};
export default Details;
