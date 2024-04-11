import { v4 } from 'uuid';
import { createSku } from '~app/features/products/utils';
import { convertStringToObjectKey, formatCurrency } from '~app/utils/helpers/stringHelpers';
import { ID_EMPTY, numberFormat } from '~app/configs';
import { sortArrayByKey } from '~app/utils/helpers/arrayHelpers';
import i18n from '~app/i18n/i18n';

export function checkWholesalePrice(position: number, rangeWholesalePrice: RangeWholesalePrice[], sku: PendingSku) {
  let error = {};
  const low = rangeWholesalePrice.slice(0, position);
  const item = rangeWholesalePrice[position];
  if (!item) return error;
  // Check valid price
  if (position === 0 && item.price >= sku.normal_price) {
    error = {
      ...error,
      price: 'error.equal_normal_price',
    };
  }
  if (position === 0 && item.price <= 0) {
    error = {
      ...error,
      price: 'error.price_greater_than_zero',
    };
  }
  if (position === 0 && item.min_quantity <= 0) {
    error = {
      ...error,
      min_quantity: 'error.min_quantity_greater_than_zero',
    };
  }
  // Check valid for lower position
  for (let index = 0; index < low.length; index++) {
    const currentItem = low[index];
    if (!currentItem) break;
    if (item.price <= 0) {
      error = {
        ...error,
        price: 'error.price_greater_than_zero',
        error_name: '',
      };
    }
    if (item.min_quantity <= 0) {
      error = {
        ...error,
        min_quantity: 'error.min_quantity_greater_than_zero',
        error_name: '',
      };
    }
    if (item.min_quantity <= currentItem.min_quantity) {
      error = {
        ...error,
        min_quantity: 'error.greater_quantity',
        error_name: currentItem.name,
      };
    }
    if (item.price >= currentItem.price) {
      error = {
        ...error,
        price: 'error.greater_price',
        error_name: currentItem.name,
      };
    }
  }
  return error;
}

export function checkRangeWholesalePrice(
  sku: PendingSku,
  rangeWholesalePrice: RangeWholesalePrice[],
): RangeWholesalePrice[] {
  const result = rangeWholesalePrice.map((item, index) => {
    const { error, ...rest } = item;
    const newError = checkWholesalePrice(index, rangeWholesalePrice, sku);
    if (Object.keys(newError).length === 0) {
      return { ...rest };
    }
    return { ...item, error: newError };
  });
  return result;
}

export function checkInvalidSkusRangeWholesalePrice(skus: PendingSku[], t: ExpectedAny): string {
  let result = '';
  skus.forEach((sku) => {
    const rangeWholesalePrice = checkRangeWholesalePrice(sku, sku?.range_wholesale_price || []);
    const invalidWholesalePrice = rangeWholesalePrice.find((item) => item.error);
    if (invalidWholesalePrice?.error) {
      const quantityError = invalidWholesalePrice.error?.min_quantity || '';
      const priceError = invalidWholesalePrice.error?.price || '';
      result = `${invalidWholesalePrice.name}: ${t(quantityError || priceError)} ${
        invalidWholesalePrice?.error?.error_name ? invalidWholesalePrice?.error?.error_name : ''
      }`;
      return;
    }
  });
  return result;
}

export function checkInValidSkuAttributes(sku_attributes: PendingSkuAttribute[]) {
  if (sku_attributes.length === 0) return true;

  return sku_attributes.every((sku_attribute) => !sku_attribute.attribute_type || sku_attribute.attribute.length === 0);
}

