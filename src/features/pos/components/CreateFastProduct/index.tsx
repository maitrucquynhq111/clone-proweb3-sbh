import { memo, useEffect, useState } from 'react';
import { Button, Drawer, IconButton } from 'rsuite';
import { RiFlashlightFill } from 'react-icons/ri';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { DrawerBody, DrawerFooter, DrawerHeader, Loading, UpgradePackageModal } from '~app/components';
import FormProvider from '~app/components/HookForm/FormProvider';
import {
  addToListOrderItem,
  fastProductFormSchema,
  fastProductYupSchema,
  initialFastProduct,
  toInitialOrderItem,
} from '~app/features/pos/utils';
import FormLayout from '~app/components/HookForm/FormLayout';
import { createProduct } from '~app/features/products/utils';
import { ProductService } from '~app/services/api';
import { ID_EMPTY } from '~app/configs';
import { getErrorMessage } from '~app/utils/helpers';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';
import { SyncType } from '~app/features/pos/constants';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { usePackage } from '~app/utils/shield/usePackage';
import { PackageKey } from '~app/utils/constants';

function CreateFastProduct() {
  const { t } = useTranslation('pos');
  const [open, setOpen] = useState(false);
  const [openUpgrade, setOpenUpgrade] = useState(false);
  const [listOrderItem, setListOrderItem] = useSelectedOrderStore((store) => store.list_order_item);
  const { syncDataByTypes } = useOfflineContext();
  const initFastProduct = initialFastProduct({
    index: listOrderItem.filter((item) => item.product_id === ID_EMPTY).length + 1,
  });
  const { canAccess, description } = usePackage(
    [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
    'product_create_quick',
  );
  const methods = useForm<PendingFastProduct>({
    resolver: yupResolver(fastProductYupSchema()),
    defaultValues: initFastProduct,
  });
  const { handleSubmit, setValue, reset, formState } = methods;

  useEffect(() => {
    reset(initFastProduct);
  }, [listOrderItem.length]);

  const handleClose = () => setOpen(false);

  const onSubmit = async (data: PendingFastProduct) => {
    try {
      if (formState.isLoading) return;
      // check product name existed in list order item ?
      const invalidName = listOrderItem.some((item) => item.product_name === data.name);
      if (invalidName) {
        return toast.error(t('error.existed_product_name'));
      }
      let response = null;
      const newProduct = createProduct();
      const nextProduct = {
        ...newProduct,
        name: data.name,
        tag_id: ID_EMPTY,
        skus: newProduct.skus.map((sku) => ({
          ...sku,
          normal_price: data.normal_price,
          historical_cost: data.historical_cost,
        })),
      };
      if (data.save_product) {
        response = await ProductService.createProduct(nextProduct);
        toast.success(t('success.create_fast_product'));
        syncDataByTypes([SyncType.PRODUCTS]);
      }
      // add to order items
      const sku = nextProduct.skus[0];
      if (sku) {
        const orderItem = toInitialOrderItem(
          {
            id: response?.id || ID_EMPTY,
            name: data.name,
            images: response?.images || [],
            product_type: nextProduct.product_type,
          },
          { ...sku, id: response?.list_sku?.[0]?.id || '', can_pick_quantity: 0, range_wholesale_price: [] },
          undefined,
          undefined,
          undefined,
          undefined,
          data.historical_cost,
        );
        setListOrderItem((prevState) => {
          const listOrderItem = addToListOrderItem(orderItem, prevState.list_order_item, +data.quantity);
          return { ...prevState, list_order_item: listOrderItem };
        });
      }
      handleClose();
    } catch (error) {
      // TO DO
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <IconButton
        size="lg"
        icon={<RiFlashlightFill size={22} />}
        className="!pw-bg-green-800 !pw-text-yellow-400"
        onClick={() => {
          if (!canAccess) return setOpenUpgrade(true);
          setOpen(true);
        }}
      />
      <Drawer open={open} onClose={() => setOpen(false)} size="xs" keyboard={false} backdrop="static">
        <div className="pw-flex pw-flex-col !pw-h-screen">
          <DrawerHeader title={t('create_fast_product')} onClose={handleClose} />
          <FormProvider
            className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
            methods={methods}
            onSubmit={handleSubmit(onSubmit)}
          >
            <DrawerBody className="pw-bg-white">
              <FormLayout formSchema={fastProductFormSchema({ setValue })} />
            </DrawerBody>
            <DrawerFooter>
              <Button appearance="ghost" onClick={handleClose}>
                <span>{t('common:cancel')}</span>
              </Button>
              <Button appearance="primary" type="submit">
                <span>{t('common:create')}</span>
              </Button>
            </DrawerFooter>
          </FormProvider>
          {formState.isLoading ? <Loading backdrop={true} vertical={true} className="pw-z-2000" /> : null}
        </div>
      </Drawer>
      {openUpgrade && (
        <UpgradePackageModal
          description={description}
          onConfirm={() => setOpenUpgrade(false)}
          onClose={() => setOpenUpgrade(false)}
        />
      )}
    </>
  );
}

export default memo(CreateFastProduct);
