type CategoryStatistic = {
  count_product: number;
};

type PendingProductCategory = {
  name: string;
  priority?: number;
};

type Category = {
  id: string;
  name: string;
} & CategoryStatistic &
  ISyncRecord;

type IDraft = { requestId: string };

type WritableCategory = Omit<Category, 'updated_at'> & IDraft;
type CategoryDraft = WritableCategory & IDraft;

type PendingSku = Pick<
  Sku,
  | 'id'
  | 'name'
  | 'barcode'
  | 'sku_code'
  | 'normal_price'
  | 'selling_price'
  | 'historical_cost'
  | 'wholesale_price'
  | 'total_quantity'
  // | 'can_pick_quantity'
  // | 'po_details'
  | 'is_active'
  | 'sku_type'
> & {
  business_id: string;
  uom: string;
  po_details?: PoDetail;
  media: Array<string | PendingUploadImage>;
  can_pick_quantity?: number;
  client_id?: string;
  range_wholesale_price?: Array<RangeWholesalePrice>;
  attribute_types?: SkuAttribute[];
  hide_sku?: boolean;
  recipe: PendingSkuHasIngredient[];
};

type PendingProduct = Pick<
  Product,
  | 'id'
  | 'client_id'
  | 'name'
  | 'description'
  | 'uom'
  | 'is_active'
  | 'priority'
  | 'description_rtf'
  | 'product_type'
  | 'show_price'
  | 'show_on_store'
> & {
  sku_code: string;
  barcode: string;
  category: Array<string>;
  skus: Array<PendingSku>;
  is_advance_stock: boolean;
  is_variant: boolean;
  images: Array<string | PendingUploadImage>;
  tag_id: string;
  product_add_on_group_ids: Array<string>;
  sku_attributes?: PendingSkuAttribute[];
  list_variant?: Array<PendingProductVariant>;
  has_ingredient: boolean;
};

type ProductDraft = PendingProduct & IDraft;

type Product = {
  id: string;
  business_id: string;
  name: string;
  type: string;
  description: string;
  description_rtf: string;
  product_code: string;
  uom: string;
  images: Array<string>;
  category: Array<Category>;
  list_sku: Array<Sku>;
  product_type: string;
  is_active: boolean;
  priority: number;
  sold_quantity: number;
  count_variant: number;
  min_price: number;
  max_price: number;
  can_pick_quantity: number;
  seo_url: string;
  tag_info: LabelProduct;
  list_product_add_on_group: Array<ProductAddOnGroup>;
  list_variant?: Array<ProductVariant>;
  show_price: boolean;
  show_on_store: boolean;
  has_ingredient: boolean;
} & ISyncRecord &
  IPending;

type Sku = {
  id: string;
  sku_code: string;
  barcode: string;
  name: string;
  can_pick_quantity: number;
  total_quantity: number;
  normal_price: number;
  selling_price: number;
  historical_cost: number | null;
  wholesale_price: number;
  range_wholesale_price: Array<RangeWholesalePrice>;
  list_attribute: ProductSkuAttribute[];
  media: Array<string>;
  is_active: boolean;
  po_details: PoDetail;
  product_name: string;
  product_id?: string;
  type?: string;
  sku_type: string;
  uom: string;
  business_id: string;
  hide_sku?: boolean;
  product?: Product;
  has_ingredient: boolean;
  recipe: RecipeSku[];
};

type RecipeSku = {
  id: string;
  sku_id: string;
  business_id: string;
  quantity: number;
  uom_id: string;
  uom_name: string;
  ingredient_id: string;
  ingredient_name: string;
  price: number;
  ingredient_uom_id: string;
};

type SkuSelected = SkuInventory & { quantity: number };

type ProductSkuAttribute = {
  attribute_id: string;
  sku_id: string;
  name: string;
  priority: number;
};

type RangeWholesalePrice = {
  id?: string;
  sku_id: string;
  name?: string;
  error?: {
    [key: string]: string;
  };
  min_quantity: number;
  price: number;
};

type SkuBarcodePrinting = Sku & {
  product_name: string;
  product_type: string;
  quantity: number;
};

