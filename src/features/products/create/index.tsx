import { useCallback, useState } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Button } from 'rsuite';
import { productFormSchema, productYupSchema } from './config';
import FormProvider from '~app/components/HookForm/FormProvider';
import { InfoTabKeyType, createProduct } from '~app/features/products/utils';
import FormLayout from '~app/components/HookForm/FormLayout';
import { DrawerHeader, DrawerBody, DrawerFooter, Loading, UpgradePackageModal } from '~app/components';
import { SkuDetailProvider } from '~app/utils/hooks/useSkuDetail';
import VariantDetailDrawer from '~app/features/products/components/Variant/VariantDetailDrawer';
import { ProductService } from '~app/services/api';
import {
  checkInvalidSkusRangeWholesalePrice,
  isLocalImage,
  prepareListVariant,
  revokeObjectUrl,
  toPendingRecipe,
} from '~app/utils/helpers';
import { ID_EMPTY } from '~app/configs';
import { POS_PRODUCTS_KEY, PRODUCTS_KEY, SKUS_INVENTORY_KEY, useGetIngredientsQuery } from '~app/services/queries';
import { queryClient } from '~app/configs/client';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { SyncType } from '~app/features/pos/constants';
import { InfoTabs } from '~app/features/products/components';
import { IngredientPermission, useHasPermissions } from '~app/utils/shield';
import { usePackage } from '~app/utils/shield/usePackage';

