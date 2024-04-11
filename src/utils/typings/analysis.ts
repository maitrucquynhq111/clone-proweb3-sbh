/* eslint-disable @typescript-eslint/no-unused-vars */
type PNLOverview = {
  cost_total: number;
  detail_sales: {
    sum_grand_total: number;
    sum_ordered_grand_total: number;
    sum_promotion_discount: number;
    sum_delivery_fee: number;
    sum_other_discount: number;
  };
  profit_total: number;
  sum_expense: number;
  sum_grand_total: number;
  transaction_in: null;
  transaction_in_accept: null;
  transaction_out: null;
  transaction_out_accept: null;
};

type PNLList = {
  business_id: string;
  product_images: string[];
  product_name: string;
  profit: number;
  sku_code: string;
  sku_id: string;
  sku_name: string;
  total_historical_cost: number;
  total_price: number;
  total_quantity: number;
  created_at: string;
  order_id: string;
  order_number: string;
  contact_id: string;
  customer_name: string;
  phone_number: string;
  staff_id: string;
  staff_name: string;
};

type ShopAnalysis = {
  id: number;
  amount: number;
  last_period_amount: number;
  type: string;
  data: {
    offline_sell: number;
    online_sell: number;
  };
};

type InventoryAnalysis = {
  compare_po_with_last_period: number;
  estimated_inventory_date: number;
  inventory_change: number;
  total_po_in: number;
  total_po_out: number;
  total_po_categories: [
    {
      id: string;
      name: string;
      rate: number;
      total_amount: number;
    },
  ];
  chart_data_details: ChartData[];
};

type ChartData = {
  index: number;
  last_period_value: number | null;
  time: string;
  value: number | null;
};

type PaymentSourceOverview = {
  amount_begin: number;
  amount_end: number;
  amount_transaction: number;
  id: string;
  name: string;
  total_in: number;
  total_in_out: number;
  total_out: number;
};
