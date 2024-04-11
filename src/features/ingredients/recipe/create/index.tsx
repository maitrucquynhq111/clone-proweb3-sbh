import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useState, useCallback, useEffect } from 'react';
import { Button } from 'rsuite';
import { FieldErrors, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { recipeDetailFormSchema, recipeDetailYubSchema } from './config';
import { defaultRecipeDetail, toPendingRecipe, toPendingProductRecipe } from '~app/features/ingredients/recipe/utils';
import { DrawerFooter, DrawerBody, DrawerHeader, ImageTextCell } from '~app/components';
import FormProvider from '~app/components/HookForm/FormProvider';
import FormLayout from '~app/components/HookForm/FormLayout';
import { RECIPES_KEY, useGetIngredientsQuery } from '~app/services/queries';
import { queryClient } from '~app/configs/client';
import { useCreateRecipe } from '~app/services/mutations';
import { EmptyProduct, ProductSelection, TableSku } from '~app/features/ingredients/recipe/components';

type Props = { id: string; onSuccess?: () => void; onClose: () => void };

const RecipeUpdate = ({ onSuccess, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('recipe-table');
  const { data: ingredients } = useGetIngredientsQuery({
    page: 1,
    pageSize: 1,
  });
  const [productSelected, setProductSelected] = useState<ExpectedAny | null>(null);
  const [recipeSelected, setRecipeSelected] = useState<(SkuRecipe & { recipe: RecipeSkuDetail[] }) | null>(null);
  const [indexSelected, setIndexSelected] = useState(0);
  const [isChooseSku, setIsChooseSku] = useState<boolean>(false);
  const { mutateAsync: mutateCreateRecipe } = useCreateRecipe();

  const methods = useForm<RecipeDetail>({
    resolver: yupResolver(recipeDetailYubSchema()),
    defaultValues: defaultRecipeDetail(),
  });
  const { handleSubmit, setValue, watch, reset } = methods;
  console.log(watch());
  useEffect(() => {
    if (!productSelected) return;
    if ((productSelected.list_sku || []).length === 1) {
      setRecipeSelected({ ...productSelected.list_sku?.[0], recipe: [] } || null);
    }
    reset(toPendingProductRecipe(productSelected));
  }, [productSelected]);

  const getNameModal = () => {
    if ((productSelected?.list_sku || []).length > 1 && recipeSelected) {
      return recipeSelected.name;
    }
    return t('modal-title:create-recipe');
  };

  const handleChooseProduct = useCallback((data: ProductRecipe) => {
    setProductSelected(data);
    setRecipeSelected(null);
    setIsChooseSku(false);
  }, []);

  const handleChooseSku = (index: number) => {
    setRecipeSelected({ ...productSelected?.list_sku?.[index], recipe: [] } || null);
    setIndexSelected(index);
    setIsChooseSku(true);
  };

  const handleChangeRecipe = (index: number, value: ExpectedAny) => {
    setValue(
      `list_sku.${index}.recipe`,
      value.map((item: ExpectedAny) => ({ ...item, name: item.name || item.ingredient_name })),
    );
  };

  const handleClose = () => {
    if ((productSelected?.list_sku || []).length > 1 && recipeSelected) {
      setRecipeSelected(null);
      setIsChooseSku(false);
      return;
    }
    onClose();
  };

  const onSubmit = async (data: ExpectedAny) => {
    try {
      if (!productSelected) return toast.error(t('have_not_selected_product_for_recipe'));

      if ((productSelected?.list_sku || []).length > 1 && recipeSelected) {
        setRecipeSelected(null);
        setIsChooseSku(false);
        return;
      }
      const body = toPendingRecipe(data);
      await mutateCreateRecipe(body);
      handleClose();
      onSuccess?.();
      queryClient.invalidateQueries([RECIPES_KEY], { exact: false });
      toast.success(t('success.update'));
    } catch (_) {
      // TO DO
    }
  };

  const onError = (errors: FieldErrors<RecipeDetail>) => {
    const invalid = ((Array.isArray(errors?.list_sku) && errors.list_sku) || []).some((sku) => sku?.recipe?.message);
    if (invalid) return toast.error(t('products-form:error.not_setting_ingredients_yet') || '');
  };

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <DrawerHeader title={getNameModal()} onClose={handleClose} />
        <DrawerBody className="pw-bg-white pw-px-0">
          {!isChooseSku && productSelected ? (
            <div className="pw-flex pw-px-6 pw-pb-4 pw-mb-6 pw-border-b pw-border-gray-100">
              <ImageTextCell
                image={productSelected?.images?.[0] || ''}
                text={productSelected?.name || ''}
                secondText={
                  (productSelected?.list_sku || []).length > 1
                    ? `${productSelected?.list_sku.length} ${t('variant')}`
                    : productSelected?.list_sku[0]?.sku_code || ''
                }
                className=""
                textClassName="pw-font-bold pw-mb-1"
                secondTextClassName="pw-text-sm pw-text-neutral-secondary"
              />
              <ProductSelection idSelected={productSelected?.id} onChange={handleChooseProduct} childrenType="icon" />
            </div>
          ) : !isChooseSku && !productSelected ? (
            <EmptyProduct idSelected={productSelected?.id} onChange={handleChooseProduct} />
          ) : null}

          {productSelected && recipeSelected ? (
            <FormLayout
              formSchema={recipeDetailFormSchema({
                ingredientsLength: ingredients?.data.length || 0,
                selectedSku: watch(`list_sku.${indexSelected}`),
                indexSelected: indexSelected,
                onRecipeChange: handleChangeRecipe,
              })}
            />
          ) : productSelected && !recipeSelected ? (
            <TableSku
              listSku={watch('list_sku')}
              ingredientsLength={ingredients?.data.length || 0}
              onChangeIngredients={handleChangeRecipe}
              handleChooseSku={handleChooseSku}
            />
          ) : null}
        </DrawerBody>
        <DrawerFooter className="pw-justify-end">
          <div className="pw-flex">
            <Button
              appearance="ghost"
              className="!pw-text-neutral-primary !pw-border-neutral-border !pw-font-bold pw-mr-4"
              onClick={handleClose}
            >
              <span>{t('common:cancel')}</span>
            </Button>
            <Button type="submit" appearance="primary" className="!pw-font-bold">
              <span>{t('common:modal-confirm')}</span>
            </Button>
          </div>
        </DrawerFooter>
      </FormProvider>
    </div>
  );
};

export default RecipeUpdate;
