import { memo, useMemo, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { BsPlusCircleFill } from 'react-icons/bs';
import { productStore } from '~app/features/pos/stores/productStore';
import { generateOrderItemAddonName, updateListOrderItem } from '~app/features/pos/utils';
import { ProductDrawerType } from '~app/features/pos/constants';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import { TextInput } from '~app/components';

type Props = {
  orderItem: PendingOrderItem;
};

const yupSchemaNote = () => {
  return yup.object().shape({
    note: yup.string(),
  });
};

const ItemProduct = ({ orderItem }: Props) => {
  const { t } = useTranslation('pos');
  const [, setPosStore] = usePosStore((store) => store.selected_product);
  const [, setStore] = useSelectedOrderStore((store) => store);
  const products = useSyncExternalStore(productStore.subscribe, productStore.getSnapshot);
  const isVariant = orderItem?.product_type === 'variant' ? true : false;
  const product = useMemo(() => {
    return products.find((product) => product.id === orderItem?.product_id);
  }, []);

  const methods = useForm<{ note: string }>({
    resolver: yupResolver(yupSchemaNote()),
    defaultValues: { note: orderItem?.note || '' },
  });
  const { control, handleSubmit, getValues } = methods;

  const handleNoteChange = ({ note }: { note: string }) => {
    setStore((store) => {
      if (!orderItem) return store;
      const newOrderItem: PendingOrderItem = { ...orderItem, note: note, show_edit_note: !orderItem.show_edit_note };
      const listOrderItem = updateListOrderItem(newOrderItem, store.list_order_item);
      return { ...store, list_order_item: listOrderItem };
    });
  };

  const handleBlurNote = () => {
    handleNoteChange(getValues());
  };

  const handleSubmitWithPropagation = (e: ExpectedAny) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(handleNoteChange)(e);
  };

  const setShowEditNote = () => {
    setStore((store) => {
      if (!orderItem) return store;
      const newOrderItem: PendingOrderItem = { ...orderItem, show_edit_note: !orderItem.show_edit_note };
      const listOrderItem = updateListOrderItem(newOrderItem, store.list_order_item);
      return { ...store, list_order_item: listOrderItem };
    });
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
    <div className="pw-w-full pw-px-2">
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
        <span className="pw-bg-neutral-background pw-inline-block pw-px-2 pw-py-1 pw-mb-2 pw-rounded pw-text-xs">
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
        <div onClick={() => setShowEditNote()} className="pw-text-blue-700 pw-text-sm pw-italic pw-cursor-pointer">
          {orderItem?.note}
        </div>
      )}
    </div>
  );
};

export default memo(ItemProduct);