type SkuMixed = {
  product_id: string;
  product_name: string;
  product_images: Array<string>;
  product_type: string;
  type: string;
  value: number;
  quantity: number;
} & Sku;

type skuPos = Sku & {
  product_id: string;
  product_name: string;
  sold_quantity: number;
  product_images: string[];
  sort_price: number;
  product_type: string;
  list_product_add_on_group: Array<ProductAddOnGroup>;
};

type SkuInventorySearch = Sku & {
  product_id: string;
  product_name: string;
  sold_quantity: number;
  product_type: string;
  disabled: boolean;
};

type SkuOrderDetailSearch = Sku & {
  product_id: string;
  product_name: string;
  sold_quantity: number;
  disabled: boolean;
  list_product_add_on_group: Array<ProductAddOnGroup>;
};

type SkuInventory = {
  barcode: string;
  business_id: string;
  can_pick_quantity: number;
  created_at: string;
  creator_id: string;
  delivering_quantity: number;
  historical_cost: number;
  id: string;
  is_active: boolean;
  media: string[] | null;
  name: string;
  normal_price: number;
  product_id: string;
  product_name: string;
  product_type: string;
  selling_price: number;
  sku_code: string;
  sku_name: string;
  sku_type: string;
  total_quantity: number;
  inventory_value: number;
  warning_value: number;
  type: string;
  updated_at: string;
  updater_id: string;
  variant_name: string;
  wholesale_price: number | null;
  uom: string;
};

type PendingSkuInventory = {
  po_details: {
    pricing: number;
    quantity: number;
    blocked_quantity: number;
    warning_value: number;
  };
} & SkuInventory;

type PoDetail = {
  pricing: number;
  quantity: number;
  note?: string;
  blocked_quantity: number;
  warning_value: number;
  delivering_quantity: number;
  sku_id?: string;
};

type ProductsOrder = 'created_at' | 'sold_quantity' | 'sort_price_asc' | 'sort_price_desc';

type CommitMassUploadBody = {
  file_name: string;
  file_name_origin: string;
  link: string;
  status: string;
  type: string;
};

type MassUpload = {
  amount_fail: number;
  amount_success: number;
  business_id: string;
  created_at: string;
  creator_id: string;
  deleted_at: string | null;
  detail_fail: null;
  file_name: string;
  id: string;
  link: string;
  file_name_origin: string;
  status: string;
  total_row: number;
  type: string;
  updated_at: string;
  updater_id: string;
};

type MassUploadFailed = {
  column: string;
  id: string;
  message: string;
  row: number;
};

type FastProduct = {
  name: string;
  descriptions: string;
  business_id: string;
  product_id?: string;
  images: Array<string>;
  priority: number;
  price: number;
  normal_price: number;
  selling_price: number;
  is_active: boolean;
  quantity: number;
  uom: string;
  total_amount: number;
  is_product_fast: boolean;
  historical_cost: number;
};

type PendingLabelProduct = {
  id?: string;
  name: string;
  color: string;
};

type LabelProduct = {
  id: string;
  name: string;
  color: string;
};

type ProductAddOnGroupSetting = {
  is_multiple_items: boolean;
  is_multiple_options: boolean;
  is_required: boolean;
};

type ProductAddOnGroup = {
  id: string;
  name: string;
  product_id?: string;
  list_product_add_on: Array<ProductAddOn>;
} & ProductAddOnGroupSetting;

type PendingProductAddOnGroup = ProductAddOnGroup & {
  product_ids_add: string[];
  product_ids_remove: string[];
  linked_products: Array<PendingLinkedProductsAddOn>;
};

type ProductAddOn = {
  historical_cost: number;
  id: string;
  is_active: boolean;
  name: string;
  price: number;
  priority?: number;
  product_add_on_group_id?: string;
  count_product?: number;
};

type AddOn = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  business_id: string;
  name: string;
  price: number;
  historical_cost: number;
  is_active: boolean;
  choose_alot: boolean;
  count_product: number;
  is_product: boolean;
};

