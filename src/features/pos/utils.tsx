import { useTranslation } from 'react-i18next';
import { FaShoppingCart } from 'react-icons/fa';
import { MdOutlineTableBar } from 'react-icons/md';
import { v4 } from 'uuid';
import * as yup from 'yup';
import { MainRouteKeys } from '~app/routes/enums';
import { MainRoutes } from '~app/routes/main/config';
import { OrderDiscountUnit, OrderStatusType } from '~app/utils/constants';
import { ComponentType } from '~app/components/HookForm/utils';
import QuantityControl from '~app/components/QuantityControl';
import { getFinalPrice, isDeepEqual, generateFullLocation } from '~app/utils/helpers';
import { sortArrayByKey } from '~app/utils/helpers/arrayHelpers';
import { PENDING_ORDERS, RETAILCUSTOMER, SELECTED_ORDER, POS_MODE, TABLE_COLUMNS } from '~app/configs';
import { PosMode } from '~app/features/pos/constants';

export enum TabKeyType {
  POS = 'POS',
  TABLE = 'TABLE',
}

export enum DeliveryMethodType {
  TABLE = 'pay_at_table',
  BUYER_PICK_UP = 'buyer_pick_up',
  SELLER_DELIVERY = 'seller_delivery',
}

export enum TicketItemStatus {
  REMOVED = 'removed',
  CHANGED = 'changed',
}

export const tabs = () => {
  const { t } = useTranslation('pos');
  return {
    [TabKeyType.POS]: {
      name: t('pos'),
      icon: <FaShoppingCart size={18} />,
      path: `${MainRoutes[MainRouteKeys.Pos].path}`,
    },
    [TabKeyType.TABLE]: {
      name: t('table_management'),
      icon: <MdOutlineTableBar size={18} />,
      path: `/table`,
    },
  };
};

export const initialContactInfo = (contact?: OrderCustom, debtAmount?: number) => ({
  phone_number: contact?.phone_number || '',
  name: contact?.name || '',
  address_info: contact?.address_info || null,
  avatar: '',
  debt_amount: debtAmount || 0,
  option: '',
});

export const initialOrder = (reservation?: ReservationMeta): PendingOrderForm => ({
  id: v4(),
  promotion_code: '',
  ordered_grand_total: 0,
  promotion_discount: 0,
  other_discount: 0,
  delivery_fee: 0,
  grand_total: 0,
  state: OrderStatusType.COMPLETE,
  payment_method: '',
  payment_source_id: '',
  payment_source_name: '',
  email: '',
  note: '',
  delivery_method: reservation ? DeliveryMethodType.TABLE : DeliveryMethodType.BUYER_PICK_UP,
  images: [],
  debit: {
    buyer_pay: 0,
    description: '',
    is_debit: true,
  },
  buyer_info: initialContactInfo(),
  create_method: 'seller',
  list_order_item: [],
  is_wholesale_price: false,
  selected_promotion: null,
  valid_promotion: false,
  has_debt_amount: false,
  customer_point: 0,
  customer_point_discount: 0,
  is_customer_point: false,
  reservation_meta: null,
  show_promotion: false,
  show_other_discount: false,
  show_delivery_fee: false,
  show_note: false,
  order_discount_unit: OrderDiscountUnit.CASH,
  is_open_delivery: false,
  reservation_info: reservation || null,
});

