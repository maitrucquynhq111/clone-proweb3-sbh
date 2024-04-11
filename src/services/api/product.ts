import qs from 'qs';
import AuthService from './auth';
import MediaService from './media';
import { API_URI, ID_EMPTY, DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '~app/configs';
import { deleteMethod, fetchAll, fetchData, isInStock, post, put } from '~app/utils/helpers';

async function getProducts({
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  sort = '',
  name = '',
  category_ids = [],
}: {
  page?: number;
  pageSize?: number;
  sort?: string;
  name?: string;
  category_ids?: string[];
}) {
  const business_id = await AuthService.getBusinessId();
  return fetchAll<{ data: Product[]; meta: ResponseMeta }>(
    `${API_URI}/finan-product/api/v1/product/online/get-list?${qs.stringify({
      business_id,
      page: page,
      page_size: pageSize,
      sort: sort,
      name: name,
      category_ids: category_ids.join(','),
    })}`,
    {
      authorization: true,
    },
  );
}

async function getProductsByIds({
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  ids = [],
}: {
  page?: number;
  pageSize?: number;
  ids?: string[];
}) {
  const business_id = await AuthService.getBusinessId();
  return fetchAll<{ data: Product[]; meta: ResponseMeta }>(
    `${API_URI}/finan-product/api/v2/product/seller/get-list?${qs.stringify({
      business_id,
      page: page,
      page_size: pageSize,
      ids: ids.join(','),
    })}`,
    {
      authorization: true,
    },
  );
}

async function getPosProducts({
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  sort = '',
  name = '',
  category_ids = [],
}: {
  page?: number;
  pageSize?: number;
  sort?: string;
  name?: string;
  category_ids?: string[];
}) {
  const business_id = await AuthService.getBusinessId();
  return fetchAll<{ data: Product[]; meta: ResponseMeta }>(
    `${API_URI}/finan-product/api/v2/product/seller/get-list?${qs.stringify({
      business_id,
      page: page,
      page_size: pageSize,
      sort: sort,
      name: name,
      category_ids: category_ids.join(','),
    })}`,
    {
      authorization: true,
    },
  );
}

async function getProduct(id: string) {
  const product = await fetchData<Product>(`${API_URI}/finan-product/api/v2/product/seller/get-detail/${id}`, {
    authorization: true,
  });
  return product;
}

async function updateSoldOut(products: PendingSoldOut[]) {
  return await post(`${API_URI}/finan-product/api/v1/sku/update-sold-out`, products, {
    authorization: true,
  });
}

async function getCategories({
  page = DEFAULT_PAGE,
  page_size = DEFAULT_PAGE_SIZE,
  name = '',
}: {
  page?: number;
  page_size?: number;
  name?: string;
}) {
  const business_id = await AuthService.getBusinessId();
  return fetchAll<{ data: Category[]; meta: ResponseMeta }>(
    `${API_URI}/finan-product/api/v2/category/seller/get-list?${qs.stringify({
      business_id,
      page: page,
      page_size,
      name: name,
    })}`,
    {
      authorization: true,
    },
  );
}

async function createCategory(data: PendingProductCategory) {
  const business_id = await AuthService.getBusinessId();
  return await post<Category>(
    `${API_URI}/finan-product/api/v1/category/create`,
    { ...data, business_id },
    {
      authorization: true,
    },
  );
}

async function updateProduct(id: string, product: PendingProduct) {
  const business_id = (await AuthService.getBusinessId()) || '';

  return await put<JSONRecord<Product>>(
    `${API_URI}/finan-product/api/v3/product/update/${id}`,
    {
      business_id,
      ...prepareBackendProduct(product, business_id),
      category_ids: product.category,
    },
    { authorization: true },
  );
}

async function createProduct(product: PendingProduct) {
  const business_id = (await AuthService.getBusinessId()) || '';

  return await post<Product>(
    `${API_URI}/finan-product/api/v1/product/create`,
    {
      business_id,
      ...prepareBackendProduct(product, business_id),
    },
    {
      authorization: true,
    },
  );
}

async function updateSku({ id, sku }: { id: string; sku: PendingSkuInventory }) {
  return await put<PendingSkuInventory>(`${API_URI}/finan-product/api/v2/sku/update/${id}`, sku, {
    authorization: true,
  });
}

export async function addProductToCategory({
  product_ids,
  category_ids,
}: {
  product_ids: Array<string>;
  category_ids: Array<string>;
}) {
  const business_id = await AuthService.getBusinessId();
  return await post(
    `${API_URI}/finan-product/api/v1/cat-has-prd/create`,
    {
      category_id: category_ids,
      ids: product_ids,
      business_id,
      type: 'product',
    },
    {
      authorization: true,
    },
  );
}

async function deleteProduct(id: string) {
  return await fetchData(`${API_URI}/finan-product/api/v1/product/delete/${id}`, {
    method: 'DELETE',
    authorization: true,
  });
}

async function deleteMultiProduct(body: { data: string[]; user_id: string }) {
  return await deleteMethod(
    `${API_URI}/finan-product/api/v1/product/delete-multi`,
    { ...body },
    { authorization: true },
  );
}

async function uploadProductImage(image: PendingUploadImage) {
  const media_type: string | undefined = /\/([^$]+$)/.exec(image.type)?.[1];
  const content = image.content;
  const uploadParams = {
    name: image.name,
    media_type: media_type || '',
  };
  const uploadLink = await MediaService.createUploadLink(uploadParams);
  await MediaService.upload(uploadLink, {
    mime_type: image.type,
    content,
  });
  const { upload_url } = await MediaService.commitUploadLink(uploadParams);
  return upload_url;
}

async function getMassUploads({ page, pageSize, upload_type }: CommonParams & { upload_type?: string }) {
  return fetchData<Array<MassUpload>>(
    `${API_URI}/finan-mass-upload/api/v1/mass-upload/get-list?${qs.stringify({
      page: page,
      page_size: pageSize,
      sort: 'created_at desc',
      upload_type,
    })}`,
    {
      authorization: true,
    },
  );
}

async function getMassUploadsFailed({ page, pageSize, id }: CommonParams & { id: string }) {
  return fetchAll<{ data: MassUploadFailed[]; meta: ResponseMeta }>(
    `${API_URI}/finan-mass-upload/api/v1/detail-fail/get-list?${qs.stringify({
      page: page,
      page_size: pageSize,
      mass_upload_id: id,
      sort: 'row asc',
    })}`,
    {
      authorization: true,
    },
  );
}

async function cancelMassUpload({ name }: { name: string }) {
  return await put(
    `${API_URI}/finan-mass-upload/api/v1/mass-upload/cancel`,
    {
      name,
      status: 'cancel',
    },
    { authorization: true },
  );
}

async function commitMassUpload(body: CommitMassUploadBody) {
  return await post<{ data: string }>(`${API_URI}/finan-product/api/v1/mass-upload/create`, body, {
    authorization: true,
  });
}

async function uploadProductFile(file: { name: string; mime_type: string; content: ArrayBuffer }) {
  const { file_name, file_name_origin, link } = await MediaService.createMassUploadLink({
    media_type: 'excel',
    name: file.name,
  });
  await MediaService.upload(link, {
    mime_type: file.mime_type,
    content: file.content,
  });

  const { upload_url } = await MediaService.commitUploadLink({
    media_type: 'excel',
    name: file_name,
  });

  const result = await commitMassUpload({
    file_name,
    file_name_origin,
    status: 'start',
    link: upload_url,
    type: 'excel',
  });

  return result;
}

async function uploadIngredientsFile(file: { name: string; mime_type: string; content: ArrayBuffer }) {
  const { file_name, file_name_origin, link } = await MediaService.createMassUploadLink({
    media_type: 'excel',
    name: file.name,
  });
  await MediaService.upload(link, {
    mime_type: file.mime_type,
    content: file.content,
  });

  const { upload_url } = await MediaService.commitUploadLink({
    media_type: 'excel',
    name: file_name,
  });

  const result = await commitMassUploadIngredients({
    file_name,
    file_name_origin,
    status: 'start',
    link: upload_url,
    type: 'excel',
  });

  return result;
}

async function getSkusInventory({
  search,
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  sort = 'updated_at desc',
  category_ids = [],
}: {
  search: string;
  page: number;
  pageSize?: number;
  sort?: string;
  category_ids?: string[];
}) {
  const business_id = await AuthService.getBusinessId();
  return fetchAll<{ data: SkuInventory[]; meta: ResponseMeta }>(
    `${API_URI}/finan-product/api/v1/product/get-all-product-in-stock?${qs.stringify({
      business_id,
      page: page,
      page_size: pageSize,
      search,
      sort,
      category_ids: category_ids.join(','),
    })}`,
    {
      authorization: true,
    },
  );
}

async function exportData(options: { start_time?: string; end_time?: string; search?: string }) {
  const { start_time = '2020-04-05T17:00:00.000Z', end_time = '2080-04-05T17:23:59.000Z', search } = options || {};

  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<string>(
    `${API_URI}/finan-report/api/v1/export-product`,
    {
      business_id,
      start_time,
      end_time,
      search,
    },
    { authorization: true },
  );
}

async function exportStock({
  start_time,
  end_time,
  search,
}: {
  start_time?: string;
  end_time?: string;
  search?: string;
}) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<string>(
    `${API_URI}/finan-report/api/v1/export-stock`,
    {
      business_id,
      start_time: start_time || '2020-04-05T17:00:00.000Z',
      end_time: end_time || '2080-04-05T17:23:59.000Z',
      search,
    },
    { authorization: true },
  );
}

