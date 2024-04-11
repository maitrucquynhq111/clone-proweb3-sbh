import { memo, useMemo, useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { Tooltip, Whisper } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaRegTrashAlt } from 'react-icons/fa';
import { BsPencilSquare, BsPlusCircleFill } from 'react-icons/bs';
import QuantityControl from '~app/components/QuantityControl';
import { useSelectedOrderStore, usePosStore } from '~app/features/pos/hooks';
import { TextInput, CurrencyInput } from '~app/components';
import { productStore } from '~app/features/pos/stores/productStore';
import {
  generateOrderItemAddonName,
  getTotalAddonPrice,
  removeOrderItem,
  updateListOrderItem,
} from '~app/features/pos/utils';
import { QuantityControlSize } from '~app/utils/constants';
import { formatCurrency } from '~app/utils/helpers';
import { ProductDrawerType } from '~app/features/pos/constants';

type Props = {
  id: string;
  canPickQuantity: number;
};

const yupSchemaNote = () => {
  return yup.object().shape({
    name: yup.string(),
  });
};

const OrderItem = ({ id, canPickQuantity }: Props) => {
  const { t } = useTranslation('pos');
  const ref = useRef<HTMLDivElement | null>(null);
  const [orderItem, setStore] = useSelectedOrderStore((store) => store.list_order_item.find((item) => item.id === id));
  const products = useSyncExternalStore(productStore.subscribe, productStore.getSnapshot);
  const [, setPosStore] = usePosStore((store) => store.selected_product);
  const [priceEdited, setPriceEdited] = useState(orderItem?.price || 0);
  const [discountEdited, setDiscountEdited] = useState(orderItem?.other_discount || 0);
  const [initPrice, setInitPrice] = useState(orderItem?.price || 0);
  const methods = useForm<{ note: string }>({
    resolver: yupResolver(yupSchemaNote()),
    defaultValues: { note: orderItem?.note || '' },
  });
  const { control, handleSubmit, getValues } = methods;

  const isVariant = orderItem?.product_type === 'variant' ? true : false;
  const product = useMemo(() => {
    return products.find((product) => product.id === orderItem?.product_id);
  }, []);

  const totalNormalPrice = useMemo(() => {
    if (!orderItem) return '0';
    return (orderItem.product_normal_price + getTotalAddonPrice(orderItem.order_item_add_on)) * orderItem.quantity;
  }, [orderItem]);

  const totalSellingPrice = useMemo(() => {
    if (!orderItem) return '0';
    return (orderItem.price + getTotalAddonPrice(orderItem.order_item_add_on)) * orderItem.quantity;
  }, [orderItem]);

  useEffect(() => {
    if (orderItem) setInitPrice(orderItem?.price || 0);
  }, []);

  const setShowEditNote = () => {
    setStore((store) => {
      if (!orderItem) return store;
      const newOrderItem: PendingOrderItem = { ...orderItem, show_edit_note: !orderItem.show_edit_note };
      const listOrderItem = updateListOrderItem(newOrderItem, store.list_order_item);
      return { ...store, list_order_item: listOrderItem };
    });
  };

  const handleChangeQuantity = (value: string, isInput?: boolean) => {
    if (!isInput && (!value || value === '0')) return handleRemoveOrderItem();
    setStore((store) => {
      if (!orderItem) return store;
      if (!value) return store;
      // Get wholesale price
      const listOrderItem = updateListOrderItem(
        { ...orderItem, quantity: +value },
        store.list_order_item,
        store.is_wholesale_price,
      );
      return { ...store, list_order_item: listOrderItem };
    });
  };

  const handleChangePrice = (value: string) => {
    setPriceEdited(+value);
  };
  const handleChangeDiscount = (value: string) => {
    setDiscountEdited(+value);
  };

  const handleNoteChange = ({ note }: { note: string }) => {
    setStore((store) => {
      if (!orderItem) return store;
      const newOrderItem: PendingOrderItem = { ...orderItem, note: note, show_edit_note: !orderItem.show_edit_note };
      const listOrderItem = updateListOrderItem(newOrderItem, store.list_order_item);
      return { ...store, list_order_item: listOrderItem };
    });
  };

  const handleRemoveOrderItem = () => {
    setStore((store) => {
      if (!orderItem) return store;
      return { ...store, list_order_item: removeOrderItem(orderItem, store.list_order_item) };
    });
  };

  const handleBlurQuantity = (value: string) => {
    if (!value || value === '0') {
      handleRemoveOrderItem();
    }
  };

  const handleBlurNote = () => {
    handleNoteChange(getValues());
  };

  const handleSubmitWithPropagation = (e: ExpectedAny) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(handleNoteChange)(e);
  };

  const resetPrice = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setDiscountEdited(0);
    setPriceEdited(initPrice);
    return;
  };

  const handleSubmitPrice = () => {
    const newPrice = priceEdited > discountEdited ? priceEdited - discountEdited : 0;
    setStore((store) => {
      if (!orderItem) return store;
      const newOrderItem: PendingOrderItem = { ...orderItem, price: +newPrice, other_discount: +discountEdited };
      const listOrderItem = updateListOrderItem(newOrderItem, store.list_order_item);
      return { ...store, list_order_item: listOrderItem };
    });
    setPriceEdited(newPrice);
    setDiscountEdited(0);
  };

  const handleClick = () => {
    if (product && orderItem && orderItem.id) {
      return setPosStore((store) => ({
        ...store,
        selected_product: product,
        selected_drawer: !product.product_type.match(/non_variant/)
          ? ProductDrawerType.VARIANT_ADDON_DRAWER
          : ProductDrawerType.SINGLE_ADDON,
        selected_order_item: orderItem?.id || '',
        is_edited_addon: true,
      }));
    }
  };

  return (
    <div className="pw-flex pw-flex-col pw-items-start pw-border-b pw-py-3 pw-w-full pw-px-6" ref={ref}>
      <div className="pw-flex pw-justify-between pw-items-center pw-w-full">
        <div className="pw-font-semibold pw-text-sm pw-mb-2 pw-overflow-hidden pw-text-litght-primary line-clamp-1">
          {orderItem?.product_name} {orderItem && isVariant ? <span> - {`${orderItem.sku_name}`}</span> : null}
        </div>
        {product?.list_product_add_on_group && product.list_product_add_on_group.length > 0 && (
          <button
            className="pw-bg-transparent pw-mb-2 pw-cursor-pointer pw-text-main hover:pw-bg-slate-100 pw-rounded"
            onClick={() => handleClick()}
          >
            <BsPlusCircleFill size={20} />
          </button>
        )}
      </div>
      {orderItem && orderItem.order_item_add_on.length > 0 ? (
        <span className="pw-bg-neutral-background pw-px-2 pw-py-1 pw-mb-2 pw-rounded pw-text-xs">
          {generateOrderItemAddonName(orderItem.order_item_add_on)}
        </span>
      ) : null}
      {orderItem?.show_edit_note ? (
        <form onSubmit={handleSubmitWithPropagation} className="pw-w-full">
          <Controller
            name="note"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextInput
                  {...field}
                  onBlur={handleBlurNote}
                  autoFocus={true}
                  isForm={false}
                  error={error}
                  placeholder={t('placeholder.enter_note') || ''}
                />
              );
            }}
          />
        </form>
      ) : (
        <span onClick={() => setShowEditNote()} className="pw-text-blue-700 pw-text-sm pw-italic pw-cursor-pointer">
          {orderItem?.note}
        </span>
      )}
      <div className="pw-flex pw-justify-between pw-items-center pw-w-full pw-mt-2 pw-gap-x-4">
        <div className="pw-flex-1">
          <button
            className="pw-bg-transparent pw-mr-1 pw-p-3 pw-cursor-pointer pw-text-neutral-secondary hover:pw-bg-slate-100 pw-rounded"
            onClick={() => handleRemoveOrderItem()}
          >
            <FaRegTrashAlt size={20} />
          </button>
          {!orderItem?.note && (
            <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip arrow={true}>{t('add_note')}</Tooltip>}>
              <button
                className="pw-bg-transparent pw-mr-1 pw-p-3 pw-cursor-pointer pw-text-neutral-secondary hover:pw-bg-slate-100 pw-rounded"
                onClick={() => setShowEditNote()}
              >
                <BsPencilSquare size={20} />
              </button>
            </Whisper>
          )}
        </div>
        <div className="pw-w-40 pw-flex-1">
          <QuantityControl
            size={QuantityControlSize.Small}
            defaultValue={orderItem?.quantity.toString()}
            maxQuantity={canPickQuantity}
            onChange={handleChangeQuantity}
            onBlur={handleBlurQuantity}
            classNameTextInput="!pw-text-blue-700"
          />
        </div>
        <div className="pw-flex pw-flex-col pw-flex-1 pw-items-end">
          {totalNormalPrice > totalSellingPrice && (
            <span className="pw-mr-2.5 pw-text-neutral-secondary pw-text-xs pw-line-through">
              {formatCurrency(totalNormalPrice)}
            </span>
          )}
          <Whisper
            placement="autoVerticalEnd"
            trigger="click"
            onClose={handleSubmitPrice}
            speaker={({ onClose }, ref) => {
              return (
                <form
                  ref={ref}
                  onSubmit={handleSubmitPrice}
                  className="pw-absolute pw-bg-neutral-white pw-shadow-dropdown"
                >
                  <div className="pw-w-full pw-px-4 pw-py-3 pw-flex pw-items-center">
                    <label className="pw-flex-1 pw-text-base pw-font-normal pw-text-neutral-primary pw-mb-1">
                      {t('addon_price')}
                    </label>
                    <span className="pw-font-semibold">
                      {formatCurrency(getTotalAddonPrice(orderItem?.order_item_add_on || []))}
                    </span>
                  </div>
                  <div className="pw-w-full pw-px-4 pw-py-3 pw-flex pw-items-center">
                    <label className="pw-flex-1 pw-text-base pw-font-normal pw-text-neutral-primary pw-mb-1">
                      {t('normal_price')}
                    </label>
                    <CurrencyInput
                      name=""
                      onChange={handleChangePrice}
                      isForm={false}
                      value={priceEdited}
                      placeholder="đ"
                      autoFocus={true}
                      inputGroupClassName="pw-p-2 pw-flex-1"
                      inputClassName="!pw-border-none !pw-outline-none !pw-p-0"
                    />
                  </div>
                  <div className="pw-w-full pw-px-4 pw-py-3 pw-flex pw-items-center">
                    <label className="pw-flex-1 pw-text-base pw-font-normal pw-text-neutral-primary pw-mb-1">
                      {t('other_discount')}
                    </label>
                    <CurrencyInput
                      name=""
                      max={priceEdited}
                      onChange={handleChangeDiscount}
                      isForm={false}
                      value={discountEdited}
                      placeholder="đ"
                      inputGroupClassName="pw-p-2 pw-flex-1"
                      inputClassName="!pw-border-none !pw-outline-none !pw-p-0"
                    />
                  </div>
                  <div className="pw-flex pw-justify-end pw-items-center pw-gap-x-3 pw-px-4 pw-py-3 pw-border-t pw-border-solid pw-border-neutral-divider">
                    <button
                      onClick={resetPrice}
                      className="pw-w-full pw-p-2 pw-bg-neutral-white pw-text-neutral-primary pw-font-bold pw-rounded pw-text-center pw-text-sm pw-border pw-border-solid pw-border-neutral-border"
                    >
                      {t('common:reset')}
                    </button>
                    <button
                      onClick={(e: ExpectedAny) => {
                        e.preventDefault();
                        handleSubmitPrice();
                        onClose();
                      }}
                      className="pw-w-full pw-p-2 pw-bg-green-700 pw-text-white pw-font-bold pw-rounded pw-text-center pw-text-sm"
                    >
                      {t('common:apply')}
                    </button>
                  </div>
                </form>
              );
            }}
          >
            <div>
              <span className="pw-relative pw-pb-0.5 pw-mr-2.5 pw-text-blue-700 pw-font-semibold pw-border-b pw-border-blue-700 pw-border-dashed pw-text-sm pw-cursor-pointer">
                {formatCurrency(totalSellingPrice)}
              </span>
            </div>
          </Whisper>
        </div>
      </div>
    </div>
  );
};

export default memo(OrderItem);