export function createSkusFromAttributes(
  sku_attributes: PendingSkuAttribute[],
  skus: PendingSku[],
  is_advance_stock: boolean,
) {
  const result = [] as PendingSku[];
  const first_attribute = sku_attributes[0]?.attribute;
  const second_attribute = sku_attributes[1]?.attribute;
  /* Creating a new array of objects based on the sku_attributes array. */
  if (sku_attributes.length === 1) {
    const attribute_type = sku_attributes[0]?.attribute_type;
    const attribute = sku_attributes[0]?.attribute;
    if (!attribute_type || !attribute) return result;
    attribute.forEach((item) => {
      let newSku = null;
      const sku_name = `${item}`;
      const existedSku = skus.find((sku) => sku.name === sku_name);
      if (existedSku) {
        newSku = {
          ...existedSku,
          historical_cost: existedSku.historical_cost ? existedSku.historical_cost : 0,
          sku_type: is_advance_stock ? 'stock' : existedSku.sku_type,
          attribute_types: [{ attribute: item, attribute_type }],
        } as PendingSku;
      } else {
        newSku = {
          ...createSku({}),
          name: sku_name,
          normal_price: skus[skus.length - 1]?.normal_price || 0,
          historical_cost: skus[skus.length - 1]?.historical_cost || 0,
          sku_type: is_advance_stock ? 'stock' : 'non_stock',
          attribute_types: [{ attribute: item, attribute_type }],
          recipe: [],
        } as PendingSku;
        if (skus[skus.length - 1]?.po_details && is_advance_stock) {
          newSku.po_details = skus[skus.length - 1]?.po_details;
        }
      }
      result.push(newSku);
    });
  }
  /* Creating a new sku for each attribute in the second attribute type. */
  if (sku_attributes.length === 2 && first_attribute && first_attribute.length === 0) {
    const attribute_type = sku_attributes[1]?.attribute_type;
    const attribute = sku_attributes[1]?.attribute;
    if (!attribute_type || !attribute) return result;
    attribute.forEach((item) => {
      let newSku = null;
      const sku_name = `${item}`;
      const existedSku = skus.find((sku) => sku.name === sku_name);
      if (existedSku) {
        newSku = {
          ...existedSku,
          historical_cost: existedSku.historical_cost ? existedSku.historical_cost : 0,
          sku_type: is_advance_stock ? 'stock' : existedSku.sku_type,
          attribute_types: [{ attribute: item, attribute_type }],
          recipe: [],
        } as PendingSku;
      } else {
        newSku = {
          ...createSku({}),
          name: sku_name,
          normal_price: skus[skus.length - 1]?.normal_price || 0,
          historical_cost: skus[skus.length - 1]?.historical_cost || 0,
          sku_type: is_advance_stock ? 'stock' : 'non_stock',
          attribute_types: [{ attribute: item, attribute_type }],
        } as PendingSku;
        if (skus[skus.length - 1]?.po_details && is_advance_stock) {
          newSku.po_details = skus[skus.length - 1]?.po_details;
        }
      }
      result.push(newSku);
    });
  }
  /* Creating a new sku for each attribute in the first attribute type. */
  if (sku_attributes.length === 2 && second_attribute && second_attribute.length === 0) {
    const attribute_type = sku_attributes[0]?.attribute_type;
    const attribute = sku_attributes[0]?.attribute;
    if (!attribute_type || !attribute) return result;
    attribute.forEach((item) => {
      let newSku = null;
      const sku_name = `${item}`;
      const existedSku = skus.find((sku) => sku.name === sku_name);
      if (existedSku) {
        newSku = {
          ...existedSku,
          historical_cost: existedSku.historical_cost ? existedSku.historical_cost : 0,
          sku_type: is_advance_stock ? 'stock' : existedSku.sku_type,
          attribute_types: [{ attribute: item, attribute_type }],
        } as PendingSku;
      } else {
        newSku = {
          ...createSku({}),
          name: sku_name,
          normal_price: skus[skus.length - 1]?.normal_price || 0,
          historical_cost: skus[skus.length - 1]?.historical_cost || 0,
          sku_type: is_advance_stock ? 'stock' : 'non_stock',
          attribute_types: [{ attribute: item, attribute_type }],
          recipe: [],
        } as PendingSku;
        if (skus[skus.length - 1]?.po_details && is_advance_stock) {
          newSku.po_details = skus[skus.length - 1]?.po_details;
        }
      }
      result.push(newSku);
    });
  }
  /* Creating a new sku for each combination of the two attributes. */
  if (sku_attributes.length === 2) {
    const first_attribute = sku_attributes[0]?.attribute;
    const first_attribute_type = sku_attributes[0]?.attribute_type;
    const second_attribute = sku_attributes[1]?.attribute;
    const second_attribute_type = sku_attributes[1]?.attribute_type;
    if (!first_attribute || !second_attribute) {
      return skus;
    }
    for (let i = 0; i < first_attribute.length; i++) {
      for (let j = 0; j < second_attribute.length; j++) {
        let newSku = null;
        const sku_name = `${first_attribute[i]} - ${second_attribute[j]}`;
        const existedSku = skus.find((sku) => sku.name === sku_name);
        const attribute_types = [
          {
            attribute: first_attribute[i],
            attribute_type: first_attribute_type,
          },
          {
            attribute: second_attribute[j],
            attribute_type: second_attribute_type,
          },
        ];
        if (existedSku) {
          newSku = {
            ...existedSku,
            historical_cost: existedSku.historical_cost ? existedSku.historical_cost : 0,
            sku_type: is_advance_stock ? 'stock' : existedSku.sku_type,

            attribute_types,
          } as PendingSku;
        } else {
          newSku = {
            ...createSku({}),
            name: sku_name,
            normal_price: skus[skus.length - 1]?.normal_price || 0,
            historical_cost: skus[skus.length - 1]?.historical_cost || 0,
            sku_type: is_advance_stock ? 'stock' : 'non_stock',
            attribute_types,
            recipe: [],
          } as PendingSku;
        }
        result.push(newSku);
      }
    }
  }
  return result;
}

