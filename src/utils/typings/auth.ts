/* eslint-disable @typescript-eslint/no-unused-vars */
type OTPChallenge = {
  otp_record: string;
  time_life: string;
  status: string;
};

type QRCodeChallenge = {
  code: string;
  link: string;
  media: string;
};

type QRCodeInfo = {
  avatar: string;
  full_name: string;
  phone_number: string;
};

type ConfirmQRCodeForm = {
  app_version: string;
  code: string;
  device_id: string;
  device_name: string;
  location: string;
  operating_system: string;
  platform_key: string;
};

type ConfirmQRCodeResult = {
  business_info: {
    count_owner_business: number;
    current_business: Business;
    current_role: UserRole;
    list_business: Array<BussinessShorten>;
  };
  history_registration_pro: {
    expire_time: string;
  };
  token: string;
  refresh_token: string;
  status: string;
  user_info: UserInfo;
};

type VerifyOTPResult = {
  status: 'success' | 'wrong_otp';
  refresh_token: string;
  token: string;
  user_info: UserInfo;
  business_info: {
    current_business: Business;
    list_business: Business[];
  };
  history_registration_pro: {
    expire_time: string;
  };
};

type SwitchBusiness = {
  refresh_token: string;
  token: string;
  current_business: Business;
};

type AuthInfo = {
  user_info: UserInfo;
  business_info: {
    current_business: Business;
    current_role: CurrentRole;
    list_business: ShortenBusiness[];
  };
  history_registration_pro: HistoryRegistrationPro;
};

type CurrentRole = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role_name: string;
  description: string;
  business_id: string;
  is_owner: boolean;
  permission_keys: string[];
};
