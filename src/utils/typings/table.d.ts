type Table = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  business_id: string;
  title: string;
  description: string;
  priority: number;
  is_active: boolean;
  tables: TableItem[];
};

type TableItem = {
  id: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  business_id: string;
  sector_id: string;
  title: string;
  description: string;
  priority: number;
  status: string;
  is_active: boolean;
  reservation?: Reservation;
};

type Reservation = {
  id: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  table_id: string;
  order_id: string;
  customer_schedule_id: string | null;
  created_order_at: string;
  completed_order_at: string | null;
  canceled_order_at: string | null;
  noted: string;
  order_info: {
    total_item: number;
    total_price: number;
  };
};

type TableZone = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  business_id: string;
  title: string;
  description: string;
  priority: number;
  is_active: boolean;
  tables: null;
};

type PendingTable = {
  selectedZoneId: string;
  statusTableSelected: string[];
  searchValue: string;
};

type SelectedTable = {
  is_change_table: boolean;
  order_id: string;
  sector_id: string;
  sector_name: string;
  table_id: string;
  table_name: string;
  customer_schedule_id: string;
};

type KitchenTicketItemInfo = {
  uom: string;
  sku_id: string;
  status: string;
  quantity: number;
  sku_code: string;
  sku_name: string;
  item_note: string;
  product_id: string;
  category_id: string;
  product_name: string;
  order_item_addon: Array<{
    name: string;
    quantity: number;
    addon_note: string;
    product_add_on_id: string;
  }> | null;
};

type KitchenTicketItem = {
  id: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  business_id: string;
  order_id: string;
  order_number: string;
  delivery_method: string;
  order_change_info: Array<KitchenTicketItemInfo>;
};

type KitchenTicket = {
  kitchen_ticket: Array<KitchenTicketItem>;
  sector_name: string;
  table_name: string;
};