//ADDON
async function getAddOnGroups({ search, page, pageSize }: CommonParams & { search: string }) {
  const business_id = await AuthService.getBusinessId();
  return await fetchAll<{
    data: Array<AddOnGroup>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-product/api/v1/product-add-on-group/get-list?${qs.stringify({
      business_id,
      page: page,
      page_size: pageSize,
      sort: 'priority desc',
      search,
    })}`,
    {
      authorization: true,
    },
  );
}

async function getAddOnGroupDetail(id: string) {
  return fetchData<AddOnGroupDetail>(`${API_URI}/finan-product/api/v1/product-add-on-group/get-detail/${id}`, {
    authorization: true,
  });
}

async function createAddOnGroup(data: PendingAddOnGroup) {
  const business_id = (await AuthService.getBusinessId()) || '';

  return await post(
    `${API_URI}/finan-product/api/v1/product-add-on-group/create`,
    {
      business_id,
      ...data,
    },
    { authorization: true },
  );
}

async function updateAddOnGroup(data: PendingAddOnGroup) {
  const business_id = (await AuthService.getBusinessId()) || '';

  return await put(
    `${API_URI}/finan-product/api/v1/product-add-on-group/update/${data.id}`,
    {
      business_id,
      ...data,
    },
    { authorization: true },
  );
}

async function deleteAddOnGroup(id: string) {
  return await fetchData(`${API_URI}/finan-product/api/v1/product-add-on-group/delete/${id}`, {
    method: 'DELETE',
    authorization: true,
  });
}

async function getLinkedProductsAddOnGroup({
  search,
  page,
  pageSize,
  id,
}: CommonParams & { search: string; id: string }) {
  const business_id = await AuthService.getBusinessId();
  return await fetchAll<{
    data: Array<LinkedProductsAddOn>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-product/api/v1/product-in-product-add-on-group?${qs.stringify({
      business_id,
      page: page,
      page_size: pageSize,
      search,
      product_add_on_group_id: id,
    })}`,
    {
      authorization: true,
    },
  );
}