const ProductsDetails = ({
  onSuccess,
  onClose,
}: {
  onSuccess?: (data: Product) => void;
  onClose: () => void;
}): JSX.Element => {
  const { syncDataByTypes } = useOfflineContext();
  const { t } = useTranslation(['products-form', 'modal-title', 'common']);
  const [isLoading, setIsLoading] = useState(false);
  const [openUpgrade, setOpenUpgrade] = useState('');
  const [activeTab, setActiveTab] = useState<InfoTabKeyType>(InfoTabKeyType.INFO);
  const canViewIngredient = useHasPermissions([IngredientPermission.INGREDIENT_LIST_VIEW]);
  const methods = useForm<PendingProduct>({
    mode: 'all',
    resolver: yupResolver(productYupSchema()),
    defaultValues: { ...createProduct(), sku_attributes: [] },
  });
  const { currentPackage, description } = usePackage([], openUpgrade);

  const { handleSubmit, watch, setValue, getValues } = methods;
  const is_variant = watch('is_variant');
  const has_ingredient = watch('has_ingredient');

  const { data: ingredients } = useGetIngredientsQuery({
    page: 1,
    pageSize: 1,
    enabled: canViewIngredient && has_ingredient,
  });

  const handleUpdateSku = useCallback((sku: PendingSku) => {
    const skuList = [...getValues('skus')] as PendingSku[];
    const index = skuList.findIndex((item) => item.name.toLowerCase() === sku.name.toLowerCase());
    if (index === -1) return;
    skuList[index] = sku;
    setValue('skus', skuList);
  }, []);

  const handleRangeWholesalePriceChange = useCallback((value: RangeWholesalePrice[]) => {
    setValue('skus.0.range_wholesale_price', value);
  }, []);

  const handleProductStatusChange = useCallback((value: boolean) => {
    setValue('skus.0.is_active', value);
  }, []);

  const onSubmit = async (data: PendingProduct) => {
    try {
      if (isLoading) return;
      setIsLoading(true);
      const { sku_attributes, ...newData } = data;
      const errorWholesalePrice = checkInvalidSkusRangeWholesalePrice(newData.skus, t);
      if (errorWholesalePrice) {
        setIsLoading(false);
        return toast.error(errorWholesalePrice);
      }
      const newSkus = [...newData.skus].map((sku) => {
        const { po_details, ...rest } = sku;
        if (sku.sku_type === 'stock') {
          return {
            ...rest,
            po_details: {
              ...po_details,
              pricing: sku.historical_cost,
              quantity: po_details?.quantity ? +po_details.quantity : 0,
              blocked_quantity: po_details?.blocked_quantity || 0,
              warning_value: po_details?.warning_value || 0,
              delivering_quantity: po_details?.delivering_quantity || 0,
            },
          } as PendingSku;
        }
        return {
          ...rest,
          recipe: toPendingRecipe(newData.has_ingredient, sku),
        } as PendingSku;
      });
      console.log(newSkus);
      if (!newData.tag_id) newData.tag_id = ID_EMPTY;
      const uploadedImages = await Promise.all(
        newData.images.map(async (image) => {
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
      const skusWithImages = await Promise.all(
        newSkus.map(async (newSku) => {
          if (!newData.is_variant) return newSku;
          if (newSku?.media && newSku?.media?.[0] && isLocalImage(newSku.media[0])) {
            try {
              const media = await ProductService.uploadProductImage(newSku.media[0]);
              return { ...newSku, media: [media] };
            } catch (error: ExpectedAny) {
              toast.error(error.message);
              return newSku;
            }
          }
          return newSku;
        }),
      );
      const nextProduct = {
        ...newData,
        skus: skusWithImages,
        images: uploadedImages,
      };
      const newListVariant = prepareListVariant(sku_attributes || [], data?.list_variant || []);
      const response = await ProductService.createProduct(
        newListVariant.length > 0 ? { ...nextProduct, list_variant: newListVariant } : nextProduct,
      );
      onSuccess?.(response);
      setIsLoading(false);
      toast.success(t('success.create_product'));
      queryClient.invalidateQueries([PRODUCTS_KEY], { exact: false });
      queryClient.invalidateQueries([POS_PRODUCTS_KEY], { exact: false });
      queryClient.invalidateQueries([SKUS_INVENTORY_KEY], { exact: false });
      syncDataByTypes([SyncType.PRODUCTS]);
      handleClose();
    } catch (error: ExpectedAny) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const onError = (errors: FieldErrors<PendingProduct>) => {
    const is_variant = getValues('is_variant');
    if (!is_variant) {
      const sku = getValues('skus.0');
      if (!getValues('name') || sku.normal_price === 0) {
        activeTab === InfoTabKeyType.RECIPE && setActiveTab(InfoTabKeyType.INFO);
        return;
      }
      if (getValues('has_ingredient') === true && sku.recipe.length === 0) {
        toast.error(t('error.not_setting_ingredients_yet'));
        activeTab === InfoTabKeyType.INFO && setActiveTab(InfoTabKeyType.RECIPE);
      }
      return;
    }
    const skus = getValues('skus');
    for (let index = 0; index < skus.length; index++) {
      const sku = skus[index] as PendingSku;
      const errorSkus = errors.skus;
      if (!errorSkus) break;
      const errorSku = errorSkus?.find?.((_, errorIndex) => index === errorIndex);
      if (errorSku?.normal_price) {
        toast.error(`${t('attribute')} ${sku.name}: ${errorSku?.normal_price?.message || ''}`);
        break;
      }
      if (errorSku?.historical_cost) {
        toast.error(`${t('attribute')} ${sku.name}: ${errorSku?.historical_cost?.message || ''}`);
        break;
      }
      if (errorSku?.po_details?.blocked_quantity) {
        toast.error(`${t('attribute')} ${sku.name}: ${errorSku?.po_details?.blocked_quantity?.message || ''}`);
        break;
      }
      if (errorSku?.po_details?.warning_value) {
        toast.error(`${t('attribute')} ${sku.name}: ${errorSku?.po_details?.warning_value?.message || ''}`);
        break;
      }
      if (errorSku?.recipe) {
        toast.error(t('error.not_setting_ingredients_yet'));
        break;
      }
    }
  };

  const handleClose = () => {
    const data = getValues();
    data.images.forEach((image) => {
      if (isLocalImage(image)) {
        revokeObjectUrl(image.url);
      }
    });
    if (data.is_variant) {
      data.skus.forEach((sku) => {
        if (sku?.media && sku?.media?.[0] && isLocalImage(sku.media[0])) {
          revokeObjectUrl(sku.media[0].url);
        }
      });
    }
    onClose();
  };

  return (
    <SkuDetailProvider>
      <>
        <DrawerHeader title={t('modal-title:create-product')} onClose={handleClose} />
        <FormProvider
          className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
          methods={methods}
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          {has_ingredient && !is_variant && <InfoTabs activeTab={activeTab} setActiveTab={setActiveTab} />}
          <DrawerBody className="pw-bg-gray-100">
            <FormLayout
              formSchema={productFormSchema({
                is_variant,
                is_advance_stock: watch('is_advance_stock', false),
                images: watch('images', []),
                is_active: watch('skus.0.is_active'),
                selectedSku: watch('skus.0'), // product non variant
                has_ingredient,
                activeTab,
                ingredientsLength: ingredients?.data.length || 0,
                currentPackage,
                setActiveTab,
                setValue,
                setOpenUpgrade,
                onRangeWholesalePriceChange: handleRangeWholesalePriceChange,
                onProductStatusChange: handleProductStatusChange,
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
        <VariantDetailDrawer onUpdateSku={handleUpdateSku} has_ingredient={watch('has_ingredient')} />
        {isLoading ? <Loading backdrop={true} vertical={true} className="pw-z-[2000]" /> : null}
        {openUpgrade && (
          <UpgradePackageModal
            description={description}
            onConfirm={() => setOpenUpgrade('')}
            onClose={() => setOpenUpgrade('')}
          />
        )}
      </>
    </SkuDetailProvider>
  );
};
export default ProductsDetails;
