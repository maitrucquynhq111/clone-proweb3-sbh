// App configs
export const API_URI = process.env['API_URI'];
export const AUTH_URI = process.env['AUTH_URI'] || '/login';
export const SECRET_KEY = process.env['OTP_SECRET_KEY'] || '';
export const CLOUDFRONT_URI = process.env['CLOUDFRONT_URI'] || '';
export const SBH_FB_APP_ID = process.env['SBH_FB_APP_ID'] || '';
export const UPSELL_FB_APP_ID = process.env['UPSELL_FB_APP_ID'] || '';
export const SOCKET_URI = process.env['SOCKET_URI'] || '';
export const IS_UPSELL = process.env['IS_UPSELL'] || 'false';
export const ZALO_APP_ID = process.env['ZALO_APP_ID'] || 'false';
export const ZALO_SECRET_KEY = process.env['ZALO_SECRET_KEY'] || 'false';

// App localstorage keys
export const LOCALE_KEY = 'locale';
export const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';
export const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
export const FIRST_TIME_REDIRECT = 'FIRST_TIME_REDIRECT';
export const BUSINESS_KEY = 'BUSINESS';
export const BUSINESS_DOMAIN = 'BUSINESS_DOMAIN';
export const REACT_QUERY_OFFLINE_CACHE = 'REACT_QUERY_OFFLINE_CACHE';
export const USER_KEY = 'USER';
export const PENDING_ORDERS = 'PENDING_ORDERS';
export const SELECTED_ORDER = 'SELECTED_ORDER';
export const TABLE_COLUMNS = 'TABLE_COLUMNS';
export const CONFIRM_APPLY_INGREDIENTS = 'CONFIRM_APPLY_INGREDIENTS';
export const CONTACT_ANALYTIC_OPTIONS = 'CONTACT_ANALYTIC_OPTIONS';
export const FIRST_TIME_ECOMMERCE = 'FIRST_TIME_ECOMMERCE';
export const POS_MODE = 'POS_MODE';

// App constants default
export const DEFAULT_ORDER = 'DESC';
export const MINUTE = 60000;
export const RENEW_WINDOW_TIME = 3 * MINUTE;
export const REFRESH_TOKEN_BEFORE = 10 * 60000;
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const EXPIRE_PRO_TIME = 'EXPIRE_PRO_TIME';
export const MESSAGE_NOT_USER_PRO = 'Bạn chưa nâng cấp tài khoản SoBanHanng Pro';
export const PERMISSIONS = {
  DEFAULT: 'Chủ cửa hàng',
};

// App URLs default
export const LINK_DOWNLOAD_ANDROID = 'https://play.google.com/store/apps/details?id=me.finan.app';
export const LINK_DOWNLOAD_IOS = 'https://apps.apple.com/vn/app/s%E1%BB%95-b%C3%A1n-h%C3%A0ng/id1560099589';
export const USAGE_RULES = 'https://sobanhang.com/dieu-khoan-dich-vu/';
export const POLICY = 'https://sobanhang.com/chinh-sach-bao-mat/';
export const URL_EXCEL_ONLINE = 'https://view.officeapps.live.com/op/view.aspx?src=';

export const QR_OPEN_APP =
  'https://d3hr4eej8cfgwy.cloudfront.net/finan-prd/20962f85-88f9-49d9-938b-964e83ba11c3/image/f7f6975e-e065-47fe-b8e4-bf57135a0897.png';
export const DOWNLOAD_IOS_BUTTON =
  'https://d3hr4eej8cfgwy.cloudfront.net/finan-prd/20962f85-88f9-49d9-938b-964e83ba11c3/image/9d751109-65d3-46a2-8a16-b5e21f5998db.png';
export const DOWNLOAD_ANDROID_BUTTON =
  'https://d3hr4eej8cfgwy.cloudfront.net/finan-prd/20962f85-88f9-49d9-938b-964e83ba11c3/image/92737d66-2233-4bd7-a0f2-9f91eeb3c41a.png';

export const SUPPORT_CUSTOMER = 'https://app.sobanhang.com/chat/inbox/6760b49b-c70c-422c-9e89-b03104023149';
export const SUPPORT_COMMON_QUESTION = 'https://sobanhang.com/giai-dap-thac-mac';
export const FEEDBACK_FORM = 'https://forms.gle/xHfNiAQnDPbbBA8x7';
export const CHAT_SUPPORT = '6760b49b-c70c-422c-9e89-b03104023149';

export const MASS_UPLOAD_PRODUCT_FILE =
  'https://d3hr4eej8cfgwy.cloudfront.net/finan-prd/template/mau-tao-san-pham.xlsx';
export const MASS_UPLOAD_CONTACT_FILE =
  'https://d3hr4eej8cfgwy.cloudfront.net/finan-prd/template/upload-khach-hang.xlsx';
export const MASS_UPLOAD_INGREDIENTS_FILE =
  'https://d3hr4eej8cfgwy.cloudfront.net/finan-prd/template/mau-nguyen-vat-lieu.xlsx';

// App data empty
export const EMPTY_ARRAY = [];
export const RETAILCUSTOMER = {
  name: 'Khách lẻ',
  phone_number: '+84999988888',
};
export const ID_EMPTY = '00000000-0000-0000-0000-000000000000';

// App format default
export const numberFormat = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 4 });
