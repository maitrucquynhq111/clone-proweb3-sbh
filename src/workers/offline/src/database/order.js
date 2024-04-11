/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

var Orders = {
  objectStoreName: 'Orders',
  synch: {
    fetch: function () {
      BaseSynch.fetchAllWithPagingApi(
        Orders.objectStoreName,
        new Object(),
        `${apiUrl}/finan-order/api/v2/get-list-order?business_id=${self.bussiness}&sort=&name=&has_record_deleted=false&`,
        'data',
        Orders.dao.addOrUpdate,
      );
    },
  },
  dao: {
    getById: function (id, onsuccess) {
      BaseDao.getByKey(Orders.objectStoreName, id, function (data) {
        onsuccess(data);
      });
    },
    getAll: function (onsuccess) {
      BaseDao.getAll(Orders.objectStoreName, function (data) {
        onsuccess(data);
      });
    },
    addOrUpdate: function (model, onsuccess, onerror) {
      BaseDao.addOrUpdate(Orders.objectStoreName, model, onsuccess, onerror);
    },
    delete: function (model, onsuccess, onerror) {
      BaseDao.delete(Orders.objectStoreName, model.id, onsuccess, onerror);
    },
  },
};
