import * as yup from 'yup';
import { v4 } from 'uuid';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { BsInfoCircleFill, BsReceipt } from 'react-icons/bs';
import { MAX_PRICE, MAX_UOM_LENGTH } from '~app/utils/constants';
import { ProductService } from '~app/services/api';
import {
  createTableColumn,
  // getProductMinMaxPrice,
  prepareListVariant,
  toPendingProduct,
  toPendingRecipe,
  toSkusForUpdate,
} from '~app/utils/helpers';
import { ID_EMPTY } from '~app/configs';
import { queryClient } from '~app/configs/client';
import { SyncType } from '~app/features/pos/constants';
import i18n from '~app/i18n/i18n';

export const defaultPoDetail = {
  pricing: 0,
  quantity: 0,
  note: '',
  blocked_quantity: 0,
  warning_value: 0,
  delivering_quantity: 0,
};

export const skuYupSchema = () => {
  const { t } = i18n;
  return yup.object().shape({
    hide_sku: yup.boolean(),
    name: yup.string().when('hide_sku', {
      is: false,
      then: (schema) => schema.required(t('products-form:error.variant_name') || ''),
    }),
    uom: yup.string().max(MAX_UOM_LENGTH, t('products-form:error.max_uom') || ''),
    barcode: yup
      .string()
      .trim()
      .ensure()
      .when({
        is: (val: string) => val.length > 0,
        then: (shema) => shema.matches(/^[0-9]+$/, t('products-form:error.barcode') || ''),
      }),
    normal_price: yup.number().when('hide_sku', {
      is: false,
      then: (schema) =>
        schema
          .min(1, t('products-form:error.min_normal_price') || '')
          .max(MAX_PRICE, t('products-form:error.max_length') || '')
          .typeError(t('products-form:error.type_number') || ''),
    }),
    historical_cost: yup
      .number()
      .nullable()
      .when('sku_type', {
        is: (val: string) => val === 'stock',
        then: (schema) => schema.required(t('common:required_info') || ''),
      }),
    recipe: yup
      .array()
      .test(
        'min-recipe',
        t('products-form:error.not_setting_ingredients_yet') || '',
        (value, context: yup.TestContext) => {
          const contextGeneric = context as unknown as {
            path: string;
            parent: ExpectedAny;
            from: { value: Record<string, unknown> }[];
          };
          // selected sku
          if (contextGeneric?.path === 'recipe') {
            const sku = contextGeneric?.from[0]?.value;
            if (!contextGeneric?.parent?.has_ingredient || sku?.hide_sku) return true;
            return value?.length === 0 ? false : true;
          }
          // skus
          const product = contextGeneric?.from[1]?.value;
          const sku = contextGeneric?.from[0]?.value;
          if (product?.has_ingredient) {
            if (sku?.hide_sku) return true;
            return value?.length === 0 ? false : true;
          }
          return true;
        },
      ),
    selling_price: yup
      .number()
      .test('normal_price', t('products-form:error.selling_price') || '', function Validate(value) {
        const { normal_price } = this.parent;
        const normalPrice = normal_price.toString().replace('.', '');
        if (isNaN(+normalPrice)) return true;
        if (value || value === 0) {
          if (+value <= +normalPrice) return true;
          return false;
        }
        return true;
      })
      .typeError(t('products-form:error.type_number') || ''),
    po_details: yup
      .object()
      .shape({})
      .when('sku_type', {
        is: 'stock',
        then: (schema) =>
          schema.shape({
            blocked_quantity: yup
              .number()
              .test('quantity', t('products-form:error.blocked_quantity') || '', function Validate(value) {
                const { quantity } = this.parent;
                const formatQuantity = quantity.toString().replace('.', '');
                if (isNaN(+formatQuantity)) return true;
                if (value || value === 0) {
                  if (+value <= +formatQuantity) return true;
                  return false;
                }
                return true;
              })
              .typeError(t('products-form:error.type_number') || ''),
            warning_value: yup
              .number()
              .test('quantity', t('products-form:error.warning_value') || '', function Validate(value) {
                const { quantity } = this.parent;
                const formatQuantity = quantity.toString().replace('.', '');
                if (isNaN(+formatQuantity)) return true;
                if (value || value === 0) {
                  if (+value <= +formatQuantity) return true;
                  return false;
                }
                return true;
              }),
          }),
      }),
  });
};

