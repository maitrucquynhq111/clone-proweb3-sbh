import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPlus } from 'react-icons/bs';
import { useClickAway } from 'react-use';
import { Drawer } from 'rsuite';
import { DrawerBody, DrawerHeader, PlaceholderImage } from '~app/components';
import { OrderCartItem } from '~app/features/pos/components';
import { ProductDrawerType } from '~app/features/pos/constants';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import { getOrderItemCanPickQuantity } from '~app/features/pos/utils';
import { ModalPlacement, ModalSize } from '~app/modals';
import { isProductVariant } from '~app/utils/helpers';

type Props = {
  product: Product;
};

const ProductCartDrawer = ({ product }: Props) => {
  const { t } = useTranslation('pos');
  const ref = useRef<HTMLDivElement | null>(null);
  const [drawer, setPosStore] = usePosStore((store) => store.selected_drawer);
  const [orderItems] = useSelectedOrderStore((store) => store.list_order_item);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState('');

  useClickAway(ref, () => {
    setSelectedOrderItemId('');
  });

  const selectedOrderItems = useMemo(
    () => orderItems.filter((item) => item.product_id === product.id),
    [product, orderItems],
  );

  const handleClose = () => {
    setPosStore((store) => ({ ...store, selected_drawer: null, selected_product: null }));
  };

  const handleOpen = (id: string) => {
    if (isProductVariant(product)) {
      return setPosStore((store) => ({
        ...store,
        selected_product: product,
        selected_drawer: ProductDrawerType.VARIANT_ADDON_DRAWER,
        selected_order_item: id,
      }));
    } else {
      return setPosStore((store) => ({
        ...store,
        selected_product: product,
        selected_drawer: ProductDrawerType.SINGLE_ADDON,
        selected_order_item: id,
      }));
    }
  };

  const handleOpenSelectOther = () => {
    if (isProductVariant(product)) {
      return setPosStore((store) => ({
        ...store,
        selected_product: product,
        selected_drawer: ProductDrawerType.VARIANT_ADDON_DRAWER,
        selected_order_item: '',
      }));
    } else {
      return setPosStore((store) => ({
        ...store,
        selected_product: product,
        selected_drawer: ProductDrawerType.SINGLE_ADDON,
        selected_order_item: '',
      }));
    }
  };

  useEffect(() => {
    if (selectedOrderItems.length === 0) {
      setPosStore((store) => ({
        ...store,
        selected_product: null,
        selected_drawer: null,
        selected_order_item: '',
      }));
    }
  }, [selectedOrderItems]);
  return (
    <Drawer
      backdrop="static"
      keyboard={false}
      placement={ModalPlacement.Right}
      size={ModalSize.Small}
      open={drawer === ProductDrawerType.CART_DRAWER}
      className="pw-h-screen"
    >
      <div className="pw-flex pw-flex-col !pw-h-screen pw-bg-neutral-background">
        <DrawerHeader title={t('action.add_to_cart') || ''} onClose={handleClose} />
        <DrawerBody className="pw-flex-1 pw-flex pw-flex-col pw-overflow-auto !pw-p-0 scrollbar-sm">
          <div className="pw-flex pw-py-4 pw-px-6 pw-bg-white pw-gap-x-3 pw-items-center pw-mb-1">
            <PlaceholderImage
              src={product?.images?.[0]}
              className="!pw-w-18 !pw-h-18 pw-border pw-border-solid pw-border-neutral-divider pw-rounded-md pw-object-cover"
            />
            <h3 className="pw-flex-1 pw-text-lg pw-text-neutral-primary pw-font-bold">{product.name}</h3>
          </div>
          <div ref={ref}>
            {selectedOrderItems.map((item) => {
              const canPickQuanity = getOrderItemCanPickQuantity(
                item.sku_id,
                item?.can_pick_quantity || Infinity,
                orderItems,
                item.id,
              );
              const visible = selectedOrderItemId === item.id;
              return (
                <OrderCartItem
                  key={item.id}
                  id={item?.id || ''}
                  canPickQuantity={canPickQuanity}
                  visible={visible}
                  setVisible={setSelectedOrderItemId}
                  onOpen={handleOpen}
                  className="pw-bg-white pw-px-6 pw-py-3 pw-border pw-border-b pw-border-solid pw-border-neutral-divider"
                />
              );
            })}
          </div>
          <div className="pw-flex-1 pw-bg-white pw-p-4">
            <button
              className="pw-py-3 pw-gap-x-2 pw-rounded pw-flex pw-justify-center pw-items-center pw-w-full pw-bg-green-700"
              onClick={handleOpenSelectOther}
            >
              <BsPlus className="pw-text-white" size={14} />
              <span className="pw-text-base pw-font-bold pw-text-white">{t('action.select_other')}</span>
            </button>
          </div>
        </DrawerBody>
      </div>
    </Drawer>
  );
};

export default ProductCartDrawer;
