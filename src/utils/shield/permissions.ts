export enum ProductPermission {
  PRODUCT_PRODUCTLIST_VIEW = 'product_productlist_view',
  PRODUCT_PRODUCTLIST_CREATE = 'product_productlist_create',
  PRODUCT_PRODUCTDETAIL_VIEW = 'product_productdetail_view',
  PRODUCT_PRODUCTDETAIL_UPDATE = 'product_productdetail_update',
  PRODUCT_PRODUCTDETAIL_DELETE = 'product_productdetail_delete',
  PRODUCT_PRODUCTSETTINGS_ALL_VIEW = 'product_productsettings_all_view',
  PRODUCT_CATEGORY_ALL_VIEW = 'product_category_all_view',
  PRODUCT_ADDON_ALL_VIEW = 'product_addon_all_view',
  PRODUCT_PRODUCTDETAIL_INVENTORY_VIEW = 'product_productdetail_inventory_view', // Cập nhật tồn kho
  PRODUCT_PRODUCTDETAIL_COGS_VIEW = 'product_productdetail_cogs_view', // Giá vốn, giá nhập
}

export enum OrderPermission {
  ORDER_CART_CREATE = 'order_cart_create',
  ORDER_CART_UPDATE = 'order_cart_update', // Màn hình chỉnh sửa hóa đơn trên app
  ORDER_CARTSETTINGS_ALL_VIEW = 'order_cartsettings_all_view',
  ORDER_CART_COMPLETE = 'order_cart_complete',
  ORDER_ORDERLIST_VIEW = 'order_orderlist_view',
  ORDER_ORDERLIST_VIEW_ONLY = 'order_orderlist_view_only',
  ORDER_ORDERDETAIL_UPDATE = 'order_orderdetail_update',
  ORDER_ORDERDETAIL_CANCEL = 'order_orderdetail_cancel',
  ORDER_ORDERDETAIL_COMPLETE = 'order_orderdetail_complete',
  ORDER_ORDERDETAIL_DELETE = 'order_orderdetail_delete',
  ORDER_ORDERDETAIL_DEBT_VIEW = 'order_orderdetail_debt_view',
  ORDER_RETURNORDER_ALL_VIEW = 'order_returnorder_all_view',
  ORDER_ORDERDETAIL_PRINT_ALL_VIEW = 'order_orderdetail_print_all_view',
  ORDER_INVOICE_COGS_ALL_VIEW = 'order_invoice_cogs_all_view', // Chỉnh sửa chi tiết đơn
  ORDER_ORDERDETAIL_PRICE_UPDATE = 'order_orderdetail_price_update', // Chỉnh sửa giá sp trong đơn
}

export enum TablePermission {
  TABLE_TABLELIST_VIEW = 'table_tablelist_view',
  TABLE_TABLELIST_CREATE = 'table_tablelist_create',
  TABLE_TABLELIST_UPDATE = 'table_tablelist_update',
  TABLE_TABLELIST_DELETE = 'table_tablelist_delete',
  TABLE_RESERVATION_ALL_VIEW = 'table_reservation_all_view', // Màn hình đặt bàn trên app
}

export enum InventoryPermission {
  INVENTORY_PRODUCTLIST_VIEW = 'inventory_productlist_view', // Xem danh sách sản phẩm/nguyên vật liệu
  INVENTORY_PURCHASEORDER_VIEW = 'inventory_purchaseorder_view', // Sổ kho
  INVENTORY_PURCHASEORDER_CREATE = 'inventory_purchaseorder_create', // Tạo phiếu nhập hàng
  INVENTORY_PURCHASEORDER_PAYMENT_VIEW = 'inventory_purchaseorder_payment_view', // Thanh toán phiếu nhập hàng
  INVENTORY_PURCHASEORDER_DELETE = 'inventory_purchaseorder_delete', // Hủy phiếu nhập hàng
  INVENTORY_ADJUSTMENT_CREATE = 'inventory_adjustment_create', // Kiểm kho
  INVENTORY_STAMP_ALL_VIEW = 'inventory_stamp_all_view', // In Tem mã vạch
  INVENTORY_IMPORT_INGREDIENT_CREATE = 'inventory_import_ingredient_create', // Nhập nguyên vật liệu
  INVENTORY_OUTBOUND_CREATE = 'inventory_outbound_create', // Tạo phiếu xuất hàng
  INVENTORY_OUTBOUND_CANCEL = 'inventory_outbound_cancel', // Hủy phiếu xuất hàng
  INVENTORY_PURCHASEORDER_PRINT = 'inventory_purchaseorder_print', // In phiếu kho
}