export const initialOrderTable = ({
  order,
  products,
  promotion,
}: {
  order: JSONRecord<Order>;
  products: Product[];
  promotion: Promotion | null;
}): PendingOrderForm => ({
  id: order.id,
  order_number: order.order_number,
  created_order_at: order.created_at,
  promotion_code: order.promotion_code,
  ordered_grand_total: order.ordered_grand_total,
  promotion_discount: order.promotion_discount,
  other_discount: order.other_discount,
  delivery_fee: order.delivery_fee,
  grand_total: order.grand_total,
  state: order.state,
  payment_method: order.payment_method,
  payment_source_id: '',
  payment_source_name: '',
  email: order.email,
  note: order.note,
  delivery_method: order.delivery_method,
  images: order.images || [],
  debit: {
    buyer_pay: order.amount_paid,
    description: '',
    is_debit: order.is_debit,
  },
  buyer_info: initialContactInfo(order.buyer_info, order.contact.debt_amount),
  create_method: order.create_method,
  list_order_item: formatOrderItems({ orderItems: order.order_item, products }),
  is_wholesale_price: order.is_wholesale_price,
  selected_promotion: order.promotion_code && promotion ? { ...promotion, valid: true, selected: true } : null,
  valid_promotion: !!order.promotion_code,
  has_debt_amount: false,
  customer_point: order.remaining_customer_point,
  customer_point_discount: order.customer_point_discount,
  is_customer_point: order.is_customer_point,
  reservation_meta: null,
  show_promotion: !!order.promotion_code,
  show_other_discount: !!order.other_discount,
  show_delivery_fee: !!order.delivery_fee,
  show_note: !!order.note,
  order_discount_unit: OrderDiscountUnit.CASH,
  is_open_delivery: true,
  reservation_info: order.reservation_meta || null,
  updated_at: order.updated_at,
});

const formatOrderItems = ({ orderItems, products }: { orderItems: OrderItem[]; products: Product[] }) => {
  return orderItems.map((item: OrderItem) => {
    const existedProduct = products.find((product) => product.id === item.product_id);
    if (existedProduct) {
      const existedSku = existedProduct.list_sku.find((sku) => sku.id === item.sku_id);
      if (existedSku) {
        return toInitialOrderItem(
          existedProduct,
          existedSku,
          item.price,
          item.quantity,
          existedSku.uom || existedProduct.uom,
          item.order_item_add_on,
        );
      }
      return { ...item, sku_type: '', show_edit_note: false };
    }
    return { ...item, sku_type: '', show_edit_note: false };
  });
};

export function toInitialOrderItem(
  product: Pick<Product, 'id' | 'name' | 'images' | 'product_type'>,
  sku: Pick<
    Sku,
    | 'id'
    | 'sku_type'
    | 'name'
    | 'sku_code'
    | 'normal_price'
    | 'selling_price'
    | 'can_pick_quantity'
    | 'range_wholesale_price'
    | 'is_active'
  >,
  price?: number,
  quantity?: number,
  uom?: string,
  order_item_add_on?: Array<OrderItemAddOn>,
  historical_cost?: number,
): PendingOrderItem {
  const can_pick_quantity = sku.sku_type === 'stock' ? sku.can_pick_quantity : sku.is_active ? Infinity : 0;
  const orderItem = {
    id: v4(),
    product_id: product.id,
    product_name: product.name,
    product_images: product?.images || ([] as string[]),
    product_type: product.product_type,
    sku_id: sku.id,
    sku_type: sku.sku_type || '',
    sku_name: product.product_type === 'variant' ? sku.name : '',
    sku_code: sku.sku_code,
    range_wholesale_price: sku.range_wholesale_price,
    product_normal_price: sku.normal_price || 0,
    product_selling_price: sku.selling_price || 0,
    price: price || sku.selling_price || sku.normal_price,
    wholesale_price: 0,
    quantity: quantity || 0,
    note: '',
    uom: uom || '',
    order_item_add_on: order_item_add_on || [],
    can_pick_quantity,
    show_edit_note: false,
  };
  if (historical_cost) {
    Object.assign(orderItem, { historical_cost });
  }
  return orderItem;
}

export const toPendingUpdateOrder = (pendingOrder: PendingOrderForm) => ({
  state: pendingOrder.state,
  debit: pendingOrder.debit,
  additional_info: {},
  payment_method: pendingOrder.payment_method,
  payment_source_id: pendingOrder.payment_source_id,
  payment_source_name: pendingOrder.payment_source_name,
  reservation_info: pendingOrder.reservation_info,
});