export function checkUniqueAttributeType(sku_attributes: PendingSkuAttribute[]) {
  const uniqueArray = Array.from(
    new Set(sku_attributes.map(({ attribute_type }) => attribute_type.trim().toLowerCase())),
  );
  const isUnique = sku_attributes.length === uniqueArray.length;
  if (isUnique) return true;
  return false;
}

export function createTableDataFromSkus(skus: PendingSku[]): SkuTableData[] {
  return skus.map((sku) => {
    const attribute_types = sku.attribute_types?.reduce((prev, cur) => {
      const key = convertStringToObjectKey(cur.attribute_type);
      return { ...prev, [key]: cur.attribute };
    }, {});
    const hide_sku = skus.length === 1 ? false : sku.hide_sku;
    return {
      ...sku,
      ...attribute_types,
      hide_sku,
      historical_cost: hide_sku ? null : sku?.historical_cost,
      is_active: hide_sku ? null : sku.is_active,
      quantity: hide_sku ? null : sku?.po_details?.quantity,
      recipe: hide_sku ? null : sku?.recipe,
    };
  }) as SkuTableData[];
}

export function getCanPickQuantity({ quantity = 0, blocked_quantity = 0, delivering_quantity = 0 }: PoDetail): number {
  return quantity - blocked_quantity - delivering_quantity;
}

export function getRangePrice(product: Product) {
  if (product.product_type === 'non_variant') {
    return product.list_sku[0] ? numberFormat.format(getFinalPrice(product.list_sku[0])) : 0;
  }
  return product.min_price === product.max_price
    ? numberFormat.format(product.min_price)
    : `${numberFormat.format(product.min_price)} - ${numberFormat.format(product.max_price)}`;
}

export function getRangeHistoricalCost(product: Product) {
  if (product.product_type === 'non_variant') {
    const sku = product.list_sku[0];
    return sku?.historical_cost ? numberFormat.format(sku.historical_cost) : '';
  }
  const historicalLostList = product.list_sku.map((item) => item.historical_cost || 0);
  const minValue = Math.min(...historicalLostList);
  const maxValue = Math.max(...historicalLostList);
  return minValue === maxValue
    ? numberFormat.format(minValue)
    : `${numberFormat.format(minValue)} - ${numberFormat.format(maxValue)}`;
}

