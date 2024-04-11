type Contact = {
  name: string;
  phone_number: string;
  address: string;
  address_info: AddressInfo | null;
  avatar: string;
  business_has_contact_id: string;
  business_has_shop_id: string;
  business_id: string;
  created_at: string;
  creator_id: string;
  debt_amount: number | null;
  option: string;
  state?: number;
  deleted_at: number;
  email: string;
  favorite_time: null;
  id: string;
  is_expired: false;
  latest_sync_time: string;
  name: string;
  phone_number: string;
  secret_key: string;
  seller_id: string;
  social_avatar: string;
  source_key: string;
  updated_at: number;
  updater_id: string;
  total_quantity_order: number;
  total_amount_order: number;
  total_return_order: number;
  total_amount_in: number;
  customer_point: number;
  birthday: string;
  gender: string;
  contact_groups: Array<GroupInContact>;
  contact_tag: Array<ContactLabel>;
  most_order_product: MostOrderProduct[];
  reminder_day?: string | null;
  last_order?: LastOrder;
  total_amount_order?: number;
} & ISyncRecord;

type MostOrderProduct = {
  sku_id: string;
  product_name: string;
  product_images: string[];
  sku_code: string;
  count: number;
};

type LastOrder = {
  id: string;
  order_number: string;
  contact_id: string;
  created_at: string;
};

type DetailContactParam = {
  id: string;
  business_id: string;
};

type Note = {
  contact_id: string;
  note: string;
  day: string;
} & ISyncRecord;

type PendingNote = Pick<Note, 'contact_id' | 'note'> & {
  day: string;
};

type PendingNoteUpdate = Pick<Note, 'contact_id' | 'note' | 'id'> & {
  day: string;
  created_at?: string;
};

type ContactTransaction = {
  transaction_type: string;
  payment_method: string;
  payment_source_id?: string;
  payment_source_name?: string;
  payment_information: string;
  amount: number;
  currency: string;
  is_pay_transaction: boolean;
  contact_id: string;
  business_id: string;
  images: string[];
  start_time: string;
  end_time: string;
  description: string;
  cash_in_hand: number;
  status: string;
  key: string;
  business_has_shop_id: string;
  ecom_transaction_id: string;
  two_way_status: string;
  object_key: string;
  object_type: string;
  is_debit?: boolean;
  reminder_debt_amount: number;
  contact: TransactionContact;
} & ISyncRecord;

type PendingContactTransaction = Pick<
  ContactTransaction,
  'amount' | 'transaction_type' | 'business_id' | 'contact_id' | 'currency' | 'payment_method' | 'description'
> & {
  payment_information: null;
  contact_name?: string;
  contact_phone?: string;
  contact_avatar?: string;
  images: Array<string | PendingUploadImage>;
  start_time: Date | string | null;
  end_time: Date | string | null;
  action: string;
  contact?: TransactionContact;
  reminder_day: Date | string | null;
  object_key?: string;
  object_type?: string;
  option?: string;
  is_pay_transaction?: boolean;
  payment_source_id?: string;
  payment_source_name?: string;
};

type TransactionContact = {
  debt_amount: number;
  delete_at: string;
  id: string;
  latest_sync_time: string;
  name: string;
  phone_number: string;
  reminder_day: string;
  secrete_key: string;
};

type DebtReminderContact = {
  debt_amount: number;
  name: string;
  phone_number: string;
  reminder_day: string;
  avatar: string;
  contact_id: string;
  social_avatar: string;
  transaction_type: string;
};

type OrderContact = {
  business_id: string;
  contact_id: string;
  order_number: string;
  grand_total: number;
  state: string;
  order_item: orderItem[];
} & ISyncRecord;

type PendingContact = Pick<Contact, 'name' | 'phone_number'> & {
  address_info: AddressInfo | null;
  birthday?: string;
  gender?: string;
  group_of_contact_ids?: Array<string>;
  tags?: Array<string>;
};

type orderItem = {
  product_name: string;
  sku_id: string;
  quantity: number;
};

type PendingTransaction = Pick<ContactTransaction, 'business_id' | 'contact_id'> & {
  amount: amount;
  currency: string;
  start_time: string | null;
  description: string;
  transaction_type: string;
  images: [];
  is_pay_transaction: boolean;
};

type PendingContact = Pick<
  Contact,
  'name' | 'phone_number' | 'address' | 'birthday' | 'gender' | 'email' | 'contact_groups'
> & {
  address_info: PendingAddressLocation | null;
  group_of_contact_ids: string[];
};

type AddressLocation = {
  area: string;
  full_id: string;
  full_name: string;
  id: string;
  latest_check: string;
  latitude: number;
  legacy_id: string;
  loc_lvl: number;
  longitude: number;
  name: string;
  parent_short_id: string;
  short_id: string;
  short_name: string;
  parent_tree: ParentLocation[];
  loc_lvl: number;
};

