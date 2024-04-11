import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useForm, FieldErrors } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { BsTrash } from 'react-icons/bs';
import { productFormSchema, productYupSchema } from './config';
import FormProvider from '~app/components/HookForm/FormProvider';
import { InfoTabKeyType, createProduct } from '~app/features/products/utils';
import FormLayout from '~app/components/HookForm/FormLayout';
import { DrawerHeader, DrawerBody, DrawerFooter, Loading, ModalRefObject, UpgradePackageModal } from '~app/components';
import { useProductDetailQuery, PRODUCTS_KEY, PRODUCT_DETAIL_KEY, useGetIngredientsQuery } from '~app/services/queries';
import { queryClient } from '~app/configs/client';

import {
  checkInvalidSkusRangeWholesalePrice,
  isDeepEqual,
  isLocalImage,
  prepareListVariant,
  revokeObjectUrl,
  toPendingProduct,
  toPendingRecipe,
  toSkusForUpdate,
} from '~app/utils/helpers';
import { useHasPermissions, ProductPermission, IngredientPermission } from '~app/utils/shield';
import { SkuDetailProvider, useSkuDetail } from '~app/utils/hooks/useSkuDetail';
import VariantDetailDrawer from '~app/features/products/components/Variant/VariantDetailDrawer';
import { ID_EMPTY } from '~app/configs';
import { ProductService } from '~app/services/api';
import { useUpdateProductMutation } from '~app/services/mutations/useUpdateProductMutation';
import ModalConfirm from '~app/components/ActionMenu/ModalConfirm';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { SyncType } from '~app/features/pos/constants';
import { InfoTabs } from '~app/features/products/components';
import { usePackage } from '~app/utils/shield/usePackage';
import { useDeleteProductMutation } from '~app/services/mutations';

