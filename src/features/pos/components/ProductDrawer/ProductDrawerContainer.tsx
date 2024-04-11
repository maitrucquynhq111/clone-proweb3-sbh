import { memo } from 'react';
import ProductVariantAddonDrawer from './ProductVariantAddonDrawer';
import ProductCartDrawer from './ProductCartDrawer';
import ProductSingleAddon from './ProductSingleAddon';
import { ProductDrawerType } from '~app/features/pos/constants';
import { SelectedAddons, usePosStore } from '~app/features/pos/hooks';
import ProductVariantDrawer from '~app/features/pos/components/ProductVariantDrawer';

const ProductDrawerContainer = () => {
  const [store] = usePosStore((store) => store);
  return (
    <>
      {store.selected_drawer === ProductDrawerType.VARIANT_ADDON_DRAWER && store.selected_product ? (
        <SelectedAddons>
          <ProductVariantAddonDrawer
            product={store.selected_product}
            orderItemId={store.selected_order_item}
            isEditedAddon={store.is_edited_addon}
          />
        </SelectedAddons>
      ) : null}
      {store.selected_drawer === ProductDrawerType.SINGLE_ADDON && store.selected_product ? (
        <SelectedAddons>
          <ProductSingleAddon
            product={store.selected_product}
            orderItemId={store.selected_order_item}
            isEditedAddon={store.is_edited_addon}
          />
        </SelectedAddons>
      ) : null}
      {store.selected_drawer === ProductDrawerType.CART_DRAWER && store.selected_product ? (
        <ProductCartDrawer product={store.selected_product} />
      ) : null}
      {store.selected_drawer === ProductDrawerType.VARIANT_DRAWER && store.selected_product ? (
        <ProductVariantDrawer product={store.selected_product} />
      ) : null}
    </>
  );
};

export default memo(ProductDrawerContainer);
