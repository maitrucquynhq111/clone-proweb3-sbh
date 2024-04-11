import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Language } from './enums';
import { LOCALE_KEY } from '~app/configs';

const ns = [
  'header-button',
  'route',
  'common',
  'filters',
  'products-form',
  'products-table',
  'products-addon-table',
  'product-addon-form',
  'orders-table',
  'contacts-table',
  'contacts-groups-table',
  'cashbook-table',
  'cashbook-form',
  'inventory-table',
  'warehouse-table',
  'stocktaking-table',
  'inventory-import-book-table',
  'inventory-export-book-table',
  'inventory-form',
  'notification',
  'modal-title',
  'transaction-table',
  'debt-table',
  'debt-details',
  'debtbook-form',
  'pos',
  'table',
  'orders-form',
  'contact-form',
  'contact-details',
  'contact-group-form',
  'barcode',
  'orders-form',
  'chat',
  'ingredients-table',
  'ingredients-form',
  'recipe-table',
  'commission-table',
  'ecommerce',
  'purchase-order',
  'stocktaking-form',
  'todo',
  'month',
];

const supportedLngs = Object.values(Language);

const resources = ns.reduce((acc: ExpectedAny, n: ExpectedAny) => {
  supportedLngs.forEach((lng) => {
    if (!acc[lng]) acc[lng] = {};
    acc[lng] = {
      ...acc[lng],
      [n]: require(`./${lng}/${n}.json`),
    };
  });
  return acc;
}, {});

i18n.use(initReactI18next).init({
  resources,
  lng: window.localStorage.getItem(LOCALE_KEY) || Language.VI,
  ns,
  interpolation: {
    escapeValue: false,
  },
});

export const changeLanguage = (lng: Language) => {
  i18n.changeLanguage(lng);
  window.localStorage.setItem(LOCALE_KEY, lng);
};

export default i18n;
