/* eslint-disable @typescript-eslint/no-unused-vars */
type Inventory = {
  sku_id: string;
  sku_info: SkuInventoryInfo;
  created_at: string;
  pricing: number;
  quantity: number;
  object_type: string;
  transaction_type: string;
  po_id: string;
  po_code: string;
  status: string;
  type: string;
  object_key: string;
  object_type_po: string;
  category_name: string;
};

type SkuInventoryInfo = {
  id: string;
  media: string[];
  sku_id: string;
  barcode: string;
  sku_code: string;
  sku_name: string;
  normal_price: number;
  product_name: string;
  product_type: string;
  selling_price: number;
  // ingredient fields
  uom: Uom;
  name: string;
  price: number;
  uom_id: string;
  pricing: number;
  quantity: number;
  deleted_at: string | null;
  business_id: string;
  total_quantity: number;
  transaction_type: string;
  after_change_quantity: ExpectedAny;
  before_change_quantity: number;
};

type ContactInfo = {
  id: string;
  phone_number: string;
  name: string;
  avatar: string;
  social_avatar: string;
  address: string;
};

type ListItemInventory = {
  id: string;
  sku_name: string;
  media: string[];
  sku_code: string;
  bar_code: string;
  product_name: string;
  type: string;
  pricing: number;
  quantity: number;
  uom: string;
  can_pick_quantity: number;
  product_type: string;
  sku_type: string;
  historical_cost: number;
};

type PendingInventoryCreate = {
  po_type: string;
  po_details: Array<PendingPoDetails>;
  po_detail_ingredient: Array<PendingPoDetailsIngredient>;
  note: string;
  contact_id?: string;
  total_discount: number;
  sur_charge: number;
  buyer_pay?: number;
  option: string;
  media: Array<string | PendingUploadImage>;
  payment_state: string;
  payment_source_id?: string;
  payment_source_name?: string;
  contact_phone?: string;
  contact_name?: string;
  contact_avatar?: string;
  contact_debt_amount?: number;
  is_debit: boolean;
};

type PendingCreateExportGoods = {
  type: string;
  po_type: string;
  status: string;
  po_details: Array<PendingPoDetails>;
  po_detail_ingredient: Array<PendingPoDetailsIngredient>;
  note: string;
  media: Array<string | PendingUploadImage>;
};

type InventoryCreateForm = Omit<PendingInventoryCreate, 'po_details'> & {
  po_details: Array<PoDetails>;
};

type CreateExportGoodsForm = Omit<PendingCreateExportGoods, 'po_details'> & {
  po_details: Array<PoDetails>;
};

type PoDetails = {
  sku_id: string;
  pricing: number;
  quantity: number;
};

type PendingPoDetails = SkuInventory & {
  pricing: number;
  quantity: number;
  sku_id: string;
  price: number;
};

type PendingPoDetailsIngredient = Ingredient & {
  pricing: number;
  quantity: number;
  sku_id: string;
  price: number;
  uom_id: string;
};

type PoDetailsIngredient = {
  pricing: number;
  quantity: number;
  sku_id: string;
  price: number;
  uom_id: string;
};

type PoCategory = {
  id: string;
  created_at: string;
  updated_at: string;
  business_id: string;
  name: string;
  type: string;
  priority: number;
};

type PurchaseOrderIngredients = {
  po_type: string;
  option: string;
  po_details: PoDetailIngredient[];
};

type PoDetailIngredient = {
  sku_id: string;
  pricing: number;
  quantity: number;
  uom_id: string;
};

type InventoryAnalytics = {
  total_amount: number;
  total_quantity: number;
  total_non_stock: number;
  total_out_of_stock: number;
};

type InventoryBookAnalytics = {
  first_period: number;
  inbound_in_period: number;
  outbound_in_period: number;
  last_period: number;
};

type InventoryCategory = {
  id: string;
  key: string;
  name: string;
  type: string;
  priority: number;
};

type InventoryImportBook = {
  id: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  po_code: string;
  po_type: string;
  media: string[] | null;
  note: string;
  contact_id: string;
  category_id: string;
  category_key: string;
  category: InventoryImportBookCategory;
  total_items: number;
  total_quantity: number;
  total_discount: number;
  sur_charge: number;
  transaction_id: string;
  business_id: string;
  total_amount: number;
  staff_info: InventoryStaffInfo;
  payment_state: string;
  contact_info: InventoryContactInfo;
  action_sync_data: ExpectedAny;
  refund_amount: number;
  status: string;
  type: string;
  is_debit: boolean;
  object_key: string;
  object_type: string;
  ver_api: string;
  total_before_change_quantity: number;
  total_after_change_quantity: number;
  state: string;
  payment_purchase_order: PaymentPurchaseOrder[];
};

type PaymentPurchaseOrder = {
  id: string;
  created_at: string;
  updated_at: string;
  payment_source_name: string;
  payment_source_id: string;
  po_id: string;
  amount: number;
  payment_method: string;
  business_id: string;
};

type InventoryContactInfo = {
  id: string;
  name: string;
  avatar: string;
  address: string;
  phone_number: string;
  social_avatar: string;
};

type InventoryImportBookCategory = {
  id: string;
  created_at: string;
  updated_at: string;
  business_id: string;
  name: string;
  type: string;
  priority: number;
};

type InventoryStaffInfo = {
  staff_id: string;
  staff_name: string;
  phone_number: string;
  is_owner: boolean;
};

type WarehouseDetail = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  business_id: string;
  product_id: string;
  priority: number;
  is_active: boolean;
  media: string[] | null;
  sku_code: string;
  barcode: string;
  selling_price: number;
  normal_price: number;
  product_name: string;
  name: string;
  sold_quantity: number;
  can_pick_quantity: number;
  type: string;
  sku_type: string;
  product_type: string;
  historical_cost: number;
  wholesale_price: number;
  po_details: WarehousePoDetail;
  uom: string;
  range_wholesale_price: ExpectedAny[];
};