const ProductsDetails = ({ onClose }: { onClose: () => void }): JSX.Element => {
  const { syncDataByTypes } = useOfflineContext();
  const { t } = useTranslation(['products-form', 'modal-title', 'common']);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') as string;
  const sku_id = searchParams.get('sku_id') as string;
  const { data: productDetail, isLoading, isError } = useProductDetailQuery(id ? id : '');
  const { mutateAsync } = useUpdateProductMutation();
  const { mutateAsync: deleteProduct } = useDeleteProductMutation();
  const { setSelectedSku, setOpen } = useSkuDetail();
  const confirmModalRef = useRef<ModalRefObject>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<InfoTabKeyType>(InfoTabKeyType.INFO);
  const [openUpgrade, setOpenUpgrade] = useState(false);
  const canUpdate = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_UPDATE]);
  const canViewIngredient = useHasPermissions([IngredientPermission.INGREDIENT_LIST_VIEW]);
  const { currentPackage, description } = usePackage([], 'product_count_picture');

  const methods = useForm<PendingProduct>({
    mode: 'all',
    resolver: yupResolver(productYupSchema()),
    defaultValues: { ...createProduct(), sku_attributes: [] },
  });

  const { handleSubmit, watch, setValue, reset, getValues } = methods;
  const is_variant = watch('is_variant');
  const has_ingredient = watch('has_ingredient');
  const { data: ingredients } = useGetIngredientsQuery({
    page: 1,
    pageSize: 1,
    enabled: canViewIngredient && has_ingredient,
  });

  const handleRangeWholesalePriceChange = useCallback((value: RangeWholesalePrice[]) => {
    setValue('skus.0.range_wholesale_price', value);
  }, []);

  const handleProductStatusChange = useCallback((value: boolean) => {
    setValue('skus.0.is_active', value);
  }, []);

  const handleUpdateSku = useCallback((sku: PendingSku) => {
    const skuList = [...getValues('skus')] as PendingSku[];
    const index = skuList.findIndex((item) => item.name.toLowerCase() === sku.name.toLowerCase());
    if (index === -1) return;
    skuList[index] = sku;
    setValue('skus', skuList);
  }, []);

  const handleDelete = async () => {
    try {
      await deleteProduct(id);
      toast.success(t('success.delete_product'));
      queryClient.invalidateQueries([PRODUCTS_KEY], { exact: false });
      syncDataByTypes([SyncType.PRODUCTS]);
      handleClose();
    } catch (error) {
      //
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

  const handleOpenModalConfirm = () => {
    if (!productDetail) return;
    const data = getValues();
    if (isDeepEqual(data, toPendingProduct(productDetail)) === false) {
      const confirmModalData = {
        title: '',
        modalTitle: t('common:exit_without_save'),
        modalContent: t('common:ensure_to_perform'),
        acceptText: t('common:modal-confirm-accept-btn'),
        cancelText: t('common:modal-confirm-refuse-btn'),
        action: () => {
          handleClose();
        },
      };
      confirmModalRef.current?.handleOpen(confirmModalData);
    } else {
      handleClose();
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

  const onSubmit = async (data: PendingProduct) => {
    try {
      if (isSubmitting || !canUpdate) return;
      setIsSubmitting(true);
      const { sku_attributes, list_variant, ...newData } = data;
      const errorWholesalePrice = checkInvalidSkusRangeWholesalePrice(newData.skus, t);
      if (errorWholesalePrice) {
        setIsSubmitting(false);
        return toast.error(errorWholesalePrice);
      }
      const updateSkus = toSkusForUpdate(newData.skus, productDetail?.list_sku || []);
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
      const skusWithImages = (await Promise.all(
        updateSkus.map(async (sku) => {
          const newSku = { ...sku, recipe: toPendingRecipe(data.has_ingredient, sku) };
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
      )) as PendingSku[];
      const nextProduct = {
        ...newData,
        skus: skusWithImages,
        images: uploadedImages,
      };
      const newListVariant = prepareListVariant(sku_attributes || [], data.list_variant || []);

      await mutateAsync({
        id,
        product: newListVariant.length > 0 ? { ...nextProduct, list_variant: newListVariant } : nextProduct,
      } as ExpectedAny);
      setIsSubmitting(false);
      toast.success(t('success.update_product'));
      queryClient.invalidateQueries([PRODUCTS_KEY], { exact: false });
      queryClient.invalidateQueries([PRODUCT_DETAIL_KEY, id], { exact: true });
      syncDataByTypes([SyncType.PRODUCTS]);
      handleClose();
    } catch (error: ExpectedAny) {
      setIsSubmitting(false);
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

  useEffect(() => {
    if (!productDetail) return;
    const pendingProduct = toPendingProduct(productDetail);
    reset(pendingProduct);
  }, [productDetail]);

  useEffect(() => {
    if (!productDetail || !sku_id) return;
    const pendingProduct = toPendingProduct(productDetail);
    const sku = pendingProduct.skus.find((item) => item.id === sku_id);
    if (!sku) return;
    setSelectedSku(sku);
    setOpen(true);
  }, [sku_id, productDetail, setSelectedSku, setOpen]);

  useEffect(() => {
    if (isError) {
      onClose();
    }
  }, [isError]);

  return (
    <>
      <DrawerHeader title={t('modal-title:update-product')} onClose={handleOpenModalConfirm} />
      <FormProvider
        methods={methods}
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        {canViewIngredient && has_ingredient && !is_variant && (
          <InfoTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
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
        <DrawerFooter className="pw-justify-between">
          <Button appearance="subtle" onClick={handleOpenDeleteConfirm} type="button" className="!pw-flex pw-gap-x-2">
            <BsTrash className="pw-w-6 pw-h-6 pw-fill-red-600" />
            <span className="pw-text-red-600 pw-text-base pw-font-bold">{t('common:delete')}</span>
          </Button>
          <div className="pw-flex">
            <Button onClick={handleOpenModalConfirm} className="pw-button-secondary !pw-py-2 !pw-px-5 pw-mr-2">
              <span className="pw-text-base pw-font-bold pw-text-neutral-primary">{t('common:cancel')}</span>
            </Button>
            {canUpdate && (
              <Button type="submit" className="pw-button-primary !pw-py-2 !pw-px-5">
                <span className="pw-text-base pw-font-bold pw-text-neutral-white"> {t('action.create_product')}</span>
              </Button>
            )}
          </div>
        </DrawerFooter>
      </FormProvider>
      <VariantDetailDrawer onUpdateSku={handleUpdateSku} has_ingredient={watch('has_ingredient')} />
      {isLoading || isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-[2000]" /> : null}
      <ModalConfirm ref={confirmModalRef} backdropClassName="!pw-z-[1050]" />
      {openUpgrade && (
        <UpgradePackageModal
          description={description}
          onConfirm={() => setOpenUpgrade(false)}
          onClose={() => setOpenUpgrade(false)}
        />
      )}
    </>
  );
};

const ProductDetailsWrapper = ({ onClose }: { onClose: () => void }) => {
  return (
    <SkuDetailProvider>
      <ProductsDetails onClose={onClose} />
    </SkuDetailProvider>
  );
};

export default ProductDetailsWrapper;
