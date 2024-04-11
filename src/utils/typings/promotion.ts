/* eslint-disable @typescript-eslint/no-unused-vars */
type Promotion = {
  id: string;
  name: string;
  type: string;
  description: string;
  is_active: boolean;
  business_id: string;
  created_at: string;
  creator_id: string;
  current_size: number;
  deleted_at: string | null;
  end_time: string | null;
  is_public: boolean;
  max_price_discount: number;
  max_size: number;
  max_size_per_user: number;
  min_order_price: number;
  promotion_code: string;
  start_time: string | null;
  updated_at: number;
  updater_id: string;
  value: number;
} & ISyncRecord;

type ProcessPromotion = {
  value_discount: number;
} & Promotion;

type ParamsProcessPromotion = {
  promotion_code: string;
  grand_total: number;
};
