/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

importScripts('./offline/lib/fuse.js');

var optionsProduct = {
  threshold: 0.1,
  minMatchCharLength: 0,
  ignoreLocation: true,
  useExtendedSearch: true,
  keys: [
    {
      name: 'name',
      getFn: (product) => noAccents(product?.name) || '',
    },
    {
      name: 'name_first_chars',
      getFn: (product) => {
        const nameProduct = noAccents(product?.name) || '';
        const nameSplit = nameProduct.split(' ');
        const getFirstChart = nameSplit.map((item) => item.charAt(0));
        return getFirstChart.join('');
      },
    },
    {
      name: 'list_sku_code',
      getFn: (product) => product?.list_sku_code || [],
    },
    {
      name: 'list_barcode',
      getFn: (product) => product?.list_barcode || [],
    },
    {
      name: 'product_code',
      getFn: (product) => product?.product_code || '',
    },
    {
      name: 'category',
      getFn: (product) => (product?.category || []).map((item) => item.id),
    },
  ],
};

var optionsLocation = {
  keys: [
    {
      name: 'full_name',
      getFn: (location) => removeKeywordLocation(noAccents(location?.full_name) || ''),
    },
    {
      name: 'name',
      getFn: (location) => removeKeywordLocation(noAccents(location?.name) || ''),
    },
    {
      name: 'full_name_uncent',
      getFn: (location) => removeKeywordLocation(noAccents(location?.full_name_uncent) || ''),
    },
  ],
  threshold: 1.0,
  minMatchCharLength: 0,
  ignoreLocation: true,
};

var productFuse = new Fuse([], optionsProduct);
var locationFuse = new Fuse([], optionsLocation);
