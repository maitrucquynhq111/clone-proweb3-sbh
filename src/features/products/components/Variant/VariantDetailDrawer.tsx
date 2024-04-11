import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Drawer } from 'rsuite';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { DrawerBody, DrawerFooter, DrawerHeader } from '~app/components';
import FormLayout from '~app/components/HookForm/FormLayout';
import { variantDetailFormSchema, variantDetailYubSchema } from '~app/features/products/components/Variant/config';
import { useSkuDetail } from '~app/utils/hooks/useSkuDetail';
import { InfoTabKeyType, createSku } from '~app/features/products/utils';
import FormProvider from '~app/components/HookForm/FormProvider';
import { checkInvalidSkusRangeWholesalePrice } from '~app/utils/helpers';
import { InfoTabs } from '~app/features/products/components';
import { useGetIngredientsQuery } from '~app/services/queries';
import { IngredientPermission, useHasPermissions } from '~app/utils/shield';

type Props = {
  has_ingredient: boolean;
  onUpdateSku(sku: PendingSku): void;
};

const VariantDetailDrawer = ({ has_ingredient, onUpdateSku }: Props) => {
  const { t } = useTranslation(['products-form', 'modal-title', 'common']);
  const [activeTab, setActiveTab] = useState<InfoTabKeyType>(InfoTabKeyType.INFO);
  const { selectedSku, setSelectedSku, open, setOpen } = useSkuDetail();
  const canViewIngredient = useHasPermissions([IngredientPermission.INGREDIENT_LIST_VIEW]);
  const { data: ingredients } = useGetIngredientsQuery({
    page: 1,
    pageSize: 1,
    enabled: canViewIngredient && has_ingredient,
  });

  const methods = useForm<PendingSku>({
    resolver: yupResolver(variantDetailYubSchema()),
    values: selectedSku ? selectedSku : { ...createSku({}) },
  });
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = methods;

  const handleClose = () => {
    setSelectedSku(null);
    setOpen(false);
  };

  const handleRangeWholesalePriceChange = useCallback((value: RangeWholesalePrice[]) => {
    setValue('range_wholesale_price', value);
  }, []);

  const handleStatusChange = useCallback((value: boolean) => {
    setValue('is_active', value);
  }, []);

  const handleMediaChange = useCallback((value: ExpectedAny) => {
    setValue('media', value);
  }, []);

  const handleRecipeChange = useCallback((value: ExpectedAny) => {
    setValue('recipe', value);
  }, []);

  const onSubmit = (data: PendingSku) => {
    const errorWholesalePrice = checkInvalidSkusRangeWholesalePrice([data], t);
    if (errorWholesalePrice) {
      return toast.error(errorWholesalePrice);
    }
    onUpdateSku(data);
    handleClose();
  };

  useEffect(() => {
    if (selectedSku) {
      reset(selectedSku);
    }
  }, [selectedSku]);

  useEffect(() => {
    if (activeTab === InfoTabKeyType.INFO && errors?.recipe && !errors?.normal_price) {
      setActiveTab(InfoTabKeyType.RECIPE);
      toast.error(t('error.at_least_one_ingredient'));
    }
    if (activeTab === InfoTabKeyType.RECIPE && errors?.normal_price) {
      setActiveTab(InfoTabKeyType.INFO);
      toast.error(t('error.min_normal_price'));
    }
  }, [errors]);

  return (
    <Drawer open={open} onClose={handleClose} size="md" keyboard={false} backdrop="static">
      <div className="pw-flex pw-flex-col !pw-h-screen">
        <DrawerHeader title={selectedSku?.name || ''} onClose={handleClose} />
        <FormProvider
          className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
          methods={methods}
          onSubmit={handleSubmit(onSubmit)}
        >
          {canViewIngredient && has_ingredient && (
            <InfoTabs className="pw-mb-6" activeTab={activeTab} setActiveTab={setActiveTab} />
          )}
          <DrawerBody className="pw-bg-white">
            <FormLayout
              formSchema={variantDetailFormSchema({
                sku_type: watch('sku_type'),
                is_active: watch('is_active'),
                media: watch('media'),
                selectedSku: watch(),
                has_ingredient,
                activeTab,
                ingredientsLength: ingredients?.data.length || 0,
                onStatusChange: handleStatusChange,
                onRangeWholesalePriceChange: handleRangeWholesalePriceChange,
                onMediaChange: handleMediaChange,
                onRecipeChange: handleRecipeChange,
              })}
            />
          </DrawerBody>
          <DrawerFooter>
            <Button appearance="ghost" onClick={handleClose}>
              {t('common:cancel')}
            </Button>
            <Button appearance="primary" type="submit">
              {t('common:modal-confirm-title')}
            </Button>
          </DrawerFooter>
        </FormProvider>
      </div>
    </Drawer>
  );
};

export default VariantDetailDrawer;