export function addToListOrderItem(
  orderItem: PendingOrderItem,
  listOrderItem: PendingOrderItem[],
  quantity: number,
  isWholesalePrice?: boolean,
): PendingOrderItem[] {
  const result: PendingOrderItem[] = [...listOrderItem];
  // Check same sku_id and same addon list
  const sortedOrderItemAddons = sortArrayByKey(orderItem.order_item_add_on, 'id');
  const newPrice = isWholesalePrice ? getWholesalePrice({ ...orderItem, quantity }) : orderItem.price;
  if (orderItem.order_item_add_on.length > 0) {
    const existedIndex = result.findIndex(
      (item) =>
        item.id !== orderItem.id &&
        item.sku_id === orderItem.sku_id &&
        isDeepEqual(item.order_item_add_on, sortedOrderItemAddons),
    );
    if (existedIndex === -1) {
      result.push({
        ...orderItem,
        quantity,
        price: newPrice,
        order_item_add_on: sortedOrderItemAddons,
      });
      return result;
    }
    const existedOrderItem = { ...result[existedIndex], price: newPrice } as PendingOrderItem;
    if (existedOrderItem) {
      existedOrderItem.quantity = existedOrderItem.quantity + quantity;
      result[existedIndex] = existedOrderItem;
    }
    return result;
  } else {
    const existedIndex = result.findIndex((item) => item.id === orderItem.id);
    if (existedIndex === -1) {
      result.push({ ...orderItem, quantity, price: newPrice });
      return result;
    }
    const existedOrderItem = {
      ...result[existedIndex],
      price: newPrice,
      order_item_add_on: sortedOrderItemAddons,
    } as PendingOrderItem;
    if (existedOrderItem) {
      existedOrderItem.quantity = quantity;
      result[existedIndex] = existedOrderItem;
    }
    return result;
  }
}

export function updateListOrderItem(
  orderItem: PendingOrderItem,
  listOrderItem: PendingOrderItem[],
  isWholesalePrice?: boolean,
) {
  let result: PendingOrderItem[] = [...listOrderItem];
  const newPrice = isWholesalePrice
    ? getWholesalePrice({ ...orderItem, quantity: orderItem.quantity })
    : orderItem.price;
  // Check same sku_id and same addon list
  const sortedOrderItemAddons = sortArrayByKey(orderItem.order_item_add_on, 'id');
  if (orderItem.order_item_add_on.length > 0) {
    const otherIndex = result.findIndex(
      (item) =>
        item.id !== orderItem.id &&
        item.sku_id === orderItem.sku_id &&
        isDeepEqual(item.order_item_add_on, sortedOrderItemAddons),
    );
    if (otherIndex === -1) {
      const existedIndex = result.findIndex((item) => item.id === orderItem.id);
      // Not existed
      if (existedIndex === -1) return result;
      // Existed
      result[existedIndex] = {
        ...orderItem,
        order_item_add_on: sortedOrderItemAddons,
        price: newPrice,
      };
      return result;
    } else {
      const existedOrderItem = {
        ...result[otherIndex],
        quantity: orderItem.quantity,
        price: newPrice,
      } as PendingOrderItem;
      result = result.filter((item) => item.id !== orderItem.id);
      result[otherIndex] = existedOrderItem;
      return result;
    }
  } else {
    const existedIndex = result.findIndex((item) => item.id === orderItem.id);
    // Not existed
    if (existedIndex === -1) return result;
    // Existed
    result[existedIndex] = { ...orderItem, order_item_add_on: sortedOrderItemAddons, price: newPrice };
    return result;
  }
}

export function removeOrderItem(orderItem: PendingOrderItem, listOrderItem: PendingOrderItem[]) {
  const result: PendingOrderItem[] = [...listOrderItem];
  return result.filter((item) => item.id !== orderItem.id);
}

export function getOrderItemCanPickQuantity(
  skuId: string,
  maxQuantity: number,
  listOrderItem: PendingOrderItem[],
  orderItemId?: string,
): number {
  let existed = listOrderItem.filter((item) => item.sku_id === skuId && item.order_item_add_on.length > 0);
  if (orderItemId) {
    existed = existed.filter((item) => item.id !== orderItemId);
  }
  if (existed.length > 0) {
    return (
      maxQuantity -
      existed.reduce((prev, cur) => {
        return prev + cur.quantity;
      }, 0)
    );
  }
  return maxQuantity;
}

export function emitChange(listeners: ExpectedAny) {
  // eslint-disable-next-line prefer-const
  for (let listener of listeners) {
    listener();
  }
}

export function getOrderTotal(listOrderItem: PendingOrderItem[]) {
  return listOrderItem.reduce((prev, cur) => {
    return prev + (cur.price + getTotalAddonPrice(cur.order_item_add_on)) * cur.quantity;
  }, 0);
}

