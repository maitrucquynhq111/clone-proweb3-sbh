import { useTranslation } from 'react-i18next';
import { Button, Drawer } from 'rsuite';
import { useEffect } from 'react';
import { BsExclamationTriangleFill } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { productFormSchema, toPendingSoldOut } from './config';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { DrawerBody, DrawerFooter, DrawerHeader } from '~app/components';
import { useUpdateSoldOutMutation } from '~app/services/mutations';
import { SyncType } from '~app/features/pos/constants';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';

type Props = {
  data: OutOfStockItem[];
  hideDelete?: boolean;
  open: boolean;
  onSuccess?: (data: ExpectedAny, status: string) => void;
  onClose: () => void;
};

const ProductOutOfStock = ({ data, hideDelete = false, open, onSuccess, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('products-form');
  const { mutateAsync } = useUpdateSoldOutMutation();
  const { syncDataByTypes } = useOfflineContext();

  const methods = useForm();
  const { handleSubmit, watch, setValue, reset } = methods;
  const canUpdateInventory = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_INVENTORY_VIEW]);

  useEffect(() => {
    if (data.length > 0) {
      reset({ data });
    }
  }, [data]);

  const onSubmit = async (data: ExpectedAny) => {
    try {
      if (!canUpdateInventory) return;
      const nextData = data.data.map((item: ExpectedAny) => toPendingSoldOut(item));
      await mutateAsync(nextData);
      toast.success(t('pos:success.update_sold_out'));
      syncDataByTypes([SyncType.CONTACTS, SyncType.PRODUCTS]);
      handleClose();
    } catch (error) {
      // TO DO
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleRemove = () => {
    onSuccess?.(data, 'remove');
    onClose();
  };

  const checkDisabled = () => {
    if (!canUpdateInventory) return true;
    const values = watch();
    if (Object.keys(values).length === 0) return true;
    const isDisabled = values.data.some(
      (item: ExpectedAny) =>
        item.is_active ||
        data.some(
          (responseItem) =>
            responseItem.product_id === item.product_id &&
            responseItem.missing_quantity <= (item?.po_details?.quantity || 0),
        ),
    );
    return !isDisabled;
  };

  return (
    <Drawer open={open} onClose={handleClose} size="sm" keyboard={false} backdrop="static">
      <div className="pw-flex pw-flex-col !pw-h-screen">
        <DrawerHeader title={t('out_of_stock_product')} onClose={handleClose} />
        <div className="pw-flex pw-bg-orange-50 pw-p-4 pw-shadow-dropdown">
          <div className="pw-text-orange-700 pw-mr-2 pw-text-xl">
            <BsExclamationTriangleFill />
          </div>
          <span className="pw-text-sm pw-text-orange-800"> {t('warning.warning_out_of_stock')} </span>
        </div>
        <FormProvider
          className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
          methods={methods}
          onSubmit={handleSubmit(onSubmit)}
        >
          <DrawerBody className="pw-bg-white !pw-p-0">
            <FormLayout
              formSchema={productFormSchema({
                data,
                setValue,
              })}
            />
          </DrawerBody>
          <DrawerFooter>
            {!hideDelete && (
              <Button className="!pw-py-3 !pw-px-6" appearance="ghost" onClick={handleRemove}>
                {t('common:delete')}
              </Button>
            )}
            <Button className="!pw-py-3 !pw-px-6" appearance="primary" type="submit" disabled={checkDisabled()}>
              {t('common:update')}
            </Button>
          </DrawerFooter>
        </FormProvider>
      </div>
    </Drawer>
  );
};

export default ProductOutOfStock;
