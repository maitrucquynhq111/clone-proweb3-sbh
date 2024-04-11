type PendingOrder = {
  id: string;
  items: Array<PendingOrderItem>;
  promotion_code: null;
  promotion_discount: number;
  other_discount: number;
  delivery_fee: number;
  payment_method: string;
  payment_source_id: string;
  payment_source_name: string;
  note: string;
  delivery_method: string;
  images: Array<string>;
  debit: {
    buyer_pay: number;
    description: string;
    is_debit: boolean;
  };
  buyer_info: Pick<Contact, 'name' | 'phone_number' | 'address_info' | 'avatar' | 'debt_amount' | 'option'>;
  is_wholesale_price: boolean;
  selected_promotion: {
    discount: number;
    min_order_price: number;
  } | null;
  grand_total: number;
  ordered_grand_total: number;
  is_customer_point: boolean;
  customer_point: number;
  customer_point_discount: number;
};

type Staff = {
  avatar: string;
  phone_number: string;
  staff_name: string;
  user_has_business_id: string;
  user_id: string;
};

type PendingOrderForm = {
  created_order_at?: string;
  created_at?: ExpectedAny;
  // business_id: string;
  id?: string;
  order_number?: string;
  promotion_code: string;
  ordered_grand_total: number;
  promotion_discount: number;
  other_discount: number;
  delivery_fee: number;
  grand_total: number;
  state: string;
  payment_method: string;
  payment_source_id: string;
  payment_source_name: string;
  email: string;
  note: string;
  delivery_method: string;
  images: Array<string>;
  debit: {
    buyer_pay: number;
    description: string;
    is_debit: boolean;
  };
  debt_amount?: number;
  buyer_info: Pick<Contact, 'name' | 'phone_number' | 'address_info' | 'avatar' | 'debt_amount' | 'option'>;
  list_order_item: Array<PendingOrderItem>;
  create_method: string;
  selectedOrderId?: string;
  is_wholesale_price?: boolean;
  selected_promotion: SelectedPromotion | null;
  valid_promotion: boolean;
  has_debt_amount: boolean;
  list_product_fast?: Array<FastProduct>;
  remaining_customer_point?: number | null;
  customer_point: number;
  customer_point_discount: number;
  is_customer_point: boolean;
  is_full_return?: boolean;
  reservation_meta?: ReservationMeta | null;
  staff_info?: OrderStaffInfo | null;
  show_promotion?: boolean;
  show_other_discount?: boolean;
  show_delivery_fee?: boolean;
  order_discount_unit: 'cash' | 'percent';
  show_note?: boolean;
  uom?: string;
  is_open_delivery?: boolean;
  contact_id?: string;
  payment_order_history?: PaymentOrderHistory[];
  cancel_transaction?: string[];
  canceled_order_info?: CanceledOrderInfo | null;
  order_has_refund_state?: string;
  origin_order_number?: string;
  refund_order?: Order[] | null;
  total_debt_and_cash?: TotalDebtAndCash | null;
  reservation_info?: ReservationMeta | null;
  bank_info?: BankInfo | null;
  created_order_at?: string;
  updated_order_at?: string;
  updated_at?: string;
};

type SelectedPromotion = Promotion & {
  valid: boolean;
  selected: boolean;
};

type PendingOrderItem = {
  // client_id: string;
  id?: string;
  sku_id: string;
  product_id: string;
  product_name: string;
  product_type?: string;
  sku_type: string;
  sku_name: string;
  sku_code: string;
  product_images: Array<string>;
  product_normal_price: number;
  product_selling_price: number;
  wholesale_price: number;
  price: number;
  quantity: number;
  remote_quantity?: number;
  note: string;
  historical_cost?: number;
  range_wholesale_price?: Array<RangeWholesalePrice>;
  order_item_add_on: Array<OrderItemAddOn>;
  can_pick_quantity?: number;
  other_discount?: number;
  uom: string | null;
  show_edit_note: boolean;
};

type OrderItemAddOn = {
  created_at?: string;
  creator_id?: string;
  deleted_at?: string;
  historical_cost: number;
  id?: string;
  images?: Array<string>;
  is_multiple_items: boolean;
  is_multiple_options: boolean;
  is_required: boolean;
  name: string;
  note?: string;
  order_item_id?: string;
  price: number;
  product_add_on_id: string;
  product_add_on_group_id?: string;
  priority: number;
  quantity: number;
  updated_at?: string;
  updater_id?: string;
};

