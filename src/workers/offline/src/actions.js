/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

function getAllContact() {
  Contacts.dao.getAll(function (data) {
    self.postMessage({
      action: 'result-get-all-contact',
      result: data,
    });
  });
}

function getAllPaymentSource() {
  PaymentSource.dao.getAll(function (data) {
    self.postMessage({
      action: 'result-get-all-payment-source',
      result: data.sort((a, b) => (a.priority > b.priority ? 1 : -1)),
    });
  });
}

function makeSearchProduct() {
  Product.dao.getAll(function (data) {
    productFuse.remove((doc) => doc);
    (data || []).forEach(function (item) {
      productFuse.add(item);
    });
  });
}

function makeSearchLocation() {
  Location.dao.getAll(function (data) {
    locationFuse.remove((doc) => doc);
    (data || []).forEach(function (item) {
      locationFuse.add(item);
    });
  });
}

function getAllOrder() {
  Orders.dao.getAll(function (data) {
    self.postMessage({
      action: 'result-get-all-order',
      result: sortByValue(data, 'created_at', 'desc'),
    });
  });
}

function searchLocation(value) {
  const searchName = value || '';
  if (searchName && searchName !== '') {
    const searchNameObj = searchName && searchName !== '' ? removeKeywordLocation(noAccents(value)) : null;
    const result = locationFuse.search(searchNameObj);
    const dataResult = result.map(({ item }) => item);
    self.postMessage({
      action: 'result-search-location',
      result: dataResult,
    });
  } else {
    Location.dao.getAll(function (data) {
      self.postMessage({
        action: 'result-search-location',
        result: data.slice(0, 20),
      });
    });
  }
}

function searchProducts(value) {
  const searchName = value?.search || '';
  const sortValue = value?.sortValue || 'desc';
  const sortBy = value?.sortBy || 'created_at';

  const searchNameObj = searchName && searchName !== '' ? value.search : null;

  Product.dao.getAll(function (data) {
    if (searchNameObj) {
      const result = productFuse.search({
        $or: [
          ...(searchNameObj
            ? [
                { name: noAccents(searchNameObj) },
                { name_split: noAccents(searchNameObj) },
                { name_first_chars: noAccents(searchNameObj) },
                { product_code: noAccents(searchNameObj) },
                { list_sku_code: noAccents(searchNameObj) },
                { list_barcode: noAccents(searchNameObj) },
              ]
            : []),
        ],
      });

      const dataResult = result.map(({ item }) => item);
      const sortedData = sortByValue(dataResult, sortBy, sortValue);

      self.postMessage({
        action: 'result-search-product',
        result: sortedData,
      });
    } else {
      const sortedData = sortByValue(data, sortBy, sortValue);
      self.postMessage({
        action: 'result-search-product',
        result: sortedData,
      });
    }
  });
}

function fitlerProducts(value) {
  const searchCategory = value?.category || [];
  const sortValue = value?.sortValue || 'desc';
  const sortBy = value?.sortBy || 'created_at';
  const searchCategoryObj = searchCategory && searchCategory.length > 0 ? searchCategory : null;
  Product.dao.getAll(function (data) {
    if (searchCategoryObj) {
      const result = productFuse.search({
        $or: [...searchCategoryObj.map((item) => ({ category: item }))],
      });

      const dataResult = result.map(({ item }) => item);
      const sortedData = sortByValue(dataResult, sortBy, sortValue);

      self.postMessage({
        action: 'result-filter-product',
        result: sortedData,
      });
    } else {
      const sortedData = sortByValue(data, sortBy, sortValue);
      self.postMessage({
        action: 'result-filter-product',
        result: sortedData,
      });

      // setTimeout(() => {
      //   const result = productFuse.getIndex().docs;
      //   const sortedData = sortByValue(result, sortBy, sortValue);
      //   self.postMessage({
      //     action: 'result-filter-product',
      //     result: sortedData,
      //   });
      // }, 200);
    }
  });
}

function getAllCategories() {
  Category.dao.getAll(function (data) {
    self.postMessage({
      action: 'result-get-all-category',
      result: data.sort((a, b) => (a.position > b.position ? 1 : -1)),
    });
  });
}