export function getMultiUom(product: Product) {
  if (product.product_type === 'non_variant') {
    return product.uom;
  }
  return product.list_sku.reduce((string, sku) => (string += sku.uom && ` ${string ? ', ' : ''}${sku.uom}`), '');
}

export function getFinalPrice({ normal_price, selling_price }: Pick<Sku, 'normal_price' | 'selling_price'>): number {
  return selling_price || normal_price;
}

export function getCanPickQuantityProduct(product: Product, sku?: Sku) {
  if (product.has_ingredient) return 'apply_recipe';
  if (product.product_type === 'non_variant') {
    if (product.list_sku[0]?.sku_type === 'stock') {
      return product.list_sku[0]?.can_pick_quantity;
    }
    return product.is_active;
  }
  const isStock = product.list_sku.some((sku) => sku.sku_type === 'stock');
  if (isStock) {
    const canPick = product.list_sku.reduce(
      (acc, curr) => (curr.sku_type === 'stock' ? acc + curr.can_pick_quantity : acc),
      0,
    );
    if (canPick === 0) {
      return product.list_sku.some((sku) => sku.sku_type === 'non_stock' && sku.is_active);
    }
    return canPick;
  }
  return sku ? sku?.is_active : product.list_sku.some((sku) => sku.is_active);
}

export function isProductAllStock(list_sku: Sku[]) {
  return list_sku.every((sku) => sku.sku_type === 'stock');
}

export function getCanPickQuantitySku(sku: Sku) {
  if (sku.sku_type === 'stock') {
    return sku.can_pick_quantity;
  }
  return sku.is_active;
}

function toPendingRangeWholesalePrice(rangeWholesalePrice: RangeWholesalePrice[]) {
  const { t } = i18n;
  return rangeWholesalePrice.map((item, index) => ({
    ...item,
    name: `${t('products-form:wholesale')} ${index + 1}`,
  }));
}

export function toPendingProduct(product: Omit<Product, 'updated_at' | 'deleted_at' | 'created_at'>): PendingProduct {
  const { t } = i18n;
  const skus = product.product_type.match(/non_variant/)
    ? product.list_sku.map(
        (sku) =>
          ({
            ...sku,
            name: `${t('products-form:attribute')} 1`,
            historical_cost: sku?.historical_cost ? sku.historical_cost : null,
            hide_sku: false,
            range_wholesale_price: sku?.range_wholesale_price
              ? toPendingRangeWholesalePrice(sku.range_wholesale_price)
              : [],
            recipe:
              ((sku?.recipe as ExpectedAny) || []).map((ingredient: ExpectedAny) => ({
                ...ingredient,
                name: ingredient.ingredient_name,
              })) || [],
          } as PendingSku),
      )
    : product.list_sku.map(
        (sku) =>
          ({
            ...sku,
            hide_sku: sku.hide_sku,
            range_wholesale_price: sku?.range_wholesale_price
              ? toPendingRangeWholesalePrice(sku.range_wholesale_price)
              : [],
            recipe:
              ((sku?.recipe as ExpectedAny) || []).map((ingredient: ExpectedAny) => ({
                ...ingredient,
                name: ingredient.ingredient_name,
              })) || [],
          } as PendingSku),
      );
  const is_advance_stock = isProductAllStock(product.list_sku);
  const is_variant = !product.product_type.match(/non_variant/);
  const category = product?.category ? product.category.map((item) => item.id) : [];
  const sku_attributes = product?.list_variant
    ? (sortArrayByKey(product.list_variant, 'priority').map((variant) => {
        const attribute = (variant?.list_attribute || []).map((attribute) => attribute?.name || '');
        return {
          attribute,
          id: variant?.id || v4(),
          attribute_type: variant.name,
        };
      }) as PendingSkuAttribute[])
    : ([] as PendingSkuAttribute[]);
  const list_variant = product?.list_variant
    ? product.list_variant.map((variant) => {
        const list_attribute: PendingProductAttribute[] = variant?.list_attribute?.map((attribute) => ({
          name: attribute?.name,
          id: attribute?.id,
        }));
        return {
          id: variant?.id,
          name: variant?.name,
          list_attribute: list_attribute,
        } as PendingProductVariant;
      })
    : [];
  return {
    id: product.id,
    client_id: product.client_id,
    name: product.name,
    category,
    uom: product.uom,
    is_active: product.is_active,
    priority: product.priority,
    description: product.description,
    description_rtf: product.description_rtf,
    product_type: product.product_type,
    show_on_store: product.show_on_store,
    show_price: product.show_price,
    is_advance_stock,
    is_variant,
    skus,
    sku_attributes,
    sku_code: '',
    barcode: '',
    images: product?.images || [],
    tag_id: product?.tag_info?.id || '',
    product_add_on_group_ids: product?.list_product_add_on_group?.map((group) => group.id) || [],
    list_variant: list_variant,
    has_ingredient: product.has_ingredient || false,
  };
}