type AddOnGroup = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  business_id: string;
  name: string;
  description: string;
  is_required: boolean;
  is_multiple_options: boolean;
  is_multiple_items: boolean;
  count_product_add_on: number;
  count_product: number;
  is_product: boolean;
};

type AddOnGroupDetail = AddOnGroup & {
  list_product_add_on: Array<ProductAddOn>;
};

type LinkedProductsAddOn = {
  id: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  business_id: string;
  product_name: string;
  images: Array<string>;
  min_price: number | null;
  max_price: number | null;
  normal_price: number | null;
  selling_price: number | null;
  is_product_add_on: boolean;
  product_type: string;
  count_variant: number;
};

type PendingLinkedProductsAddOn = LinkedProductsAddOn & {
  product_id: string;
};

type PendingAddOnGroup = {
  id: string;
  name: string;
  is_required: boolean;
  is_multiple_options: boolean;
  is_multiple_items: boolean;
  list_product_add_on: Array<ProductAddOn>;
  product_ids_add: Array<string>;
  product_ids_remove: Array<string>;
};

type PendingAddOn = {
  id?: string;
  name: string;
  is_active: boolean;
  historical_cost: number;
  price: number;
  priority: number;
  quantity: number;
  product_add_on_group_id: string;
};

type BarcodePrintingSetting = {
  pageSize: string;
  size: string;
  options: Array<{ id: string; value: boolean }>;
};

type ProductVariant = {
  id: string;
  key: string;
  name: string;
  priority: number;
  product_id: string;
  list_attribute: Array<ProductAttribute>;
};

type PendingProductVariant = {
  id?: string;
  name: string;
  list_attribute: Array<PendingProductAttribute>;
};

type PendingProductAttribute = {
  id?: string;
  name: string;
};

type ProductAttribute = {
  attribute_type_id: string;
  id: string;
  name: string;
};

type PendingSkuAttribute = {
  id: string;
  attribute_type: string;
  attribute: string[];
};

type SkuTableData = {
  [key: string]: string;
  normal_price: number | null;
  historical_cost: number | null;
  is_active: boolean | null;
  quantity: boolean | null;
} & Omit<PendingSku, 'historical_cost', 'normal_price', 'is_active', 'po_details'>;

type PendingFastProduct = {
  name: string;
  normal_price: number;
  historical_cost: number;
  quantity: number;
  save_product: boolean;
};

type PendingSoldOut = {
  sku_id: string;
  name: string;
  description: string;
  business_id: string;
  images: string[];
  selling_price: number;
  normal_price: number;
  uom: string;
  sku_code: string;
  barcode: string;
  is_active: boolean;
  po_details: PoDetailsSoldOut;
};

type PoDetailsSoldOut = {
  quantity: number;
  blocked_quantity: number;
  warning_value: number;
};

type Ingredient = {
  blocked_quantity: number;
  business_id: string;
  canceled_quantity: number;
  created_at: string;
  creator_id: string;
  deleted_at: string;
  id: string;
  name: string;
  price: number;
  total_quantity: number;
  uom: Uom;
  uom_id: string;
  updated_at: string;
  updater_id: string;
  warning_quantity: number;
  total_inventory: number;
  ingredient_id?: string;
};

type PendingIngredient = {
  id?: string;
  name: string;
  price: number;
  total_quantity: number;
  uom_id: string;
  warning_quantity: number;
};

type PendingSkuHasIngredient = {
  ingredient_id: string;
  quantity: number;
  uom_id: string;
  factor?: number;
} & Ingredient;

type Uom = {
  business_id: string;
  created_at: string;
  creator_id: string;
  deleted_at: string;
  id: string;
  is_default: boolean;
  is_standard: boolean;
  name: string;
  updated_at: string;
  updater_id: string;
  sub_uom?: SubUom;
};

type SubUom = {
  id: string;
  from_uom_id: string;
  to_uom_id: string;
  factor: number;
  name: string;
};

type UomSelect = {
  id: string;
  name: string;
  factor?: number;
};

type ProductAndSku = {
  product: Product;
  sku: Sku;
};