type WarehousePoDetail = {
  sku_id: string;
  quantity: number;
  pricing: number;
  blocked_quantity: number;
  warning_value: number;
  delivering_quantity: number;
  note: string;
  sku_info: WarehouseSkuInfo;
  uom_id: string;
  object_type: string;
};

type WarehouseSkuInfo = {
  sku_id: string;
  id: string;
  sku_name: string;
  media: string[] | null;
  sku_code: string;
  barcode: string;
  product_name: string;
  product_type: string;
  selling_price: number;
  normal_price: number;
};

type PendingWarehouseDetail = {
  po_details: {
    pricing: number;
    quantity: number;
    blocked_quantity: number;
    warning_value: number;
  };
} & WarehouseDetail;

type InventoryStockTaking = {
  id: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  po_code: string;
  po_type: string;
  media: Array<ExpectedAny>;
  note: string;
  contact_id: string;
  category_id: string;
  category_key: string;
  category: InventoryCategory;
  total_items: number;
  total_quantity: number;
  total_discount: number;
  sur_charge: number;
  transaction_id: string;
  business_id: string;
  total_amount: number;
  staff_info: InventoryStaffInfo;
  payment_state: string;
  contact_info: ExpectedAny;
  action_sync_data: ExpectedAny;
  refund_amount: number;
  status: string;
  type: string;
  is_debit: boolean;
  object_key: string;
  object_type: string;
  ver_api: string;
  total_before_change_quantity: number;
  total_after_change_quantity: number;
  state: string;
};

type InventoryStockTakingAnalytic = {
  canceled_count: number;
  completed_count: number;
  processing_count: number;
};

type PendingStockTakingPoDetailSkuInfo = {
  sku_code: string;
  sku_name: string;
  uom?: string;
  product_name: string;
  product_type: string;
  media: string[] | null;
};

type PendingStockTakingPoDetailSku = {
  sku_id: string;
  sku_info: PendingStockTakingPoDetailSkuInfo;
  before_change_quantity: number;
  after_change_quantity: string;
};

type PendingStockTakingPoDetailIngredient = {
  sku_id: string;
  name: string;
  uom_id: string;
  uom: Uom;
  before_change_quantity: number;
  after_change_quantity: string;
};

type PendingStockTaking = {
  note: string;
  media: Array<string | PendingUploadImage>;
  po_details: PendingStockTakingPoDetailSku[];
  po_detail_ingredient: PendingStockTakingPoDetailIngredient[];
  status: string;
};

type StockTakingBody = {
  business_id: string;
  note: string;
  media: string[];
  po_type: string;
  type: string;
  option: string;
  status: string;
  po_details: {
    sku_id: string;
    after_change_quantity: number;
  }[];
  po_detail_ingredient: {
    sku_id: string;
    uom_id: string;
    after_change_quantity: number;
  }[];
};

type InventoryDetail = {
  id: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  po_code: string;
  po_type: string;
  media: string[] | null;
  note: string;
  category: CategoryInventoryDetail;
  total_items: number;
  total_quantity: number;
  total_discount: number;
  sur_charge: number;
  total_amount: number;
  contact_info: ContactInfo;
  contact_id: string;
  list_item: ItemInventoryDetail[] | null;
  list_ingredient: IngredientInventoryDetail[] | null;
  payment_state: string;
  payment_purchase_order: PaymentPurchaseOrder[];
  staff_info: InventoryStaffInfo;
  staff_info_update?: InventoryStaffInfo;
  state: string;
  status: string;
  refund_state: string;
  refund_payment_po: ExpectedAny[];
  refund_amount: number;
  total_before_change_quantity: number;
  total_after_change_quantity: number;
  is_debit: boolean;
  type: string;
  po_details: PoInventoryDetail[];
  action_sync_data: ExpectedAny;
};

type CategoryInventoryDetail = {
  id: string;
  created_at: string;
  updated_at: string;
  business_id: string;
  name: string;
  type: string;
  priority: number;
};

type ItemInventoryDetail = {
  id: string;
  sku_name: string;
  media: string[];
  sku_code: string;
  bar_code: string;
  product_name: string;
  type: string;
  product_type: string;
  selling_price: number;
  normal_price: number;
  uom: string;
  pricing: number;
  quantity: number;
  transaction_type: string;
  before_change_quantity: number;
  after_change_quantity: ExpectedAny;
};

type IngredientInventoryDetail = {
  id: string;
  deleted_at: string | null;
  name: string;
  price: number;
  uom_id: string;
  business_id: string;
  uom: Uom;
  pricing: number;
  quantity: number;
  total_quantity: number;
  transaction_type: string;
  before_change_quantity: number;
  after_change_quantity: ExpectedAny;
};

type PoInventoryDetail = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  sku_id: string;
  po_id: string;
  pricing: number;
  transaction_type: string;
  quantity: number;
  before_change_quantity: number;
  after_change_quantity: ExpectedAny;
  note: string;
  sku_info: SkuInventoryDetail;
  object_type: string;
  uom_id: string;
};

type SkuInventoryDetail = {
  uom: string;
  media: string[];
  sku_id: string;
  bar_code: string;
  sku_code: string;
  sku_name: string;
  product_name: string;
  product_type: string;
};

type PendingCancelPurchaseOrder = {
  payment_source_id: string;
  payment_source_name: string;
  refund_amount: number;
  save_to_cashbook: boolean;
};

type PendingCreateInventoryPayment = {
  payment_method: string;
  payment_source_id: string;
  payment_source_name: string;
  amount: number;
  po_code: string;
  contact_id: string;
};
