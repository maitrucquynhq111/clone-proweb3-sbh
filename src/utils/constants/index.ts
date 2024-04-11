import { PaymentStateInventory, StatusInventory } from '~app/features/warehouse/utils';

export enum SortType {
  ASC = 'asc',
  DESC = 'desc',
}

export enum Action {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'DELETE',
}

export enum CashBookType {
  IN = 'in',
  OUT = 'out',
}

export enum DebtType {
  IN = 'in',
  OUT = 'out',
  BALANCE = 'balance',
}

export enum DebtbookObjectType {
  PO = 'po',
  ORDER = 'order',
}

export enum OrderCreateMethod {
  SELLER = 'seller',
  BUYER = 'buyer',
}

export enum ChatChannel {
  SBH = 'sbh',
  STORE = 'sbh',
  WEBSITE = 'sbh',
  FACEBOOK = 'fb_comment',
  MESSENGER = 'fb_message',
  SHOPEE = 'shopee',
  ZALO = 'zalo_message',
}

export enum ChatStatus {
  ALL = '',
  UNREAD = 'unread',
}

export enum ConversationTag {
  FB_MESSAGE = 'fb_message',
  FB_COMMENT = 'fb_comment',
  SBH = 'sbh',
  ZALO_MESSAGE = 'zalo_message',
}

export const SourceKey = {
  [ConversationTag.SBH]: 'sbh',
  [ConversationTag.FB_MESSAGE]: 'facebook',
};

export enum ConversationType {
  GROUP = 'group',
  PRIVATE = 'private',
  SUPPORT = 'support',
  ORDER = 'order',
  ASSISTANT = 'assistant',
  NOTIFICATION = 'notification',
  FINANCE = 'finance',
  SYSTEM = 'system',
}

export enum ConversationTypeDefault {
  SUPPORT = 'support',
  ORDER = 'order',
  ASSISTANT = 'assistant',
  NOTIFICATION = 'notification',
  FINANCE = 'finance',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  ORDER = 'order',
  PRODUCT = 'product',
  BUTTON = 'button',
  NOTIFICATION = 'notification',
  CARDS_ASSISTANCE = 'cards_assistance',
  DRAFT_ORDER = 'draft_order',
  SYSTEM = 'system',
  FORM = 'form',
  IMAGE_TEXT = 'image_text',
}

export enum CardsAssistanceType {
  TEXT = 'text',
  CAROUSEL = 'carousel',
}

export enum MessageReactType {
  LOVE = 'reaction_type_love',
}

export const SuggestMessages = {
  [ConversationType.ASSISTANT]: [
    'start',
    'assistant_design',
    'assistant_marketing',
    'assistant_business',
    'professor_number',
    'design_logo',
    'end',
  ],
  [ConversationType.SUPPORT]: ['i_want_try_pro', 'hello', 'i_need_learn_app', 'i_want_report', 'i_want-feedback'],
};

export enum SenderType {
  USER = 'user',
  BUSINESS = 'business',
}

export enum MessageStateValue {
  WAITING_CONFIRM = 'waiting_confirm_v2',
  REMINDER_DELIVERING = 'reminder_delivering_v2',
  SEND_INVITE_STAFF = 'notification_send_invite_staff',
}

export enum OrderStatusType {
  WAITING_CONFIRM = 'waiting_confirm',
  DELIVERING = 'delivering',
  COMPLETE = 'complete',
  REFUND = 'refund',
  RETURN = 'return',
  CANCEL = 'cancel',
}

export enum OrderResponseType {
  SOLD_OUT = 'sold_out',
  SOLD_OUT_GREDIENT = 'sold_out_ingredient',
}

export const OrderStatus = {
  [OrderStatusType.WAITING_CONFIRM]: {
    name: 'waiting_confirm',
    bgColor: '!pw-bg-red-600',
  },
  [OrderStatusType.DELIVERING]: {
    name: 'delivering',
    bgColor: '!pw-bg-amber-600',
  },
  [OrderStatusType.COMPLETE]: {
    name: 'complete',
    bgColor: '!pw-bg-green-600',
  },
  [OrderStatusType.REFUND]: {
    name: 'refund',
    bgColor: '!pw-bg-neutral-secondary',
  },
  [OrderStatusType.RETURN]: {
    name: 'return',
    bgColor: '!pw-bg-neutral-placeholder',
  },
  [OrderStatusType.CANCEL]: {
    name: 'cancel',
    bgColor: '!pw-bg-neutral-disable',
  },
};