type ParentLocation = {
  id: string;
  short_id: string;
  name: string;
  full_name: string;
  loc_lvl: number;
  parent_short_id: string;
  full_name_uncent: string;
  priority: number;
};

type PendingAddressLocation = {
  province_id: string;
  province_name: string;
  district_id: string;
  district_name: string;
  ward_id: string;
  ward_name: string;
  address: string;
};

type PendingContactGroup = {
  name: string;
  code: string;
  contact_ids: Array<string>;
};

type TransactionContact = {
  count_transaction: number;
  created_day: string;
  sum_in: number;
  sum_out: number | null;
};

type CustomerPointHistory = {
  business_id: string;
  contact_id: string;
  created_at: string;
  creator_id: string;
  id: string;
  money: number;
  order_id: string;
  order_number: string;
  point: number;
  type: string;
  updated_at: string;
  updater_id: string;
  source: string;
  staff_info: {
    phone_number: string;
    staff_id: string;
    staff_name: string;
  };
};

type ContactTracking = {
  debt_amount: number;
  id: string;
  order_tracking: Array<{
    contact_id: string;
    order_number: string;
    state: string;
  }> | null;
};

type AddressInfo = {
  province_id: string;
  province_name: string;
  district_id: string;
  district_name: string;
  ward_id: string;
  ward_name: string;
  address: string;
};

type ContactGroup = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  code: string;
  number_of_contact: number;
  total_amount_in: number;
  total_amount_out: number;
  business_id: string;
  business: Business;
  setting?: ContactGroupSetting;
  contacts: Contact[] | null;
  business: Business;
};

type GroupInContact = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  code: string;
  number_of_contact: number;
  business_id: string;
};

type ContactLabel = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  business_id: string;
  type: string;
};

type PendingContactLabel = {
  name: string;
  id?: string;
};

type CommitMassUploadContactBody = {
  file_name: string;
  file_name_origin: string;
  file_type: string;
  limit: number;
  link: string;
};

type ContactDeliveringAddress = {
  id: string;
  name: string;
  phone_number: string;
  address_info: AddressInfo;
  is_default: boolean;
};

type ContactDeliveringAddressBody = Omit<ContactDeliveringAddress, 'id'>;

type ContactAnalytic = {
  contact_last_create: ContactAnalyticItem;
  contact_back: ContactAnalyticItem;
  amount_in: ContactAnalyticItem;
  amount_out: ContactAnalyticItem;
  customer_point: ContactAnalyticItem;
  order: ContactAnalyticItem;
};

type ContactAnalyticItem = {
  total_amount: number;
  total_count: number;
  contact_ids: string;
};

type CreateContactInChatBody = {
  address_info: AddressInfo;
  name: string;
  phone_number: string;
  sender_id: string;
  sender_type: string;
  source_key: string;
  avatar: string;
};

type PedingCustomerPoint = {
  id: string;
  customer_point: number;
};

type ParamsFetchContact = {
  contact_id: string;
  page: number;
  page_size: number;
};

type SyncContactChatBody = {
  avatar?: string;
  contact_id: string;
  sender_id: string;
  sender_type: string;
};

type ActivityHistory = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  object_id: string;
  object_type: string;
  contact_id: string;
  content: string;
  time: string;
};

type ContactGroupAttribute = {
  attribute: string;
  attribute_type: string;
  name: string;
  conditions: ContactGroupCondition[];
  sub_conditions?: ContactGroupCondition[];
};

type ContactGroupCondition = {
  operator: string;
  condition: string;
  name: string;
  value?: string;
  value_type?: string;
  can_add_value?: boolean;
};

type ContactGroupSettingCondition = {
  id?: string;
  attribute: string;
  operator: string;
  sub_condition?: ContactGroupSettingCondition;
  value: string;
  value_type: string;
};

type ContactGroupSetting = {
  id: string;
  group_of_contact_id: string;
  conditions?: ContactGroupSettingCondition[] | null;
};

type PendingContactGroupCondition = {
  id?: string;
  attribute: string;
  operator: string;
  condition?: string;
  conditions?: ContactGroupCondition[];
  sub_condition?: PendingContactGroupCondition;
  sub_conditions?: ContactGroupCondition[];
  can_add_value?: boolean;
  value?: string;
  value_type?: string;
};

type PendingContactGroupSetting = {
  id?: string;
  name: string;
  conditions: PendingContactGroupCondition[];
  number_of_contact?: number;
  contact?: Contact[];
};

type UpdateContactGroupSettingBody = {
  group_of_contact_id: string;
  conditions: ContactGroupSettingCondition[];
};
