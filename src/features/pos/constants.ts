export const RequestType = {
  INIT_DB: 'init-db',
  SYNC_DATA: 'synch-data',
  FORCE_SYNC: 'force-sync',
  ALL_CATEGORY: 'get-all-category',
  ALL_CONTACT: 'get-all-contact',
  ALL_PAYMENT_SOURCE: 'get-all-payment-source',
  SEARCH_LOCATION: 'search-location',
  FILTER_PRODUCT: 'filter-product',
  SEARCH_PRODUCT: 'search-product',
  MAKE_SEARCH_PRODUCT: 'make-search-product',
  MAKE_SEARCH_LOCATION: 'make-search-location',
  CREATE_ORDER: 'create-order',
  GET_ALL_ORDER: 'get-all-order',
  DELETE_ORDER: 'delete-order',
};
export const ResponseType = {
  SEARCH_LOCATION: 'result-search-location',
  SEARCH_PRODUCT: 'result-search-product',
  FILTER_PRODUCT: 'result-filter-product',
  ALL_CATEGORY: 'result-get-all-category',
  ALL_PAYMENT_SOURCE: 'result-get-all-payment-source',
  ALL_CONTACT: 'result-get-all-contact',
  ALL_ORDER: 'result-get-all-order',
  SYNC_SUCCESS: 'sync-success',
  SYNCING: 'syncing',
  DELETE_ORDER: 'result-delete-order',
};

export enum SyncType {
  PRODUCTS = 'Products',
  CONTACTS = 'Contacts',
  CATEGORIES = 'Categories',
  LOCATION = 'Location',
  PAYMENT_SOURCE = 'PaymentSource',
  // CONTACT_GROUPS = 'ContactGroup',
}

export enum PaymentSettingType {
  PROMOTION = 'promotion',
  OTHER_DISCOUNT = 'other_discount',
  DELIVERY_FEE = 'delivery_fee',
  NOTE = 'note',
  CUSTOMER = 'customer',
}

export enum ProductDrawerType {
  ADDON_DRAWER = 'addon_drawer',
  VARIANT_ADDON_DRAWER = 'variant_addon_drawer',
  VARIANT_DRAWER = 'variant_drawer',
  SINGLE_ADDON = 'single_addon',
  CART_DRAWER = 'cart_drawer',
}

export enum PosMode {
  FNB = 'fnb',
  RETAILER = 'retailer',
}

export enum PriceType {
  NORMAL = 'normal_price',
  WHOLESALE = 'wholesale_price',
}

export const WIDTH_HEADER_EXCEPT_ORDER_TABS = 1050; // To find maximum width of order tabs
export const SCROLL_RACE = 50; // How many pixels to scroll