async function getAddOns({ search, page, pageSize }: CommonParams & { search: string }) {
  const business_id = await AuthService.getBusinessId();
  return await fetchAll<{
    data: Array<AddOn>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-product/api/v1/product-add-on/get-list?${qs.stringify({
      business_id,
      page: page + 1,
      page_size: pageSize,
      sort: 'priority desc',
      name: search,
    })}`,
    {
      authorization: true,
    },
  );
}

//LABELS
async function getLabels() {
  const business_id = await AuthService.getBusinessId();
  const { data } = await fetchData<{ data: LabelProduct[] }>(
    `${API_URI}/finan-product/api/v1/tag/get-list?${qs.stringify({
      business_id,
      page: 0,
      page_size: 10,
      sort: 'created_at desc',
    })}`,
    {
      authorization: true,
    },
  );
  return data || [];
}

async function updateLabel(id: string, label: PendingLabelProduct) {
  const business_id = (await AuthService.getBusinessId()) || '';

  return await put(
    `${API_URI}/finan-product/api/v1/tag/update/${id}`,
    {
      business_id,
      ...label,
    },
    { authorization: true },
  );
}

async function createLabel(label: PendingLabelProduct) {
  const business_id = (await AuthService.getBusinessId()) || '';

  return await post<JSONRecord<PendingLabelProduct>>(
    `${API_URI}/finan-product/api/v1/tag/create`,
    {
      business_id,
      position: 0,
      priority: 0,
      ...label,
    },
    {
      authorization: true,
    },
  );
}

async function deleteLabel(id: string) {
  return await fetchData(`${API_URI}/finan-product/api/v1/tag/delete/${id}`, {
    method: 'DELETE',
    authorization: true,
  });
}

//INGREDIENTS
async function getIngredients({ name, page, pageSize, sort }: CommonParams) {
  const business_id = await AuthService.getBusinessId();
  return await fetchAll<{
    data: Array<Ingredient>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-product/api/v1/ingredient/get-list?${qs.stringify({
      business_id,
      page,
      page_size: pageSize,
      sort: sort || 'updated_at desc',
      name,
    })}`,
    {
      authorization: true,
    },
  );
}

