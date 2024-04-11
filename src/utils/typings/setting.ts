/* eslint-disable @typescript-eslint/no-unused-vars */
type SettingDisplay = {
  id: string;
  json_value: Array<JsonValue>;
  name: string;
  object_id: string;
  object_type: string;
  setting_key: string;
  type: string;
};

type JsonValue = {
  key: string;
  active: ExpectedAny;
};

type BackupData = {
  business_id: string;
  created_at: string;
  creator_id: string;
  deleted_at: string | null;
  email: string;
  id: string;
  is_backup: boolean;
  option: null;
  updated_at: string;
  updater_id: string;
};

type BackupDataForm = {
  email: string;
  is_backup: boolean;
  option: string[];
};

type POSSettings = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  business_id: string;
  scan_code: boolean;
  whole_sale_price: boolean;
  delivery_later: boolean;
  quick_sell: boolean;
  pre_paid: boolean;
  money_safe: boolean;
  auto_print_order: boolean;
  preview_order: boolean;
  fnb_active: boolean;
};

type SubscriptionPlan = {
  packages: PackageSubPlan[];
  group_addons: GroupAddonSubPlan[];
  addons: AddonSubPlan[];
};

type PackageSubPlan = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  key: string;
  type: string;
  metadata: ExpectedAny | null;
  description: string;
  is_active: boolean;
  priority: number;
  package_has_addon: PackageHasAddon[];
  package_price: PackagePrice[];
};

type GroupAddonSubPlan = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  group_key: string;
  is_active: boolean;
};

type AddonSubPlan = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  key: string;
  description: string;
  is_show: boolean;
};

type PackageHasAddon = {
  id: string;
  created_at: string;
  updated_at: string;
  package_key: string;
  addon_feature_key: string;
  metadata: ExpectedAny;
  group_key: string;
  priority: number;
};

type PackagePrice = {
  id: string;
  created_at: string;
  updated_at: string;
  package_id: string;
  name: string;
  key: string;
  description: string;
  duration: number;
  duration_type: string;
  price: number;
  discount_price: number;
  is_active: boolean;
  platform: string[];
};