export enum CustomerPermission {
  CUSTOMER_CUSTOMERLIST_VIEW = 'customer_customerlist_view',
  CUSTOMER_CUSTOMERLIST_CREATE = 'customer_customerlist_create',
  CUSTOMER_LOYALTY_CONFIG_UPDATE = 'customer_loyalty_config_update',
  CUSTOMER_LOYALTY_VIEW = 'customer_loyalty_view',
  CUSTOMER_LOYALTY_UPDATE = 'customer_loyalty_update',
  CUSTOMER_CHAT_ALL_VIEW = 'customer_chat_all_view',
  CUSTOMER_SETTING_CHAT_VIEW = 'customer_setting_chat_view',
  CUSTOMER_CONNECT_FANPAGE_VIEW = 'customer_connect_fanpage_view',
}

export enum MoneyPermission {
  MONEY_SOURCE_VIEW = 'money_source_view',
  MONEY_SOURCE_CREATE = 'money_source_create',
  MONEY_SOURCE_UPDATE = 'money_source_update',
  MONEY_SOURCE_DELETE = 'money_source_delete',
}

export enum ConfigPermission {
  SBH_ASSISTANT_CHAT_VIEW = 'sbh_assistant_chat_view',
  SBH_SUPPORTER_CHAT_VIEW = 'sbh_supporter_chat_view',
}

export enum IngredientPermission {
  INGREDIENT_LIST_VIEW = 'ingredient_list_view',
  INGREDIENT_DETAIL_VIEW = 'ingredient_detail_view',
  INGREDIENT_CREATE = 'ingredient_create',
  INGREDIENT_UPDATE = 'ingredient_update',
  INGREDIENT_DELETE = 'ingredient_delete',
}

export enum FormulaPermission {
  FORMULA_CREATE = 'formula_create',
  FORMULA_DELETE = 'formula_delete',
  FORMULA_UPDATE = 'formula_update',
  FORMULA_VIEW = 'formula_view',
}

export enum NotiPermission {
  NOTI_VIEW = 'noti_view',
  NOTI_ORDER_VIEW = 'noti_order_view',
  NOTI_FINANCE_VIEW = 'noti_finance_view',
}

export enum CashbookPermission {
  CASHBOOK_LIST_ALL_VIEW = 'cashbook_list_all_view',
  CASHBOOK_LIST_VIEW_ONLYME = 'cashbook_list_view_onlyme',
}

export enum ReportPermission {
  REPORT_PNL_VIEW = 'report_pnl_view',
  REPORT_STORE_VIEW = 'report_store_view',
  REPORT_WAREHOUSE_VIEW = 'report_warehouse_view',
  REPORT_CASHBOOK_VIEW = 'report_cashbook_view',
}

export enum OnlinePermission {
  ONLINE_STORE_ALL_VIEW = 'online_store_all_view',
  ONLINE_SHOPEE_CONNECT_ALL_VIEW = 'online_shopee_connect_all_view',
  ONLINE_SHOPEE_PRODUCT_ALL_VIEW = 'online_shopee_product_all_view',
}

export enum OtherPermision {
  PROMOTION_ALL_VIEW = 'promotion_all_view',
  DEBT_LIST_ALL_VIEW = 'debt_list_all_view',
  STORE_SETTINGS_ALL_VIEW = 'store_settings_all_view',
  STAFF_ALL_VIEW = 'staff_all_view',
  BANK_ACCOUNT_ALL_VIEW = 'bank_account_all_view',
  RATING_APP_CREATE = 'rating_app_create',
  GUIDE_SELL_VIEW = 'guide_sell_view',
  COMMUNITY_CHAT_VIEW = 'community_chat_view',
  WHOLESALES_MARKET_VIEW = 'wholesales_market_view',
  WHOLESALES_MARKET_CREATE = 'wholesales_market_create',
  USER_QUICKCASH_ALL_VIEW = 'user_quickcash_all_view',
  PERMISSION_ALL_VIEW = 'permission_all_view',
  CUSTOMER_CUSTOMERDETAIL_DELETE = 'customer_customerdetail_delete',
  SHIFT_MANAGE_ALL_VIEW = 'shift_manage_all_view',
  COMMISSION_ALL_VIEW = 'comission_all_view',
}
