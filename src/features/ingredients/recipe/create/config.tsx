import * as yup from 'yup';
import { EmptyRecipeProduct, IngredientsTable } from '~app/features/products/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { FormSchema } from '~app/components';
import i18n from '~app/i18n/i18n';

export const recipeDetailFormSchema = ({
  selectedSku,
  indexSelected,
  ingredientsLength,
  onRecipeChange,
}: {
  selectedSku: RecipeDetailSku;
  indexSelected: number;
  ingredientsLength: number;
  onRecipeChange(index: number, value: ExpectedAny): void;
}): FormSchema => {
  const handleChangeRecipe = (value: ExpectedAny) => {
    onRecipeChange(indexSelected, value);
  };

  return {
    className: 'pw-px-6',
    type: 'container',
    name: 'form',
    children: [
      {
        className: '',
        name: 'first-col',
        type: 'block-container',
        children: [
          (selectedSku.recipe || []).length === 0
            ? {
                type: ComponentType.Custom,
                name: 'recipeEmpty',
                selectedSku,
                ingredientsLength,
                onChange: handleChangeRecipe,
                component: EmptyRecipeProduct,
              }
            : {
                type: ComponentType.Custom,
                name: 'recipe',
                selectedSku,
                onChange: handleChangeRecipe,
                component: IngredientsTable,
              },
        ],
      },
    ],
  };
};

export const recipeDetailYubSchema = () => {
  const { t } = i18n;
  return yup.object().shape({
    list_sku: yup.array(
      yup.object().shape({
        recipe: yup.array().min(1, t('products-form:error.not_setting_ingredients_yet') || ''),
      }),
    ),
  });
};
