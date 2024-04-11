import { useCallback, useMemo, useState } from 'react';
import { getOrderItemCanPickQuantity } from '~app/features/pos/utils';

export function skuHasAttribute(list_attribute: Array<{ attribute_id: string }>, attribute_id: string) {
  return list_attribute.some((attr) => attr.attribute_id === attribute_id);
}

export function variantHasAttribute(list_attribute: Array<{ id: string }>, attribute_id: string) {
  return list_attribute.some((attr) => attr.id === attribute_id);
}

export const useProductVariant = (
  variants: ProductVariant[],
  product: Pick<Product, 'id' | 'list_sku'>,
  orderItems: PendingOrderItem[],
  orderItemId?: string,
) => {
  const [selectedAttributes, setSelectedAttributes] = useState<Array<string>>([]);

  const selectedVariants = useMemo(() => {
    return variants.filter((variant) =>
      selectedAttributes.some((attr_id) => variantHasAttribute(variant.list_attribute, attr_id)),
    );
  }, [variants, selectedAttributes]);

  const selectedSku = useMemo(() => {
    const newSku = product.list_sku.find((sku) =>
      selectedAttributes.every((attr_id) => skuHasAttribute(sku.list_attribute, attr_id)),
    );

    if (variants.length === 0) return null;

    if (selectedVariants.length === variants.length && newSku) {
      return newSku;
    }

    return null;
  }, [product.list_sku, variants, selectedVariants, selectedAttributes]);

  const inititalInvalidAttributes = useMemo(() => {
    const attributes = variants
      .map((variant) => variant.list_attribute)
      .flat()
      .map((item) => item.id);
    return attributes.filter((attr_id) => {
      const skus = product.list_sku.filter((sku) => skuHasAttribute(sku.list_attribute, attr_id));
      return skus.every((sku) =>
        sku.sku_type === 'stock'
          ? getOrderItemCanPickQuantity(
              sku.id,
              sku.sku_type === 'stock' ? sku.can_pick_quantity : Infinity,
              orderItems,
              orderItemId,
            ) <= 0
          : sku.is_active === false,
      );
    });
  }, [product.list_sku, variants, orderItems, orderItemId]);

  const addOrRemoveAttribute = useCallback(
    (attribute: string) => {
      setSelectedAttributes((prevState) => {
        let result: string[] = [...prevState];
        const existedIndex = result.indexOf(attribute);
        // Existed variant
        const selectedVariant = variants.find((variant) => variantHasAttribute(variant.list_attribute, attribute));
        if (selectedVariant) {
          result = result.filter((item) => !variantHasAttribute(selectedVariant.list_attribute, item));
          if (existedIndex === -1) {
            result.push(attribute);
            return result;
          }
          return result.filter((item) => item !== attribute);
        }
        // Not existed variant
        if (existedIndex === -1) {
          result.push(attribute);
          return result;
        }
        return result.filter((item) => item !== attribute);
      });
    },
    [variants],
  );

  const filteredSkusExcludeVariant = useCallback(
    (variant: ProductVariant) => {
      const otherVariants = variants.filter((v) => v.key !== variant.key);
      const otherSelectedAttributes = selectedAttributes.filter((id) =>
        otherVariants.some((variant) => variantHasAttribute(variant.list_attribute, id)),
      );
      const skusByOtherSelectedAttributes = product.list_sku.filter((sku) =>
        otherSelectedAttributes.every((id) => skuHasAttribute(sku.list_attribute, id)),
      );
      return skusByOtherSelectedAttributes;
    },
    [product.list_sku, selectedAttributes, variants],
  );

  return {
    selectedSku,
    selectedAttributes,
    inititalInvalidAttributes,
    setSelectedAttributes,
    addOrRemoveAttribute,
    filteredSkusExcludeVariant,
  };
};
