import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { Button } from 'rsuite';
import { BsTrash } from 'react-icons/bs';
import { FieldErrors, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { recipeDetailFormSchema, recipeDetailYubSchema } from './config';
import { defaultRecipeDetail, toPendingRecipe, formatIngredients } from '~app/features/ingredients/recipe/utils';
import { DrawerFooter, DrawerBody, DrawerHeader, ConfirmModal, ImageTextCell } from '~app/components';
import FormProvider from '~app/components/HookForm/FormProvider';
import FormLayout from '~app/components/HookForm/FormLayout';
import { RECIPES_KEY, useRecipeDetailQuery, useGetIngredientsQuery } from '~app/services/queries';
import { queryClient } from '~app/configs/client';
import { useDeleteRecipeMutation, useCreateRecipe } from '~app/services/mutations';
import { TableSku } from '~app/features/ingredients/recipe/components';
import { FormulaPermission, IngredientPermission, useHasPermissions } from '~app/utils/shield';

type Props = { id: string; onSuccess?: () => void; onClose: () => void };

const RecipeUpdate = ({ id, onSuccess, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('recipe-table');
  const canDelete = useHasPermissions([FormulaPermission.FORMULA_DELETE]);
  const canEdit = useHasPermissions([FormulaPermission.FORMULA_UPDATE]);
  const canViewIngredient = useHasPermissions([IngredientPermission.INGREDIENT_LIST_VIEW]);
  const { data: recipeDetail } = useRecipeDetailQuery(id ? id : '');
  const { data: ingredients } = useGetIngredientsQuery({
    page: 1,
    pageSize: 1,
    enabled: canViewIngredient,
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [recipeSelected, setRecipeSelected] = useState<RecipeDetailSku | null>(null);
  const [indexSelected, setIndexSelected] = useState(0);
  const [isChooseSku, setIsChooseSku] = useState<boolean>(false);
  const { mutateAsync } = useDeleteRecipeMutation();
  const { mutateAsync: mutateCreateRecipe } = useCreateRecipe();

  const methods = useForm<RecipeDetail>({
    resolver: yupResolver(recipeDetailYubSchema()),
    defaultValues: defaultRecipeDetail(),
  });
  const { handleSubmit, setValue, watch, reset } = methods;

  useEffect(() => {
    if (!recipeDetail) return;
    if ((recipeDetail.list_sku || []).length === 1) {
      setRecipeSelected(recipeDetail.list_sku?.[0] || null);
    }
    reset(formatIngredients(recipeDetail));
  }, [recipeDetail]);

  const getNameModal = () => {
    if ((recipeDetail?.list_sku || []).length > 1 && recipeSelected) {
      return recipeSelected.name;
    }
    return t('modal-title:recipe-detail');
  };

  const handleChooseSku = (index: number) => {
    setRecipeSelected(recipeDetail?.list_sku?.[index] || null);
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
    if ((recipeDetail?.list_sku || []).length > 1 && recipeSelected) {
      setRecipeSelected(null);
      setIsChooseSku(false);
      return;
    }
    onClose();
  };

  const onSubmit = async (data: ExpectedAny) => {
    try {
      if (!canEdit) return;
      if ((recipeDetail?.list_sku || []).length > 1 && recipeSelected) {
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

  const handleConfirmDelete = async () => {
    try {
      if (!canDelete) return;
      if (recipeDetail) {
        await mutateAsync(id);
        queryClient.invalidateQueries([RECIPES_KEY], { exact: false });
        toast.success(t('success.delete'));
        setOpenConfirm(false);
        onClose();
      }
    } catch (error) {
      // TO DO
    }
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
          {!isChooseSku && (
            <ImageTextCell
              image={recipeDetail?.images?.[0] || ''}
              text={recipeDetail?.name || ''}
              secondText={
                (recipeDetail?.list_sku || []).length > 1
                  ? `${recipeDetail?.list_sku.length} ${t('variant')}`
                  : recipeDetail?.list_sku[0]?.sku_code || ''
              }
              className="pw-px-6 pw-pb-4 pw-mb-6 pw-border-b pw-border-gray-100"
              textClassName="pw-font-bold pw-mb-1"
              secondTextClassName="pw-text-sm pw-text-neutral-secondary"
            />
          )}

          {recipeSelected ? (
            <FormLayout
              formSchema={recipeDetailFormSchema({
                ingredientsLength: ingredients?.data.length || 0,
                selectedSku: watch(`list_sku.${indexSelected}`),
                indexSelected: indexSelected,
                canEdit,
                onRecipeChange: handleChangeRecipe,
              })}
            />
          ) : (
            <TableSku
              listSku={watch('list_sku')}
              ingredientsLength={ingredients?.data.length || 0}
              onChangeIngredients={handleChangeRecipe}
              handleChooseSku={handleChooseSku}
            />
          )}
        </DrawerBody>
        <DrawerFooter className="pw-justify-between">
          {canDelete ? (
            <Button
              appearance="subtle"
              className="!pw-text-error-active !pw-font-bold"
              startIcon={<BsTrash size={24} />}
              onClick={() => setOpenConfirm(true)}
            >
              <span>{t('common:delete')}</span>
            </Button>
          ) : (
            <div />
          )}
          <div className="pw-flex">
            <Button
              appearance="ghost"
              className="!pw-text-neutral-primary !pw-border-neutral-border !pw-font-bold pw-mr-4"
              onClick={handleClose}
            >
              <span>{t('common:cancel')}</span>
            </Button>
            {canEdit && (
              <Button type="submit" appearance="primary" className="!pw-font-bold">
                <span>{t('common:update')}</span>
              </Button>
            )}
          </div>
        </DrawerFooter>
      </FormProvider>
      {openConfirm && (
        <ConfirmModal
          open={openConfirm}
          title={t('delete_recipe')}
          description={t('delete_recipe_description')}
          iconTitle={<BsTrash size={24} />}
          isDelete={true}
          onConfirm={handleConfirmDelete}
          onClose={() => setOpenConfirm(false)}
          cancelText={t('common:back') || ''}
        />
      )}
    </div>
  );
};

export default RecipeUpdate;
