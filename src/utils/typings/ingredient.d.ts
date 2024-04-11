type Recipe = {
  id: string;
  name: string;
  count_variant: number;
  min_historical_cost: number;
  max_historical_cost: number;
  sku_code: string;
  images: Array<string>;
};

type RecipeDetail = {
  id: string;
  name: string;
  images: string[];
  product_type: string;
  list_sku: RecipeDetailSku[];
};

type BodyRecipe = {
  recipe: {
    sku_has_ingredients: SkuHasIngredient[];
    sku_id: string;
  }[];
};

type ProductRecipe = {
  id: string;
  name: string;
  images: string[];
  product_code: string;
  product_type: string;
  count_variant: number;
  has_recipe: boolean;
  list_sku: SkuRecipe[];
};

type RecipeDetailSku = {
  id: string;
  name: string;
  historical_cost: number;
  media: string[];
  product_id: string;
  sku_code: string;
  recipe: RecipeSkuDetail[];
};

type RecipeSkuDetail = RecipeSku & { uom: Uom };

type SkuHasIngredient = {
  ingredient_id: string;
  quantity: number;
  uom_id: string;
};

type SkuRecipe = {
  id: string;
  name: string;
  historical_cost: number;
  sku_code: string;
  media: string[];
  product_id: string;
};

type ProductRecipePending = {
  id: string;
  name: string;
  images: string[];
  product_code: string;
  product_type: string;
  count_variant: number;
  has_recipe: boolean;
  list_sku: (SkuRecipe & { recipe: RecipeSkuDetail[] })[];
};