export function toPendingSku(sku: Sku): PendingSku {
  return {
    ...sku,
    range_wholesale_price: sku?.range_wholesale_price ? toPendingRangeWholesalePrice(sku.range_wholesale_price) : [],
    recipe:
      ((sku?.recipe as ExpectedAny) || []).map((ingredient: ExpectedAny) => ({
        ...ingredient,
        name: ingredient.ingredient_name,
      })) || [],
  };
}

export function toSkusForUpdate(pendingSkus: PendingSku[], skus: Sku[]): PendingSku[] {
  const result = pendingSkus.map((pendingSku) => {
    const { po_details, ...rest } = pendingSku;
    // New sku
    if (!pendingSku.id) {
      if (pendingSku.sku_type === 'stock' && po_details) {
        return {
          ...rest,
          id: ID_EMPTY,
          name: pendingSku.name.trim(),
          po_details: {
            ...po_details,
            pricing: pendingSku.historical_cost || 0,
            quantity: po_details?.quantity ? +po_details.quantity : 0,
            blocked_quantity: po_details?.blocked_quantity || 0,
            warning_value: po_details?.warning_value || 0,
            delivering_quantity: po_details?.delivering_quantity || 0,
          },
        };
      }
      return {
        ...rest,
        id: ID_EMPTY,
        name: pendingSku.name.trim(),
      };
    }
    // Old sku and sku_type === stock
    if (pendingSku.id && po_details) {
      const existedSku = skus.find((sku) => sku.id === pendingSku.id);
      const isStock = existedSku && pendingSku.sku_type === 'stock';
      const existedQuantity = existedSku?.po_details?.quantity ? +existedSku.po_details.quantity : 0;
      if (isStock && +po_details.quantity === existedQuantity) {
        return {
          ...rest,
          po_details: {
            ...po_details,
            pricing: pendingSku.historical_cost || 0,
            quantity: 0,
            sku_id: pendingSku.id,
          },
        };
      }
      if (isStock && +po_details.quantity !== existedQuantity) {
        return {
          ...rest,
          po_details: {
            ...po_details,
            pricing: pendingSku.historical_cost || 0,
            quantity: +po_details.quantity - existedQuantity,
            sku_id: pendingSku.id,
          },
        };
      }
    }
    return { ...rest };
  });
  return result;
}

export function isInStock(is_variant: boolean, skus: PendingSku[]) {
  if (is_variant) {
    const allInStock = skus.some((sku) => {
      if (sku.sku_type === 'non_stock') return sku.is_active;
      if (sku.po_details && sku.sku_type === 'stock') {
        return sku.po_details?.quantity > 0 ? true : false;
      }
      return false;
    });
    return allInStock;
  }
  if (!skus[0]) return false;
  if (skus[0].sku_type === 'non_stock') {
    return skus[0].is_active;
  }
  return skus[0].po_details && skus[0]?.po_details?.quantity > 0 ? true : false;
}