type Order = {
  id: string;
  images?: string[];
  order_number: string;
  contact_id: string;
  create_method: string;
  state: string;
  create_method: string;
  delivery_method: string;
  delivery_fee: number;
  buyer_info: OrderCustom;
  contact: {
    id: string;
    debt_amount: number;
  };
  note: string;
  order_item: Array<OrderItem>;
  grand_total: number;
  amount_paid: number;
  address: string;
  other_discount: number;
  ordered_grand_total: number;
  promotion_discount: number;
  business_id: string;
  payment_order_history: Array<PaymentOrderHistory>;
  updated_at: string;
  created_at: string;
  promotion_code: string;
  email: string;
  payment_method: string;
  status?: string;
  debt_amount: number | null;
  items_info?: Array<ResponseItem>;
  customer_point_discount: number;
  is_customer_point: boolean;
  remaining_customer_point: number;
  package_order: PackageOrder;
  is_debit: boolean;
  is_full_return: boolean;
  is_printed: boolean;
  is_wholesale_price: boolean;
  order_shipping: [
    {
      id: string;
      order_id: string;
      shipper_id: string;
      shipping_info: {
        id: string;
        name: string;
        address: string;
        phone_number: string;
      };
    },
  ];
  reservation_meta?: ReservationMeta | null;
  staff_info?: OrderStaffInfo | null;
  canceled_order_info: CanceledOrderInfo | null;
  order_has_refund?: {
    id: string;
    order_id: string;
    state: string;
  } | null;
  order_has_refund_state?: string;
  origin_order_number?: string;
  refund_order?: Order[] | null;
  total_debt_and_cash?: TotalDebtAndCash | null;
  created_order_at?: string;
  updated_order_at?: string;
};

type TotalDebtAndCash = {
  total_cash_amount: number;
  total_debt_amount: number;
};

type CanceledOrderInfo = {
  refund_status: string;
  refund_transaction: RefundTransaction[];
};

type RefundTransaction = {
  id: string;
  amount: number;
  business_id: string;
  payment_method: string;
  payment_source_id: string;
  payment_source_name: string;
  created_at: string;
  updated_at: string;
};

type PackageOrder = {
  business_id: string;
  cod_amount: number;
  created_at: string;
  creator_id: string;
  external_code: string;
  id: string;
  note: string;
  object_key: string;
  object_type: string;
  shipping_code: string;
  shipping_partner_key: string;
  shipping_state: string;
  shipping_state_name: string;
  try_on: string;
  updated_at: string;
  updater_id: string;
  weight: string;
  service: {
    carrier: string;
    code: string;
    estimated_delivery_at: string;
    estimated_pickup_at: string;
    fee: number;
    name: string;
    carrier_info: {
      image_url: string;
      name: string;
    };
  };
};

type OrderPrinter = {
  id?: string;
  order_number?: string;
  state?: string;
  delivery_method?: string;
  address?: string;
  payment_order_history?: Array<PaymentOrderHistory>;
  updated_at?: string;
  promotion_code?: string;
  email?: string;
  payment_method?: string;
  status?: string;
  items_info?: Array<ResponseItem>;
  delivery_fee: number;
  buyer_info: OrderCustom;
  note: string;
  order_item: Array<OrderItem>;
  grand_total: number;
  amount_paid: number;
  other_discount: number;
  ordered_grand_total: number;
  promotion_discount: number;
  business_id: string;
  debt_amount?: number;
  created_at: string;
};

type OrderItem = {
  id?: string;
  sku_code: string;
  product_id: string;
  product_name: string;
  sku_name: string;
  uom: string | null;
  can_pick_quantity: number;
  normal_price: number;
  quantity: number;
  total_amount: number;
  price: number;
  product_images: Array<string>;
  media: Array<string>;
  product_normal_price: number;
  product_selling_price: number;
  historical_cost?: number;
  wholesale_price: number;
  note: string;
  sku_id: string;
  type?: string;
  order_item_add_on: Array<OrderItemAddOn>;
};

type CreateOrderResponse = {
  status?: string;
  items_info?: Array<ResponseItem>;
};

type ResponseItem = {
  barcode: string;
  can_pick_quantity: number;
  historical_cost: number;
  id: string;
  media: Array<string> | null;
  normal_price: number;
  product_id: string;
  product_is_active: boolean;
  product_name: string;
  selling_price: number;
  sku_code: string;
  sku_is_active: boolean;
  sku_name: string;
  type: string;
  uom: string;
};

type OrderCustom = {
  address?: string;
  address_info: AddressInfo | null;
  latitude?: number;
  longitude?: number;
  name: string;
  phone_number: string;
};

type OrderTracking = {
  id: string;
  created_at: string;
  updated_at: string;
  order_id: string;
  state: string;
};

type PaymentOrderHistory = {
  id: string;
  amount: number;
  created_at: string;
  name: string;
  order_id: string;
  payment_method: string;
  payment_source_id: string;
  updated_at: string;
};