export function getOrderGrandTotal({
  orderTotal,
  promotionDiscount,
  otherDiscount,
  deliveryFee,
  customerPointDiscount,
  validPromotion,
}: {
  orderTotal: number;
  promotionDiscount: number;
  otherDiscount: number;
  deliveryFee: number;
  customerPointDiscount: number;
  validPromotion: boolean;
}) {
  const result =
    orderTotal + deliveryFee - otherDiscount - customerPointDiscount - (validPromotion ? promotionDiscount : 0);

  return result <= 0 ? 0 : result;
}

export const createOrderPrinter = ({
  promotionDiscount,
  businessId,
  order,
  otherDiscount,
  customerPoint,
  deliveryFee,
  customerPointDiscount,
  validPromotion,
}: {
  promotionDiscount: number;
  businessId: string;
  order: PendingOrderForm;
  otherDiscount: number;
  customerPoint: number;
  deliveryFee: number;
  customerPointDiscount: number;
  validPromotion: boolean;
}) => {
  const orderTotal = getOrderTotal(order?.list_order_item);
  const grand_total = getOrderGrandTotal({
    orderTotal,
    promotionDiscount,
    otherDiscount,
    deliveryFee,
    customerPointDiscount,
    validPromotion,
  });
  return {
    id: '',
    debt_amount: order?.debt_amount || 0,
    delivery_fee: order?.delivery_fee || 0,
    buyer_info:
      order?.buyer_info.name !== ''
        ? order?.buyer_info
        : {
            name: RETAILCUSTOMER.name,
            phone_number: RETAILCUSTOMER.phone_number,
            address: generateFullLocation({ location: order?.buyer_info.address_info }) || '',
            address_info: null,
          },
    note: order?.note || '',
    order_item:
      order?.list_order_item.map((value) => ({
        ...value,
        uom: '',
        product_name: value.product_name.concat(
          value.sku_name && value.product_type === 'variant' ? ` - ${value.sku_name}` : '',
        ),
        can_pick_quantity: 0,
        normal_price: value.product_normal_price,
        total_amount: Math.round((value.price + getTotalAddonPrice(value.order_item_add_on)) * value.quantity),
        media: value.product_images || [],
      })) || [],
    grand_total,
    amount_paid: order?.debit.buyer_pay || 0,
    other_discount: order?.other_discount || 0,
    order_number: order.order_number,
    ordered_grand_total: orderTotal,
    promotion_discount: order?.promotion_discount || 0,
    business_id: businessId || '',
    remaining_customer_point: order?.remaining_customer_point || 0,
    customer_point_discount: customerPoint,
    staff_info: order?.staff_info || null,
    reservation_meta: order?.reservation_meta || null,
    created_at: order.created_order_at || new Date().toISOString(),
    created_order_at: order?.created_order_at || new Date().toISOString(),
    updated_order_at: order?.updated_order_at || new Date().toISOString(),
    updated_at: order?.updated_order_at || new Date().toISOString(),
  };
};

export function getSkusQuantity(skus: Array<Sku>) {
  return skus.reduce((acc, sku) => (sku.sku_type === 'stock' ? acc + sku.can_pick_quantity : 0), 0);
}

export function canPickSkus(skus: Array<Sku>) {
  return skus.some((sku) => sku.sku_type === 'non_stock' && sku.is_active === true);
}

// Add on
export function addToListAddon(addon: OrderItemAddOn, listAddon: OrderItemAddOn[], quantity: number): OrderItemAddOn[] {
  const result: OrderItemAddOn[] = [...listAddon];
  const existedIndex = result.findIndex((item) => item.id === addon.id);
  if (existedIndex === -1) {
    result.push({ ...addon, quantity: 1 });
    return result;
  }
  const existedOrderItem = { ...result[existedIndex] } as OrderItemAddOn;
  if (existedOrderItem) {
    existedOrderItem.quantity = quantity;
    result[existedIndex] = existedOrderItem;
  }
  return result;
}

export function updateListAddon(addon: OrderItemAddOn, listAddon: OrderItemAddOn[]) {
  const result: OrderItemAddOn[] = [...listAddon];
  const existedIndex = result.findIndex((item) => item.id === addon.id);
  // Not existed
  if (existedIndex === -1) return result;
  // Existed
  result[existedIndex] = addon;
  return result;
}

