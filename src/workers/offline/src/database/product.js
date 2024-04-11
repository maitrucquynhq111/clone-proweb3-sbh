/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

var Product = {
  objectStoreName: 'Products',
  synch: {
    fetch: function () {
      StatisticDb.dao.getByObjectType(Product.objectStoreName, function (data) {
        var lastFetchProduct = data?.last_fetch || '1970-01-01T00:00:00.000Z';
        var haveDelete = data?.last_fetch ? true : false;
        BaseSynch.fetchAllWithPagingApi(
          Product.objectStoreName,
          new Object(),
          `${apiUrl}/finan-product/api/v2/product/seller/get-list?business_id=${self.bussiness}&sort=&name=&has_record_deleted=${haveDelete}&update_after=${lastFetchProduct}&`,
          'data',
          Product.dao.addOrUpdate,
        );
      });
    },
  },
  dao: {
    getById: function (id, onsuccess) {
      BaseDao.getByKey(Product.objectStoreName, id, function (data) {
        onsuccess(data);
      });
    },
    getAll: function (onsuccess) {
      BaseDao.getAll(Product.objectStoreName, function (data) {
        onsuccess(data);
      });
    },
    addOrUpdate: function (model, onsuccess, onerror) {
      if (!model?.deleted_at) {
        productFuse.remove((doc) => doc.id === model.id);
        productFuse.add(model);
        BaseDao.addOrUpdate(Product.objectStoreName, model, onsuccess, onerror);
      } else {
        BaseDao.delete(Product.objectStoreName, model.id, onsuccess);
      }
    },
  },
};
