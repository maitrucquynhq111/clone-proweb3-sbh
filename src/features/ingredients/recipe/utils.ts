export const defaultRecipeDetail = (): RecipeDetail => {
  return {
    id: '',
    name: '',
    images: [],
    product_type: '',
    list_sku: [{ id: '', name: '', historical_cost: 0, media: [], product_id: '', sku_code: '', recipe: [] }],
  };
};

export const toPendingRecipe = (data: RecipeDetail): BodyRecipe => {
  const { list_sku } = data;
  return {
    recipe: list_sku.map((item) => ({
      sku_has_ingredients: item.recipe.map((ingredient) => ({
        ingredient_id: ingredient.ingredient_id || ingredient.id,
        quantity: ingredient.quantity,
        uom_id: ingredient.uom_id,
      })),
      sku_id: item.id,
    })),
  };
};

export const formatIngredients = (data: RecipeDetail) => {
  return {
    ...data,
    list_sku: (data?.list_sku || []).map((sku) => ({
      ...sku,
      recipe: (sku?.recipe || []).map((ingredient) => ({
        ...ingredient,
        name: ingredient.ingredient_name,
      })),
    })),
  };
};

export const toPendingProductRecipe = (data: ProductRecipe) => {
  return {
    ...data,
    list_sku: data.list_sku.map((sku) => ({ ...sku, recipe: [] })),
  };
};
