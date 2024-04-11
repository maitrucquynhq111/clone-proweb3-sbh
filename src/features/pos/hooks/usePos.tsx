import { ProductDrawerType } from '~app/features/pos/constants';
import { getLocalPendingOrders, getPosMode } from '~app/features/pos/utils';
import createFastContext from '~app/utils/hooks/createFastContext';

type PosStore = {
  show_promotion_modal: boolean;
  show_other_discount_modal: boolean;
  show_delivery_fee_modal: boolean;
  show_note_modal: boolean;
  show_customer_modal: boolean;
  current_order_id: string;
  selected_product: Product | null;
  selected_product_id: string | null;
  selected_drawer: ProductDrawerType | null;
  is_edited_addon: boolean;
  selected_order_item: string;
  is_edit_order: boolean;
  is_create_order: boolean;
  pos_mode: string;
  pending_orders: PendingOrderForm[];
};

export const { Provider: PosProvider, useStore: usePosStore } = createFastContext<PosStore>({
  show_promotion_modal: false,
  show_other_discount_modal: false,
  show_delivery_fee_modal: false,
  show_note_modal: false,
  show_customer_modal: false,
  current_order_id: '',
  selected_product: null,
  selected_product_id: null,
  selected_drawer: null,
  is_edited_addon: false,
  selected_order_item: '',
  is_edit_order: false,
  is_create_order: false,
  pos_mode: getPosMode(),
  pending_orders: getLocalPendingOrders(),
});