export function removeAddon(addon: OrderItemAddOn, listAddon: OrderItemAddOn[]) {
  const result: OrderItemAddOn[] = [...listAddon];
  return result.filter((item) => item.id !== addon.id);
}
export const initialFastProduct = ({ index }: { index: number }): PendingFastProduct => {
  const { t } = useTranslation('pos');
  return {
    name: `${t('fast_product')} ${index}`,
    normal_price: 0,
    historical_cost: 0,
    quantity: 1,
    save_product: false,
  };
};

export const fastProductFormSchema = ({ setValue }: { setValue(name: string, value: ExpectedAny): void }) => {
  const { t } = useTranslation('pos');
  return {
    className: 'pw-grid pw-grid-cols-12 pw-gap-x-6',
    type: 'container',
    name: 'form',
    children: [
      {
        className: 'pw-col-span-12',
        name: 'first-col',
        type: 'block-container',
        children: [
          {
            blockClassName: 'pw-col-span-12 pw-mb-4',
            className: `pw-grid pw-grid-cols-12 pw-gap-4 pw-relative`,
            type: 'block',
            name: 'first-block',
            children: [
              {
                type: ComponentType.Text,
                className: 'pw-col-span-12',
                labelClassName: 'pw-font-bold',
                label: t('products-form:name'),
                name: 'name',
                isRequired: true,
              },
            ],
          },
          {
            blockClassName: 'pw-col-span-12 pw-mb-4',
            className: `pw-grid pw-grid-cols-12 pw-gap-4 pw-relative`,
            type: 'block',
            name: 'second-block',
            children: [
              {
                type: ComponentType.Currency,
                className: 'pw-col-span-6',
                label: t('products-form:normal_price'),
                name: 'normal_price',
                placeholder: '0.000',
              },
              {
                type: ComponentType.Currency,
                className: 'pw-col-span-6',
                label: t('products-form:historical_cost'),
                name: 'historical_cost',
                placeholder: '0.000',
              },
            ],
          },
          {
            className: `pw-flex pw-items-center pw-justify-between pw-mb-4`,
            type: 'block',
            name: 'third-block',
            children: [
              {
                type: ComponentType.Label,
                label: t('common:quantity'),
              },
              {
                type: ComponentType.Custom,
                name: 'quantity',
                defaultValue: '1',
                size: 'sm',
                component: QuantityControl,
                onChange: (value: string) => setValue('quantity', value),
              },
            ],
          },
          {
            className: `pw-flex pw-items-center pw-justify-between`,
            type: 'block',
            name: 'last-block',
            children: [
              {
                type: ComponentType.Label,
                label: t('save_fast_product'),
              },
              {
                type: ComponentType.Toggle,
                name: 'save_product',
              },
            ],
          },
        ],
      },
    ],
  };
};

export const fastProductYupSchema = () => {
  const { t } = useTranslation('common');
  return yup.object().shape({
    name: yup.string().required(t('required_info') || ''),
    normal_price: yup.number().when('save_product', {
      is: true,
      then: (schema) => schema.min(1, t('products-form:error.min_normal_price') || ''),
    }),
  });
};

export const checkValidPromotion = ({ promotion, orderTotal }: { promotion: Promotion | null; orderTotal: number }) => {
  if (!promotion) return false;
  return (
    promotion.min_order_price <= orderTotal &&
    (promotion.max_size === 0 || promotion.current_size < promotion.max_size) &&
    (!promotion.end_time || new Date(promotion.end_time) > new Date())
  );
};

export const handleSelectPromotion = ({
  promotion,
  orderTotal,
}: {
  promotion: Promotion | null;
  orderTotal: number;
}) => {
  let finalDiscount = 0;
  if (promotion) {
    const discount = promotion.type === 'percent' ? (orderTotal * promotion.value) / 100 : promotion.value;
    finalDiscount =
      promotion.max_price_discount !== 0 && discount > promotion.max_price_discount
        ? promotion.max_price_discount
        : discount;
  }
  const valid = (promotion && checkValidPromotion({ promotion, orderTotal })) || false;
  return {
    promotion_code: promotion?.promotion_code || '',
    promotion_discount: valid ? finalDiscount : 0,
    valid,
  };
};

