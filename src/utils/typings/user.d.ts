type User = {
  permissions: Array<string>;
};

type UserInfo = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  full_name: string;
  is_active: boolean;
  phone_number: string;
  birthday: Date;
  avatar: string;
  last_login: Date;
  count_sent_free_sms: number;
  uid_firebase: string;
  last_inactive_time: Date;
  user_roles: number;
  fresh_desk_id: string;
  count_change_domain: number;
  maximum_free_sms: number;
  is_anonymous: boolean;
};

type Business = {
  address: string;
  avatar: string;
  background: string[];
  business_type: BusinessType[];
  business_utilities: BusinessUtility[];
  category_business_id?: string | null;
  close_time: string;
  count_change_domain: number;
  created_at: Date;
  creator_id: string;
  custom_fields: CustomFields;
  deleted_at?: Date | null;
  delivery_fee: number;
  description: string;
  district_id: string;
  domain: string;
  geo: string;
  id: string;
  identity_card: string;
  is_close: boolean;
  latitude: number;
  longitude: number;
  min_price_free_ship: number;
  name: string;
  open_time: string;
  phone_number: string;
  province_id: string;
  status: string;
  updated_at: Date;
  updater_id: string;
  ward_id: string;
  customer_point_ratio: number;
  is_customer_point: boolean;
  summary: Record<SummaryName, SummaryFields>;
};

type BussinessShorten = {
  avatar: string;
  business_id: string;
  expire_time: string;
  id: string;
  is_default: boolean;
  is_owner: boolean;
  owner_id: string;
  phone_number: string;
  user_name: string;
};

type ShortenBusiness = {
  avatar: string;
  business_id: string;
  expire_time: string;
  id: string;
  is_default: boolean;
  is_owner: boolean;
  owner_id: string;
  phone_number: string;
  user_name: string;
};

type BusinessUtility = {
  description: string;
  json_value: JsonValue2;
  name: string;
  object_id: string;
  taxonomy: string;
  term_taxonomy_id: string;
  value: string;
};

type BusinessType = {
  description: string;
  json_value: JsonValue;
  name: string;
  object_id: string;
  taxonomy: string;
  term_taxonomy_id: string;
  value: string;
};

type SummaryName =
  | 'order_delivering'
  | 'order_waiting_confirm'
  | 'order_unpaid'
  | 'total_product_out_stock'
  | 'total_product_low_stock'
  | 'total_contact_have_reminder'
  | 'total_contact_not_reminder'
  | 'total_amount_in';

type SummaryFields = { count: number; deep_link: string };

type CustomFields = {
  business_revenue: string;
  customer_count: string;
  order_cancel_count: string;
  order_complete_count: string;
  order_delivering_count: string;
  order_waiting_confirm_count: string;
  product_count: string;
  promotion_count: string;
};

type UserLocation = {
  latitude: number;
  longitude: number;
};

type UserRole = {
  business_id: string;
  created_at: string;
  creator_id: string;
  deleted_at: string;
  description: string;
  id: string;
  is_owner: true;
  permission_keys: Array<string>;
  role_name: string;
  updated_at: string;
  updater_id: string;
};

type HistoryRegistrationPro = {
  user_id: string;
  status: string;
  expire_time: string | null;
  start_time: string | null;
  transaction_code: string;
  content: string;
  payment_method: string;
  remind_renew: boolean;
  payment_amount: number;
  note: string;
  payment_type: string;
  package_key: string;
  package_price: PackagePrice;
};