type PaymentOrderHistory = {
  id: string;
  amount: number;
  created_at: string;
  name: string;
  order_id: string;
  payment_method: string;
  payment_source_id: string;
  updated_at: string;
};

type PaymentMethod = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  business_id: string;
  balance: number;
  priority: number;
};

type CreateCustomPaid = {
  order_id?: string;
  business_id?: string;
  amount?: number;
  name?: string;
  payment_source_id?: string;
  payment_method?: string;
};

type CreateOrderInput = {
  id: string;
  business_id?: string;
  promotion_code: string | null;
  ordered_grand_total: number;
  promotion_discount: number;
  delivery_fee: number;
  grand_total: number;
  note: string;
  paymentType: string;
  email: string;
  shippingType: string;
  other_discount: number;
  buyer_info: BuyerInfo;
  delivery_method: string;
  list_order_item: PendingOrderItem[];
  list_product_fast?: Array<FastProduct>;
  amount_paid: number;
  created_at: string;
  reservation_info?: ReservationMeta | null;
};

type list_order_item = {
  sku_id: string;
  sku_name: string;
  sku_code: string;
  sku_type: string;
  product_images: Array<string>;
  media: Array<string>;
  product_name: string;
  product_normal_price: number;
  product_selling_price: number;
  quantity: number;
  note: string;
  total_amount: number;
  price: number;
  uom: string | null;
  wholesale_price: number;
  type: string;
  can_pick_quantity: number;
  product_type: string;
  order_item_add_on: Array<OrderItemAddOn>;
};

type BuyerInfo = {
  business_id?: string;
  phone_number: string;
  name: string;
  address?: string;
  address_info: AddressInfo | null;
  type?: string;
};

type UpdateOrderInput = Pick<Order, 'state'> & {
  payment_method?: string | null;
  payment_source_id?: string | null;
  payment_source_name?: string | null;
  debit?: {
    buyer_pay: number;
    description: string;
    is_debit: boolean;
  } | null;
  additional_info?: ExpectedAny;
  reservation_info?: ReservationMeta | null;
  is_customer_point?: boolean;
  cancel_transaction?: string[];
};

type CancelMultiOrderBody = {
  list_order_id: Array[];
  list_order: ExpectedAny;
};

type CancelCompleteOrderBody = {
  payment_source_id: string;
  payment_source_name: string;
  refund_amount: number;
};

type ConfigInvoice = {
  address_type: boolean;
  amount_paid: boolean;
  avatar: string;
  bank_account: boolean;
  business_id: string;
  created_at: string;
  creator_id: string;
  debt_amount: boolean;
  font_size: string;
  footer: string;
  id: string;
  logo_sbh: boolean;
  name_buyer: boolean;
  name_seller: boolean;
  note: string;
  note_buyer: boolean;
  other_discount: boolean;
  phone_buyer: boolean;
  qr_code: string;
  title: string;
  updated_at: string;
  updater_id: string;
  vat: number;
};

type OrderState = 'cancel' | 'complete' | 'waiting_confirm' | 'delivering';

type ReservationMeta = {
  customer_schedule_id: string | null;
  sector_id: string;
  sector_name: string;
  table_id: string;
  table_name: string;
};
type OutOfStockItem = {
  id: string;
  sku_name: string;
  product_id: string;
  product_name: string;
  product_type: string;
  quantity: number;
  missing_quantity: number;
  media: Array<string>;
  selling_price: number;
  normal_price: number;
  product_is_active: boolean;
  sku_is_active: boolean;
  uom: string;
  sku_code: string;
  sku_type: string;
  barcode: string;
  can_pick_quantity: number;
  type: string;
};

type OrderStateAnalytics = {
  count_waiting_confirm: number;
  count_delivering: number;
  count_complete: number;
  count_cancel: number;
  count_refund: number;
  revenue: number;
  revenue_online: number;
  profit: number;
};

type OrderStaffInfo = {
  phone_number: string;
  staff_id: string;
  staff_name: string;
};

type UpdateOrderRefundBody = {
  business_id: string;
  payment_source_id: string;
  payment_source_name: string;
  payment_method: string;
  note: string;
  debit: {
    buyer_pay: number;
    is_debit: boolean;
  };
};

type PendingChatOrderForm = {
  business_id: string;
  grand_total: number;
  ordered_grand_total: number;
  promotion_code: string;
  promotion_discount: number;
  other_discount: number;
  delivery_fee: number;
  state: string;
  delivery_method: string;
  buyer_id?: string | null;
  buyer_info: BuyerInfo;
  list_order_item: Array<PendingOrderItem>;
  email: string;
  note: string;
  create_method: string;
  payment_method: string;
  conversation_id?: string;
};
