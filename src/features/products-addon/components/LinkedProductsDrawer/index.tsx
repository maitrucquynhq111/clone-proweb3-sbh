import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { Button, Drawer } from 'rsuite';
import ProductSelectlist from './ProductSelectlist';
import { DrawerBody, DrawerFooter, DrawerHeader } from '~app/components';
import { ModalPlacement, ModalSize } from '~app/modals';

type Props = {
  open: boolean;
  setOpen(value: boolean): void;
};

const LinkedProductDrawer = ({ open, setOpen }: Props) => {
  const { t } = useTranslation('product-addon-form');
  const { control, setValue } = useFormContext<PendingProductAddOnGroup>();
  const linked_products = useWatch({
    control,
    name: 'linked_products',
    defaultValue: [] as PendingLinkedProductsAddOn[],
  });
  const [list, setList] = useState(linked_products);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = useCallback((index: number, product: Product, checked: boolean) => {
    const linked_product = {
      id: product.id,
      product_id: product.id,
      business_id: '',
      product_name: product.name,
      images: product.images,
      is_product_add_on: true,
      product_type: product.product_type,
    } as PendingLinkedProductsAddOn;
    if (product.product_type === 'variant') {
      linked_product.min_price = product.min_price;
      linked_product.max_price = product.max_price;
      linked_product.count_variant = product.count_variant;
    } else {
      linked_product.normal_price = product.list_sku[0]?.normal_price || 0;
      linked_product.selling_price = product.list_sku[0]?.selling_price || 0;
    }
    if (checked) {
      setList((prevState) => [...prevState, linked_product]);
    } else {
      setList((prevState) => [...prevState.filter((item) => item.product_id !== product.id)]);
    }
  }, []);

  const handleSubmit = () => {
    setValue('product_ids_add', [...list.map((item) => item.product_id)]);
    setValue('linked_products', list);
    handleClose();
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      size={ModalSize.Small}
      placement={ModalPlacement.Right}
      keyboard={false}
      backdrop="static"
    >
      <div className="pw-flex pw-flex-col !pw-h-screen">
        <DrawerHeader title={t('link_to_product')} onClose={handleClose} />
        <DrawerBody className="pw-bg-white">
          <ProductSelectlist linked_products={list} onChange={handleChange} />
        </DrawerBody>
        <DrawerFooter>
          <Button appearance="ghost" type="button" onClick={handleClose}>
            <span>{t('common:cancel')}</span>
          </Button>
          <Button appearance="primary" type="button" onClick={handleSubmit}>
            <span>{t('common:modal-confirm')}</span>
          </Button>
        </DrawerFooter>
      </div>
    </Drawer>
  );
};

export default LinkedProductDrawer;
