import {
  API_URI,
  ACCESS_TOKEN_KEY,
  BUSINESS_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
  BUSINESS_DOMAIN,
  ZALO_SECRET_KEY,
} from '~app/configs';
import { encrypt, fetchData, fetchDataZalo, post } from '~app/utils/helpers';

async function generateQRCode({ device_id }: { device_id: string }) {
  return await post<QRCodeChallenge>(`${API_URI}/finan-user/api/v1/auth/qr`, {
    device_id,
  });
}

async function getLoginInfo({ code }: { code: string }) {
  return await post<QRCodeInfo>(`${API_URI}/finan-user/api/v1/auth/qr/info`, {
    code,
  });
}

async function confirmQRCode(data: ConfirmQRCodeForm) {
  return await post<ConfirmQRCodeResult>(`${API_URI}/finan-user/api/v1/auth/qr/confirmation`, {
    ...data,
  });
}

async function generateOTP({ phone_number, device_id }: { phone_number: string; device_id: string }) {
  return await post<OTPChallenge>(`${API_URI}/finan-user/api/v1/auth/otp/generate`, {
    phone_number,
    platform: 'pro_web',
    device_id: device_id,
    secret_key: generateSecretKey(phone_number),
  });
}

async function getZaloToken({
  app_id,
  code,
  code_verifier,
  grant_type,
}: {
  app_id: string;
  code: string;
  code_verifier: string;
  grant_type: string;
}) {
  return await fetchDataZalo('https://oauth.zaloapp.com/v4/oa/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      secret_key: ZALO_SECRET_KEY,
    },
    body: new URLSearchParams(
      Object.entries({
        app_id,
        code,
        code_verifier,
        grant_type,
      }),
    ).toString(),
  });
}

async function verifyOTP({
  phone_number,
  otp,
  otp_record,
  device_id,
}: {
  phone_number: string;
  otp: string;
  otp_record: string;
  device_id: string;
}) {
  return await post<VerifyOTPResult>(`${API_URI}/finan-user/api/v1/auth/otp/confirm`, {
    phone_number,
    otp,
    device_id,
    platform: 'pro_web',
    remember_me: true,
    secret_key: generateSecretKey(otp_record),
  });
}

async function switchBusiness(business_id: string) {
  return await post<SwitchBusiness>(
    `${API_URI}/finan-business/api/v1/user-has-business/switch`,
    { business_id: business_id },
    { authorization: true },
  );
}

async function getBusinessById(id: string) {
  return await fetchData<Business>(`${API_URI}/finan-business/api/v3/business/get-one/${id}`, {
    authorization: true,
  });
}

async function logout() {
  return await fetchData<string>(`${API_URI}/ms-user-management/api/logout`, {
    authorization: true,
  });
}

async function renewToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    throw new Error('NO_REFRESH_TOKEN');
  }

  const { token } = await fetchData<{ token: string }>(`${API_URI}/finan-user/api/v1/auth/renew-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  return token;
}

async function getUserInfo() {
  return await fetchData<AuthInfo>(`${API_URI}/finan-user/api/v2/auth/info`, {
    authorization: true,
  });
}

async function getAccessToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    return false;
  }

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!accessToken) {
    return false;
  }

  return accessToken;
}

function getBusinessId() {
  return localStorage.getItem(BUSINESS_KEY);
}

function getBusinessDomain() {
  return localStorage.getItem(BUSINESS_DOMAIN);
}

async function getUserId() {
  return localStorage.getItem(USER_KEY);
}

function generateSecretKey(data: string) {
  const timeStamp = Math.floor(Date.now() / 1000);
  return encrypt(`${data}|${timeStamp}`);
}

const AuthService = {
  generateQRCode,
  getLoginInfo,
  confirmQRCode,
  generateOTP,
  verifyOTP,
  getUserInfo,
  getAccessToken,
  renewToken,
  getBusinessId,
  getBusinessDomain,
  getUserId,
  getBusinessById,
  switchBusiness,
  logout,
  getZaloToken,
};

export default AuthService;
