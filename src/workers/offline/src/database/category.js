/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

var Category = {
  objectStoreName: 'Categories',
  synch: {
    fetch: function () {
      StatisticDb.dao.getByObjectType(Category.objectStoreName, function (data) {
        var lastFetchCategory = data?.last_fetch || '1970-01-01T00:00:00.000Z';
        var haveDeleteCategory = data?.last_fetch ? true : false;
        BaseSynch.fetchAllWithPagingApi(
          Category.objectStoreName,
          new Object(),
          `${apiUrl}/finan-product/api/v2/category/seller/get-list?business_id=${self.bussiness}&sort=&name=&has_record_deleted=${haveDeleteCategory}&update_after=${lastFetchCategory}&`,
          'data',
          Category.dao.addOrUpdate,
        );
      });
    },
  },
  dao: {
    getById: function (id, onsuccess) {
      BaseDao.getByKey(Category.objectStoreName, id, function (data) {
        onsuccess(data);
      });
    },
    getAll: function (onsuccess) {
      BaseDao.getAll(Category.objectStoreName, function (data) {
        onsuccess(data);
      });
    },
    addOrUpdate: function (model, onsuccess, onerror) {
      if (!model?.deleted_at) {
        BaseDao.addOrUpdate(Category.objectStoreName, model, onsuccess, onerror);
      } else {
        BaseDao.delete(Category.objectStoreName, model.id, onsuccess);
      }
    },
  },
};