export function formatDescriptionPromotion(promotion: Promotion) {
  const maxPrice = promotion.max_price_discount > 0 ? `tối đa ${shorttenPrice(promotion.max_price_discount)}` : '';
  return `Giảm ${formatDiscount(promotion.value, promotion.type)} ${maxPrice} cho đơn từ ${shorttenPrice(
    promotion.min_order_price,
  )}`;
}

export function shorttenPrice(num: number) {
  if (num >= 1000000) {
    return `${num / 1000000}tr`;
  }

  if (num >= 1000) {
    return `${num / 1000}k`;
  }

  return `${num}đ`;
}

export function formatDiscount(num: number, type: string) {
  if (type === 'percent') {
    return `${num}%`;
  }

  return shorttenPrice(num);
}

export function generateOrderItemAddonName(addons: OrderItemAddOn[]) {
  if (addons.length > 0) {
    return addons
      .reduce((prev, cur) => {
        if (cur.quantity * cur.price > 0) {
          return prev + `x${cur.quantity} ${cur.name} - `;
        }
        return prev + `${cur.name} - `;
      }, '')
      .slice(0, -3);
  }
  return '';
}

export function getTotalAddonPrice(addons: OrderItemAddOn[]) {
  return addons.reduce((prev, cur) => {
    return prev + cur.quantity * cur.price;
  }, 0);
}

export function getWholesalePrice(orderItem: PendingOrderItem) {
  if (!orderItem?.range_wholesale_price) return orderItem.price;
  if (orderItem.range_wholesale_price.length === 0) return orderItem.price;

  const ranges = orderItem.range_wholesale_price;
  let price = getFinalPrice({
    normal_price: orderItem.product_normal_price,
    selling_price: orderItem.product_selling_price,
  });
  for (let index = ranges.length - 1; index >= 0; index--) {
    const currentItem = ranges[index];
    const beforeItem = ranges[index - 1];

    if (!currentItem?.min_quantity) break;
    // Check first price
    if (index === 0 && orderItem.quantity === currentItem.min_quantity) {
      price = currentItem.price;
      break;
    }
    // Check last price
    if (index === ranges.length - 1 && orderItem.quantity >= currentItem.min_quantity) {
      price = currentItem.price;
      break;
    }
    if (!beforeItem?.min_quantity) break;
    if (orderItem.quantity === currentItem.min_quantity) {
      price = currentItem.price;
      break;
    }
    if (orderItem.quantity > beforeItem.min_quantity && orderItem.quantity < currentItem.min_quantity) {
      price = beforeItem.price;
    }
  }
  return price;
}

export function saveLocalPendingOrders(pendingOrders: PendingOrderForm[], selectedOrderId: string) {
  window.localStorage.setItem(PENDING_ORDERS, JSON.stringify(pendingOrders));
  window.localStorage.setItem(SELECTED_ORDER, selectedOrderId);
}

export function getLocalPendingOrders() {
  try {
    const pendingOrders = JSON.parse(window.localStorage.getItem(PENDING_ORDERS) || '') as PendingOrderForm[];
    if (!pendingOrders) {
      throw new Error('Invalid cache');
    }
    return pendingOrders;
  } catch (error) {
    return [initialOrder()];
  }
}

export function getPosMode() {
  try {
    const posMode = window.localStorage.getItem(POS_MODE);
    if (!posMode) {
      window.localStorage.setItem(POS_MODE, PosMode.FNB);
      return PosMode.FNB;
    }
    return posMode;
  } catch (error) {
    return PosMode.FNB;
  }
}

export function getLocalSelectedOrderId() {
  try {
    const selectedOrderId = window.localStorage.getItem(SELECTED_ORDER) || '';
    return selectedOrderId || '';
  } catch (error) {
    return '';
  }
}

export const formatOrderFastItem = (orderItem: PendingOrderItem) => ({
  name: orderItem.product_name,
  descriptions: '',
  images: [],
  priority: 0,
  price: orderItem.price,
  normal_price: orderItem.product_normal_price,
  selling_price: 0,
  is_active: false,
  quantity: orderItem.quantity,
  uom: '',
  total_amount: orderItem.price * orderItem.quantity,
  is_product_fast: true,
  historical_cost: orderItem?.historical_cost || 0,
});

