type ConfirmInviteBody = {
  id: string;
  business_id: string;
  verify_status: string;
};

type StaffInfo = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  user_id: string;
  business_id: string;
  user_name: string;
  phone_number: string;
  avatar: string;
  verify_status: string;
  note: string;
  is_owner: boolean;
  roles: StaffRole[];
  has_direct_req_permission_key: boolean;
};

type StaffRole = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  business_id: string;
  role_id: string;
  user_has_business_id: string;
  role: RoleInfo;
};

type RoleInfo = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  business_id: string;
  name: string;
  description: string;
  is_default: boolean;
  staff: ExpectedAny;
};
