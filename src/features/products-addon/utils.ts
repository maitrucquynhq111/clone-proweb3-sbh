import * as yup from 'yup';
import { ID_EMPTY } from '~app/configs';
import i18n from '~app/i18n/i18n';
import { MAX_PRODUCT_ADDON_GROUP_NAME } from '~app/utils/constants';

export const defaultProductAddOn: ProductAddOn = {
  historical_cost: 0,
  id: ID_EMPTY,
  is_active: true,
  name: '',
  price: 0,
};

export const defaultProductAddOnGroup: PendingProductAddOnGroup = {
  id: ID_EMPTY,
  name: '',
  is_multiple_items: false,
  is_multiple_options: false,
  is_required: false,
  list_product_add_on: [],
  product_ids_add: [],
  product_ids_remove: [],
  linked_products: [],
};

export const productAddOnYupSchema = () => {
  const { t } = i18n;
  return yup.object().shape({
    name: yup.string().required(t('product-addon-form:error.addon_name') || ''),
    // historical_cost: yup
    //   .number()
    //   .test(
    //     'price',
    //     t('products-form:error.historical_cost') || '',
    //     function Validate(value) {
    //       let { price } = this.parent;
    //       price = price.toString().replace('.', '');
    //       if (isNaN(+price)) return true;
    //       if (value || value === 0) {
    //         if (+value <= +price) return true;
    //         return false;
    //       }
    //       return true;
    //     }
    //   ),
  });
};

export const productAddOnGroupYupSchema = () => {
  const { t } = i18n;
  return yup.object().shape({
    name: yup
      .string()
      .max(MAX_PRODUCT_ADDON_GROUP_NAME, t('product-addon-form:error.max_addon_group_name') || '')
      .required(t('common:required_info') || ''),
    list_product_add_on: yup
      .array(productAddOnYupSchema())
      .min(1, t('product-addon-form:error.at_least_one_addon') || ''),
  });
};

export const toPendingProductAddOnGroup = (data: AddOnGroupDetail) => {
  return {
    id: data.id,
    name: data.name,
    is_required: data.is_required,
    is_multiple_items: data.is_multiple_items,
    is_multiple_options: data.is_multiple_options,
    list_product_add_on: data.list_product_add_on,
    product_ids_add: [],
    product_ids_remove: [],
    linked_products: [],
  } as PendingProductAddOnGroup;
};

export const toPendingLinkedProductsAddOn = (data: LinkedProductsAddOn) => {
  const params = {
    id: data.id,
    product_id: data.id,
    product_name: data.product_name,
    is_product_add_on: data.is_product_add_on,
    images: data.images,
    product_type: data.product_type,
    business_id: data.business_id,
    count_variant: data.count_variant,
  } as PendingLinkedProductsAddOn;
  if (data.product_type === 'variant') {
    params.min_price = data.min_price;
    params.max_price = data.max_price;
    params.count_variant = data.count_variant;
  } else {
    params.normal_price = data?.normal_price || 0;
    params.selling_price = data?.selling_price || 0;
  }
  return params;
};