export function isProductAddon(product: Product) {
  return product?.list_product_add_on_group && product.list_product_add_on_group.length > 0;
}

export function isProductVariant(product: Product) {
  return !product.product_type.match(/non_variant/);
}

export function isOneLevelProductVariant(product: Product) {
  if (isProductVariant(product) && product?.list_variant && product.list_variant.length === 1) return true;
  return false;
}

export function isTwoLevelProductVariant(product: Product) {
  if (isProductVariant(product) && product?.list_variant && product.list_variant.length === 2) return true;
  return false;
}

export function prepareListVariant(skuAttributes: PendingSkuAttribute[], listVariant: PendingProductVariant[]) {
  return skuAttributes.map((skuAttribute) => {
    const existedVariant = listVariant.find((variant) => variant.id === skuAttribute.id);
    if (existedVariant) {
      const list_attribute = skuAttribute.attribute.map((item) => {
        const existedAttribute = existedVariant.list_attribute.find((attribute) => attribute.name === item);
        if (existedAttribute)
          return {
            id: existedAttribute.id,
            name: existedAttribute.name,
          } as PendingProductAttribute;
        return {
          name: item,
        } as PendingProductAttribute;
      });
      return {
        id: existedVariant.id,
        name: skuAttribute.attribute_type,
        list_attribute: list_attribute,
      } as PendingProductVariant;
    }
    return {
      name: skuAttribute.attribute_type,
      list_attribute: skuAttribute.attribute.map((item) => ({
        name: item,
      })),
    } as PendingProductVariant;
  });
}

export function getProductImage(product: Product) {
  return product.images?.[0] || product.list_sku.find((sku) => sku.media && sku.media.length > 0)?.media?.[0] || '';
}

export function renderIngredientsPricePerProduct(data: ExpectedAny) {
  if (data.length === 0) return 0;
  const price = data.reduce((acc: number, curr: ExpectedAny) => {
    if (curr.uom_id !== curr.uom.id) {
      return acc + (curr.price * curr.quantity) / curr.uom.sub_uom.factor;
    }
    return acc + curr.price * curr.quantity;
  }, 0);
  return formatCurrency(price);
}

export function toPendingRecipe(has_ingredient: boolean, sku: PendingSku) {
  if (!has_ingredient) return [];
  return sku.recipe.map((ingredient) => ({
    ingredient_id: ingredient?.ingredient_id || ingredient.id,
    quantity: ingredient.quantity,
    uom_id: ingredient.uom_id,
  }));
}

export const numberOfItemsPurchaseOrder = ({
  items,
  ingredients,
}: {
  items: ExpectedAny;
  ingredients: ExpectedAny;
}) => {
  const skuItems = (items || []).reduce((acc: ExpectedAny, curr: ExpectedAny) => acc + curr.quantity, 0);
  const ingredientItems = (ingredients || []).reduce((acc: ExpectedAny, curr: ExpectedAny) => acc + curr.quantity, 0);
  return {
    totalItems: skuItems + ingredientItems,
    skuItems,
    ingredientItems,
  };
};

export function getProductMinMaxPrice(list_sku: Sku[]) {
  const priceRange = list_sku.map((item) => {
    if (item.selling_price) return item.selling_price;
    return item.normal_price;
  });
  const minPrice = Math.min(...priceRange);
  const maxPrice = Math.max(...priceRange);
  return { minPrice, maxPrice };
}

export function isStockProduct(list_sku: Sku[]) {
  return list_sku.some((sku) => sku.sku_type === 'stock');
}

export function getTotalProductStock(list_sku: Sku[]) {
  return list_sku.reduce((prev, cur) => {
    if (cur.sku_type === 'non_stock') return prev + 0;
    return prev + cur.po_details.quantity;
  }, 0);
}
