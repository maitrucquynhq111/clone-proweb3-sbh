/* eslint-disable no-useless-escape */
export const currencyRegex = /^[0-9]+([,.][0-9]+)?$/;
export const phoneNumberRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/g;
export const quickMessageCodeRegex = /\[(Tên khách hàng|Số điện thoại|Danh xưng|Tên trang\/cửa hàng)\]/g;
export const numberRegex = /^[0-9]*$/;
export const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