export const createSku = ({ skusLength }: { skusLength?: number }): PendingSku => {
  return {
    id: '',
    name: `Phân loại ${(skusLength && skusLength + 1) || 1}`,
    business_id: '',
    uom: '',
    media: [],
    barcode: '',
    sku_code: '',
    normal_price: 0,
    selling_price: 0,
    historical_cost: null,
    wholesale_price: 0,
    total_quantity: 0,
    is_active: true,
    sku_type: 'non_stock',
    hide_sku: false,
    range_wholesale_price: [],
    po_details: defaultPoDetail,
    recipe: [],
  };
};

export const createProduct = (): PendingProduct => ({
  id: '',
  client_id: v4(),
  name: '',
  description: '',
  description_rtf: '',
  category: [],
  uom: '',
  images: [],
  is_variant: false,
  is_advance_stock: false,
  is_active: true,
  priority: 1,
  sku_code: '',
  barcode: '',
  product_type: 'non_variant',
  skus: [createSku({})],
  tag_id: '',
  product_add_on_group_ids: [],
  show_on_store: true,
  show_price: false,
  has_ingredient: false,
});

export enum InfoTabKeyType {
  INFO = 'info',
  // CHANNEL = 'channel',
  RECIPE = 'recipe',
}

export const tabs = () => {
  const { t } = useTranslation('products-form');

  return {
    [InfoTabKeyType.INFO]: {
      name: t('tabs.info'),
      icon: <BsInfoCircleFill size={18} />,
    },
    // [InfoTabKeyType.CHANNEL]: {
    //   name: t('tabs.channel'),
    //   icon: <BsFileEarmarkTextFill size={18} />,
    // },
    [InfoTabKeyType.RECIPE]: {
      name: t('tabs.recipe'),
      icon: <BsReceipt size={18} />,
    },
  };
};

export const handleUpdateProduct = async (
  productId: string,
  sku: Sku,
  queryKey: ExpectedAny,
  mutateAsync: ExpectedAny,
  syncDataByTypes: ExpectedAny,
  t: ExpectedAny,
  successMessage?: string,
) => {
  try {
    const product = await ProductService.getProduct(productId);
    const pendingProduct = toPendingProduct(product);
    const { sku_attributes, list_variant, ...newData } = pendingProduct;
    if (!newData.tag_id) newData.tag_id = ID_EMPTY;
    const newSkus = newData.skus.map((item) => {
      if (sku.id === item.id) {
        if (item.po_details && item.sku_type === 'stock') {
          return {
            ...item,
            normal_price: sku.normal_price,
            historical_cost: sku.historical_cost,
            is_active: sku.is_active,
            sku_type: sku.sku_type,
            po_details:
              item?.po_details && sku.po_details
                ? { ...item.po_details, quantity: sku.po_details.quantity }
                : item?.po_details,
          };
        } else {
          return {
            ...item,
            normal_price: sku.normal_price,
            historical_cost: sku.historical_cost,
            is_active: sku.is_active,
            sku_type: sku.sku_type,
            po_details: sku.po_details,
          };
        }
      }
      return item;
    });
    const updateSkus = toSkusForUpdate(newSkus, product?.list_sku || []).map((item) => {
      const newSku = { ...item, recipe: toPendingRecipe(product.has_ingredient, item) };
      return newSku;
    }) as PendingSku[];
    const nextProduct = {
      ...newData,
      skus: updateSkus,
    };
    const newListVariant = prepareListVariant(sku_attributes || [], product.list_variant || []);
    await mutateAsync({
      id: productId,
      product: newListVariant.length > 0 ? { ...nextProduct, list_variant: newListVariant } : nextProduct,
    } as ExpectedAny);
    queryClient.invalidateQueries(queryKey, { exact: true });
    syncDataByTypes([SyncType.PRODUCTS]);
    toast.success(t(successMessage ? successMessage : 'products-form:success.update_product'));
    return false;
  } catch (error) {
    return true;
  }
};

export const PRODUCTCOLUMNS: Column[] = [
  createTableColumn('product_code', 'barcode:print_size.barcode'),
  createTableColumn('normal_price', 'products-table:normal_price'),
  createTableColumn('product_image', 'products-form:product_image'),
  createTableColumn('historical_cost', 'products-form:historical_cost'),
  createTableColumn('uom', 'products-table:uom'),
  createTableColumn('can_pick_quantity', 'products-table:can_pick_quantity'),
  createTableColumn('inventory', 'warehouse-table:inventory'),
];
