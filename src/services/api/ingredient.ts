import qs from 'qs';
import AuthService from './auth';
import { API_URI } from '~app/configs';
import { fetchAll, post, fetchData } from '~app/utils/helpers';

//RECIPE
async function getRecipes({ search, page, pageSize }: CommonParams) {
  const business_id = await AuthService.getBusinessId();
  return await fetchAll<{
    data: Array<Recipe>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-product/api/v1/sku-has-ingredient/get-list?${qs.stringify({
      business_id,
      page: page,
      page_size: pageSize,
      search,
    })}`,
    {
      authorization: true,
    },
  );
}

async function deleteRecipe(id: string) {
  return await fetchData(`${API_URI}/finan-product/api/v1/sku-has-ingredient/delete/${id}`, {
    method: 'DELETE',
    authorization: true,
  });
}

async function deleteMultiRecipe(product_ids: string[]) {
  return await fetchData(`${API_URI}/finan-product/api/v1/sku-has-ingredient/delete-multi`, {
    body: JSON.stringify({ product_ids }),
    method: 'DELETE',
    authorization: true,
  });
}

async function getRecipeDetail(product_id: string) {
  const business_id = await AuthService.getBusinessId();
  return await fetchData<RecipeDetail>(
    `${API_URI}/finan-product/api/v1/sku-has-ingredient/get-one-by-product?${qs.stringify({
      business_id,
      product_id,
    })}`,
    {
      authorization: true,
    },
  );
}

async function createRecipe(data: BodyRecipe) {
  const business_id = (await AuthService.getBusinessId()) || '';

  return await post(
    `${API_URI}/finan-product/api/v1/sku-has-ingredient/create`,
    {
      business_id,
      ...data,
    },
    { authorization: true },
  );
}

async function getProductsRecipe({ search, page, pageSize }: CommonParams) {
  return await fetchAll<{
    data: Array<ProductRecipe>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-product/api/v1/product/get-list-ingredient?${qs.stringify({
      page: page,
      page_size: pageSize,
      search,
    })}`,
    {
      authorization: true,
    },
  );
}

const IngredientService = {
  getRecipes,
  deleteRecipe,
  deleteMultiRecipe,
  getRecipeDetail,
  createRecipe,
  getProductsRecipe,
};

export default IngredientService;
