import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Button } from 'rsuite';
import { warehouseFormSchema, defaultWarehouseDetails } from './config';
import { DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { INVENTORY_ANALYTICS_KEY, SKUS_INVENTORY_KEY, useWarehouseDetailsQuery } from '~app/services/queries';
import { useUpdateSkuMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import {
  skuInventoryYupSchema,
  toPendingSkuInventory,
} from '~app/features/warehouse/lists/components/OpenInventory/config';

const WarehouseDetail = ({ onClose }: { onClose: () => void }): JSX.Element => {
  const { t } = useTranslation('inventory-form');
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') as string;
  const { data: warehouseDetail, isLoading, isError } = useWarehouseDetailsQuery(id || '');
  const { mutateAsync } = useUpdateSkuMutation();

  const methods = useForm<PendingWarehouseDetail>({
    resolver: yupResolver(skuInventoryYupSchema()),
    defaultValues: defaultWarehouseDetails(),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: PendingWarehouseDetail) => {
    if (warehouseDetail) {
      try {
        const sku = toPendingSkuInventory(data as ExpectedAny);
        delete (sku.po_details as ExpectedAny).sku_info;
        delete (sku.po_details as ExpectedAny).sku_id;
        sku.sku_name = warehouseDetail.name;
        if (data.po_details.quantity !== sku.total_quantity) {
          sku.po_details.quantity = data.po_details.quantity - warehouseDetail.po_details.quantity;
        }
        await mutateAsync({ id, sku });
        queryClient.invalidateQueries([SKUS_INVENTORY_KEY], { exact: false });
        queryClient.invalidateQueries([INVENTORY_ANALYTICS_KEY], { exact: false });
        toast.success(t('success.update_sku_inventory'));
        onClose();
      } catch (_) {
        // TO DO
      }
    }
  };

  useEffect(() => {
    if (!warehouseDetail) return;
    reset(warehouseDetail);
  }, [warehouseDetail]);

  useEffect(() => {
    if (isError) {
      onClose();
    }
  }, [isError]);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t(`modal-title:warehouse-details`)} onClose={onClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white">
          <FormLayout
            formSchema={warehouseFormSchema({
              productId: warehouseDetail?.product_id || '',
              media: watch('media') || [],
              name: watch('name'),
              product_name: watch('product_name'),
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
      </FormProvider>
      {isLoading || isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-[2000]" /> : null}
    </div>
  );
};

export default WarehouseDetail;
