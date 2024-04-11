import { RETAILCUSTOMER } from '~app/configs';
import { OrderDiscountUnit } from '~app/utils/constants';

export function toPendingOrder(data: JSONRecord<Order>): PendingOrderForm {
  const items: PendingOrderItem[] = data.order_item.map((item) => ({
    id: item.id,
    sku_id: item.sku_id,
    product_id: item.product_id,
    product_name: item.product_name,
    product_type: '',
    sku_type: '',
    sku_name: item.sku_name,
    sku_code: item.sku_code,
    product_images: item?.product_images || [],
    product_normal_price: item?.product_normal_price || 0,
    product_selling_price: item?.product_selling_price || 0,
    wholesale_price: item?.wholesale_price || 0,
    price: item?.price || 0,
    quantity: item?.quantity || 0,
    remote_quantity: item?.quantity || 0,
    note: item?.note || '',
    historical_cost: item?.historical_cost || 0,
    range_wholesale_price: [],
    order_item_add_on: item?.order_item_add_on || [],
    can_pick_quantity: Infinity,
    uom: item.uom,
  }));
  const buyerInfo: Pick<Contact, 'debt_amount' | 'name' | 'phone_number' | 'address_info' | 'avatar' | 'option'> = {
    name: data?.buyer_info?.name || RETAILCUSTOMER.name,
    phone_number: data?.buyer_info?.phone_number || RETAILCUSTOMER.phone_number,
    address_info: data?.buyer_info?.address_info,
    avatar: '',
    debt_amount: 0,
    option: '',
  };
  return {
    id: data.id,
    images: data?.images || [],
    promotion_code: data.promotion_code,
    ordered_grand_total: data.ordered_grand_total,
    promotion_discount: data.promotion_discount,
    other_discount: data.other_discount,
    order_number: data.order_number,
    delivery_fee: data.delivery_fee,
    grand_total: data.grand_total,
    state: data.state,
    payment_method: data.payment_method,
    payment_source_id: '',
    payment_source_name: data.payment_method,
    email: data.email,
    note: data.note,
    delivery_method: data.delivery_method,
    buyer_info: buyerInfo,
    debit: {
      buyer_pay: data.amount_paid,
      is_debit: data.is_debit,
      description: '',
    },
    debt_amount: data.debt_amount || 0,
    list_order_item: items,
    create_method: data.create_method,
    selected_promotion: null,
    valid_promotion: !!data.promotion_code,
    has_debt_amount: false,
    customer_point: 0,
    customer_point_discount: data.customer_point_discount,
    is_customer_point: data?.customer_point_discount && data.customer_point_discount > 0 ? true : false,
    order_discount_unit: OrderDiscountUnit.CASH,
    contact_id: data.contact_id,
    payment_order_history: data.payment_order_history,
    staff_info: data?.staff_info || null,
    remaining_customer_point: data?.remaining_customer_point || 0,
    reservation_meta: data?.reservation_meta || null,
    canceled_order_info: data?.canceled_order_info || null,
    order_has_refund_state: data?.order_has_refund_state || undefined,
    origin_order_number: data?.origin_order_number || undefined,
    is_full_return: data?.is_full_return || false,
    refund_order: data?.refund_order || null,
    total_debt_and_cash: data?.total_debt_and_cash || null,
    created_order_at: data?.created_order_at,
    updated_order_at: data?.updated_order_at,
  };
}
export const defaultUpdateOrder = ({
  state,
  buyer_pay,
  paymentMethod,
}: {
  state?: string;
  buyer_pay: number;
  paymentMethod: Pick<PaymentMethod, 'id' | 'name'> | null;
}) => ({
  state: state || '',
  payment_method: paymentMethod?.name || '',
  payment_source_id: paymentMethod?.id || '',
  payment_source_name: paymentMethod?.name || '',
  debit: {
    buyer_pay,
    description: '',
    is_debit: false,
  },
});

export function toCreateOrderInput(pendingOrder: PendingOrderForm): CreateOrderInput {
  const newListOrderItem = pendingOrder.list_order_item.map((item) => {
    const { id, can_pick_quantity, range_wholesale_price, remote_quantity, historical_cost, product_id, ...newItem } =
      item;
    return newItem;
  });
  return {
    id: pendingOrder?.id || '',
    amount_paid: 0,
    ordered_grand_total: 0,
    grand_total: 0,
    other_discount: pendingOrder?.other_discount || 0,
    delivery_fee: pendingOrder?.delivery_fee || 0,
    delivery_method: pendingOrder?.delivery_method || '',
    promotion_code: pendingOrder?.promotion_code || '',
    promotion_discount: pendingOrder.promotion_discount,
    note: pendingOrder.note,
    paymentType: pendingOrder.payment_source_name,
    shippingType: '',
    email: pendingOrder.email,
    buyer_info: {
      name: pendingOrder.buyer_info.name,
      phone_number: pendingOrder.buyer_info.phone_number,
      address_info: pendingOrder.buyer_info.address_info,
    },
    list_order_item: newListOrderItem as ExpectedAny,
    created_at: '',
  } as CreateOrderInput;
}
