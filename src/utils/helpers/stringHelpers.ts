import { matchPath } from 'react-router-dom';

export function formatCurrency(value: string | number) {
  const newValue = Math.round(Number(value)).toString();
  return `${newValue}`.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function currencyToString(value: string) {
  const newValue = value.replaceAll('.', '');
  return newValue;
}

export const parseBool = (b: string) => {
  return !/^(false|0)$/i.test(b) && !!b;
};

export const currencyFormat = (value: string) => {
  const sign = value.charAt(0);
  const formatNumber = `${value}`.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return sign === '-' ? `-${formatNumber}` : formatNumber;
};

export const normalizeString = (value: string) => {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const convertStringToObjectKey = (value: string) => {
  const normalizeValue = normalizeString(value).toLowerCase();
  return normalizeValue.split(' ').join('_');
};

export function formatPhoneWithZero(value: string) {
  return value ? value.replace('+84', '0') : '';
}

export function hidePhoneNumber(value: string) {
  return value.replaceAll(value.substring(4, 7), '***');
}

export function removeLastPath(value: string, index?: number) {
  const paths = value.split('/');
  if (index || paths?.length > 4) {
    paths.pop();
  }
  return paths.join('/');
}

export function getActivePath(path: string, pathname: string) {
  return path ? !!matchPath({ path: path, end: false }, pathname) : false;
}

export function noAccents(str: string) {
  if (!str) return '';
  str = str.toLocaleLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/gi, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/gi, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/gi, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/gi, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/gi, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/gi, 'y');
  str = str.replace(/đ/gi, 'd');
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/gi, '');
  str = str.replace(/\u02C6|\u0306|\u031B/gi, '');

  return str;
}
export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export function validatePhone(phone: string) {
  let phoneNumber = phone;
  phoneNumber = phoneNumber.replace(/\s/g, '');

  phoneNumber = formatPhone(phoneNumber);
  if (phoneNumber.length !== 12) return false;

  return true;
}

export function formatPhone(phone: string) {
  if (phone.length === 13) return phone;

  const validLength = /^0/g.test(phone) ? 10 : 9;
  let _phone = phone.replace(/^(\+84)|\D/g, '');
  _phone = _phone.substring(0, validLength);

  if (_phone.length !== validLength) return '';

  let res = phone.replaceAll(' ', '');
  res = res.replaceAll('-', '');
  if (!res) return '';

  if (res[0] === '+') return res;

  if (res[0] === '0') return `+84${res.slice(1)}`;

  if (res[0] === '8') return `+${res}`;

  return `+84${res}`;
}

export function acronymName(value: string) {
  return value
    .split(' ')
    .map((el) => el[0])
    .join('')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .toUpperCase();
}

export function getQueryParams(url: string) {
  if (!url) return;
  return (url.match(/([^?=&]+)(=([^&]*))/g) ?? ([] as ExpectedAny)).reduce((total: ExpectedAny, crr: ExpectedAny) => {
    const [key, value] = crr.split('=');
    total[key] = decodeURI(value);
    return total;
  }, {});
}

export function getLocaleCode() {
  const code = navigator?.language || navigator?.languages?.[0] || 'vi_VN';
  return code.replace('-', '_');
}