async function commitMassUploadIngredients(body: CommitMassUploadBody) {
  return await post<{ data: string }>(`${API_URI}/finan-product/api/v1/mass-upload/create-ingredients`, body, {
    authorization: true,
  });
}

async function createIngredient(data: PendingIngredient) {
  const business_id = (await AuthService.getBusinessId()) || '';

  return await post<Ingredient>(
    `${API_URI}/finan-product/api/v1/ingredient/create`,
    {
      business_id,
      ...data,
    },
    { authorization: true },
  );
}

async function updateIngredient(data: PendingIngredient) {
  const business_id = (await AuthService.getBusinessId()) || '';

  return await put<Ingredient>(
    `${API_URI}/finan-product/api/v1/ingredient/update/${data.id}`,
    {
      business_id,
      ...data,
    },
    { authorization: true },
  );
}

async function deleteIngredient(id: string) {
  return await fetchData(`${API_URI}/finan-product/api/v1/ingredient/delete/${id}`, {
    method: 'DELETE',
    authorization: true,
  });
}

//UOM
async function getUoms({ name, page, pageSize }: CommonParams) {
  const business_id = await AuthService.getBusinessId();
  return await fetchAll<{
    data: Array<Uom>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-product/api/v1/uom/get-list?${qs.stringify({
      business_id,
      page,
      page_size: pageSize,
      name,
    })}`,
    {
      authorization: true,
    },
  );
}

async function createUom(name: string) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<Uom>(
    `${API_URI}/finan-product/api/v1/uom/create`,
    {
      business_id,
      name,
    },
    { authorization: true },
  );
}

const ProductService = {
  createProduct,
  deleteProduct,
  deleteMultiProduct,
  updateProduct,
  updateSku,
  addProductToCategory,
  getProducts,
  getProductsByIds,
  getPosProducts,
  getProduct,
  updateSoldOut,
  getCategories,
  createCategory,
  uploadProductImage,
  uploadProductFile,
  commitMassUpload,
  getMassUploads,
  getMassUploadsFailed,
  cancelMassUpload,
  getSkusInventory,
  exportData,
  exportStock,
  getAddOnGroups,
  getAddOnGroupDetail,
  createAddOnGroup,
  updateAddOnGroup,
  deleteAddOnGroup,
  getLinkedProductsAddOnGroup,
  getAddOns,
  getLabels,
  updateLabel,
  createLabel,
  deleteLabel,
  getIngredients,
  uploadIngredientsFile,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  getUoms,
  createUom,
};

export function prepareBackendProduct(
  { skus, is_advance_stock, is_variant, id: _omitId, category, list_variant, ...others }: PendingProduct,
  business_id: string,
) {
  const isVariant = list_variant && list_variant.length > 0 ? true : false;
  const is_active = isInStock(isVariant, skus);
  const data = {
    ...others,
    is_active,
    category_ids: category,
    product_type: isVariant ? 'variant' : 'non_variant',
    list_sku: skus.map(({ id, client_id: _client_id, ...others }, index) => {
      if (others.sku_type === 'non_stock') delete others.po_details;
      return {
        ...(id
          ? { id, ...others, business_id }
          : {
              id: ID_EMPTY,
              ...others,
              product_id: null,
              business_id,
            }),
        priority: index + 1,
        attribute_types: is_variant ? others.attribute_types : [],
        number_attribute_type: 0,
        ...(!is_variant ? { barcode: others.barcode, sku_code: others.sku_code } : {}),
      };
    }),
  };
  return list_variant ? { ...data, list_variant: list_variant } : data;
}

export default ProductService;