export const PaymentState = {
  [PaymentStateInventory.PAID]: {
    name: 'paid',
    bgColor: '!pw-bg-success-active',
  },
  [PaymentStateInventory.EMPTY]: {
    name: 'paid',
    bgColor: '!pw-bg-success-active',
  },
  [PaymentStateInventory.IN_DEBIT]: {
    name: 'un_paid',
    bgColor: '!pw-bg-error-active',
  },
  [PaymentStateInventory.UNPAID]: {
    name: 'un_paid',
    bgColor: '!pw-bg-error-active',
  },
  [PaymentStateInventory.PARTIAL_PAID]: {
    name: 'partial_paid',
    bgColor: '!pw-bg-gold',
  },
};

export const InventoryStatus = {
  [StatusInventory.EMPTY]: {
    name: 'completed',
    bgColor: '!pw-bg-success-active',
  },
  [StatusInventory.COMPLETED]: {
    name: 'completed',
    bgColor: '!pw-bg-success-active',
  },
  [StatusInventory.PROCESSING]: {
    name: 'processing',
    bgColor: '!pw-bg-gold',
  },
  [StatusInventory.CANCELLED]: {
    name: 'cancelled',
    bgColor: '!pw-bg-neutral-disable',
  },
};

export enum RefundStatusType {
  REFUNDED = 'refunded',
  NON_REFUND = 'non_refund',
  PARTIAL_REFUND = 'partial_refund',
}

export const RefundStatus = {
  [RefundStatusType.REFUNDED]: {
    color: 'pw-success-active',
  },
  [RefundStatusType.NON_REFUND]: {
    color: 'pw-error-active',
  },
  [RefundStatusType.PARTIAL_REFUND]: {
    color: 'pw-warning-active',
  },
};

export enum OrderHasRefundStateType {
  NO_REFUND_YET = 'no_refund_yet',
  FULL_REFUND = 'full_refund',
  PARTIAL_REFUND = 'partial_refund',
}

export enum OrderDiscountUnit {
  CASH = 'cash',
  PERCENT = 'percent',
}

export enum QuantityControlSize {
  Large = 'lg',
  Medium = 'md',
  Small = 'sm',
  Xsmall = 'xs',
}