export function formatSelectLocation(location: AddressLocation) {
  if (!location) return null;
  let province = null,
    district = null,
    ward = null;
  switch (location.loc_lvl) {
    case 1: // province
      province = location;
      break;
    case 2: // district
      province = location?.parent_tree?.find((parent) => parent.loc_lvl === 1);
      district = location;
      break;
    default: // ward
      province = location?.parent_tree?.find((parent) => parent.loc_lvl === 1);
      district = location?.parent_tree?.find((parent) => parent.loc_lvl === 2);
      ward = location;
      break;
  }
  return {
    province_id: province?.short_id || '',
    province_name: province?.name || '',
    district_id: district?.short_id || '',
    district_name: district?.name || '',
    ward_id: ward?.short_id || '',
    ward_name: ward?.name || '',
  };
}

export function initialLocation(location?: ExpectedAny) {
  return {
    ...location,
    address: location?.address || '',
    province_id: location?.short_id || '',
    province_name: location?.province_name || '',
    district_id: location?.district_id || '',
    district_name: location?.district_name || '',
    ward_id: location?.ward_id || '',
    ward_name: location?.ward_name || '',
  };
}

export const formatSelectContact = (contact: Contact) => {
  const buyer_info = {
    name: contact.name,
    phone_number: contact.phone_number,
    address_info: initialLocation(contact.address_info),
    avatar: contact.avatar || contact.social_avatar,
    option: contact.option,
    debt_amount: contact.debt_amount,
  };
  return {
    buyer_info,
    customer_point: contact.customer_point,
  };
};

export const checkSelectedContact = ({
  contact,
  selected,
}: {
  contact: Contact;
  selected: { name: string; phone_number: string };
}) => {
  return contact.name === selected.name && contact.phone_number === selected.phone_number;
};

export const countTotalItems = ({ listOrderItem }: { listOrderItem: PendingOrderItem[] }) => {
  return listOrderItem.reduce((acc, curr) => acc + curr.quantity, 0);
};

export const getRoundingAmount = (amount: number, rounding: number) => {
  const count = amount > 0 ? Math.ceil(amount / rounding) : 1;
  return count * rounding;
};

export const getListSuggestAmountPaid = (grandTotal: number) => {
  const COUNT_SUGGESTION = 8;
  const ROUNDING_DENOMINATION_1 = 10000;
  const ROUNDING_DENOMINATION_2 = 50000;
  const ROUNDING_DENOMINATION_3 = 100000;
  /** Gợi ý theo logic số gần nhất :
   * Làm tròn lên hàng 10.000
   * Làm tròn lên hàng 50.000
   * Làm tròn lên hàng 100.000 >> 200.000 >> 500.000
   * VD: 24.000 → 30.000 >> 50.k >> 100.k >> 200k>500k
   */

  let roundingList: Array<number> = [];
  const suggestList: Array<number> = [];
  roundingList = [ROUNDING_DENOMINATION_3];
  if (grandTotal % ROUNDING_DENOMINATION_2 !== 0) {
    roundingList = [ROUNDING_DENOMINATION_2, ROUNDING_DENOMINATION_3];
  }
  if (grandTotal === 0 || grandTotal % ROUNDING_DENOMINATION_1 !== 0) {
    roundingList = [ROUNDING_DENOMINATION_1, ROUNDING_DENOMINATION_2, ROUNDING_DENOMINATION_3];
  }
  roundingList = roundingList.concat(
    Array.from({ length: COUNT_SUGGESTION - roundingList.length }, (_, i) => ROUNDING_DENOMINATION_3 * (i + 2)),
  );

  roundingList.forEach((item: number, index: number) => {
    const prevRoundingAmount = suggestList[index - 1] || 0;
    const roundingAmount = getRoundingAmount(grandTotal, item);
    if (prevRoundingAmount >= roundingAmount) {
      suggestList.push(prevRoundingAmount + ROUNDING_DENOMINATION_3);
      return;
    }
    suggestList.push(roundingAmount);
  });
  return suggestList;
};

export function saveLocalTableColumns(table_columns: TableColumns) {
  window.localStorage.setItem(TABLE_COLUMNS, JSON.stringify(table_columns));
}