export enum VerifyStatus {
  CONFIRM = 'confirm',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum PackageKey {
  FREE = 'sbh_package_free',
  PLUS = 'sbh_package_plus',
  PLUS_ADVANCE = 'sbh_package_plus_advanced',
  PRO = 'sbh_package_pro',
}

export enum ContactAnalyticOption {
  LAST_CREATE = 'last_create',
  CONTACT_BACK = 'contact_back',
  AMOUNT_IN = 'amount_in',
  AMOUNT_OUT = 'amount_out',
  CUSTOMER_POINT = 'customer_point',
  ORDER = 'order',
}

export const ContactAnalytic = {
  [ContactAnalyticOption.LAST_CREATE]: {
    name: 'last_create',
    bgColor: '!pw-bg-gold',
  },
  [ContactAnalyticOption.CONTACT_BACK]: {
    name: 'contact_back',
    bgColor: '!pw-bg-blue-primary',
  },
  [ContactAnalyticOption.AMOUNT_IN]: {
    name: 'amount_in',
    bgColor: '!pw-bg-secondary-main',
  },
  [ContactAnalyticOption.AMOUNT_OUT]: {
    name: 'amount_out',
    bgColor: '!pw-bg-primary-main',
  },
  [ContactAnalyticOption.CUSTOMER_POINT]: {
    name: 'customer_point',
    bgColor: '!pw-bg-violet',
  },
  [ContactAnalyticOption.ORDER]: {
    name: 'order',
    bgColor: '!pw-bg-success-active',
  },
};

export enum StockTakingAnalyticStatus {
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const StockTakingAnalyticStatusOption = {
  [StockTakingAnalyticStatus.PROCESSING]: {
    title: StockTakingAnalyticStatus.PROCESSING,
    bgColor: '!pw-bg-warning-active',
  },
  [StockTakingAnalyticStatus.COMPLETED]: {
    title: StockTakingAnalyticStatus.COMPLETED,
    bgColor: '!pw-bg-success-active',
  },
  [StockTakingAnalyticStatus.CANCELLED]: {
    title: StockTakingAnalyticStatus.CANCELLED,
    bgColor: '!pw-bg-neutral-disable',
  },
};

export enum InventoryCategory {
  ORDER_COMPLETED = 'Bán hàng',
  ORDER_REFUNDED = 'Hoàn trả',
  ORDER_CANCELLED = 'Hủy đơn',
  STOCKTAKE = 'Kiểm kho',
  INBOUND = 'Nhập hàng',
  INBOUND_CANCELLED = 'Hủy nhập hàng',
  OUTBOUND = 'Xuất hàng',
  CREATE_STOCK = 'Khởi tạo kho',
  UPDATE_QUANTITY_STOCK = 'Sửa tồn kho',
  UPDATE_PRICE_STOCK = 'Sửa giá vốn',
  DELETE_STOCK = 'Xóa sản phẩm',
  DELETE_INGREDIENT_STOCK = 'Xóa nguyên vật liệu',
  OTHER = 'Khác',
}

export enum InventoryType {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
  STOCKTAKE = 'stocktake',
}

export enum InventoryObjectType {
  ORDER = 'order',
  PO = 'po',
  EMPTY = '',
}

export enum InventoryTransactionType {
  IN = 'in',
  OUT = 'out',
}

export enum TableColumnsKey {
  PRODUCT_LIST = 'product_list',
}

export const QUICK_MESSAGE_TYPE_CODE = {
  CUSTOMER_NAME: '[Tên khách hàng]',
  CUSTOMER_PHONE: '[Số điện thoại]',
  CUSTOMER_GENDER: '[Danh xưng]',
  SHOP_NAME: '[Tên trang/cửa hàng]',
};

export const MAX_PRICE_LENGTH = 10;
export const MAX_PRICE = 9999999999;
export const MAX_QUANTITY_LENGTH = 7;
export const MAX_QUANTITY_DECIMAL_LENGTH = 12;
export const MAX_QUANTITY = 9999999;
export const MAX_UOM_LENGTH = 15;
export const MAX_PRODUCT_ADDON_GROUP_NAME = 20;
export const MAX_CUSTOMER_POINT = 10000;
export const CASH_PAYMENT_SOURCE = 'Tiền mặt';
export const GUIDE_PRINT_BARCODE = 'https://sobanhang.com/in-tem-ma-vach-tren-may-tinh';
export const LINK_SUBSCRIPTION_PLAN = 'https://quanly.sobanhang.com/subscription-plan';
export const FACEBOOK_TERM = 'https://developers.facebook.com/docs/messenger-platform/policy/policy-overview/';
export const META_SUITE_MESSAGE = 'https://business.facebook.com/latest/inbox/all';
export const PROVIDER_META_PAGE_PROFILE = 'https://www.facebook.com/people';
export const CHATBOT_IMAGES = {
  RESTAURANT:
    'https://d3hr4eej8cfgwy.cloudfront.net/finan-prd/cf20027c-05e3-4f8b-ac5c-ab2db69ac055/image/edda1a75-0800-42c4-b457-e4323b8cf735.png',
  FOOD: 'https://d3hr4eej8cfgwy.cloudfront.net/finan-prd/cf20027c-05e3-4f8b-ac5c-ab2db69ac055/image/93bfdcc7-d051-44aa-9b6f-1809f2b7cf97.png',
  FASHION:
    'https://d3hr4eej8cfgwy.cloudfront.net/finan-prd/cf20027c-05e3-4f8b-ac5c-ab2db69ac055/image/79c222f2-664c-42d3-b836-0a23028095cc.png',
  COMMON:
    'https://d3hr4eej8cfgwy.cloudfront.net/finan-prd/cf20027c-05e3-4f8b-ac5c-ab2db69ac055/image/dd5d70a3-759b-454f-b32b-4f12614398b3.png',
};
export const SUPPORT_NAME = 'Hỗ trợ';
