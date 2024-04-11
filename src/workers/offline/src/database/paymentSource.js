/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

var PaymentSource = {
  objectStoreName: 'PaymentSource',
  synch: {
    fetch: function () {
      StatisticDb.dao.getByObjectType(PaymentSource.objectStoreName, function (data) {
        var lastFetchPaymentSource = data?.last_fetch || '1970-01-01T00:00:00.000Z';
        BaseSynch.fetchAllWithPagingApi(
          PaymentSource.objectStoreName,
          new Object(),
          `${apiUrl}/finan-transaction/api/v1/payment-source/get-list?business_id=${self.bussiness}&update_after=${lastFetchPaymentSource}&`,
          'data',
          PaymentSource.dao.addOrUpdate,
        );
      });
    },
  },
  dao: {
    getAll: function (onsuccess) {
      BaseDao.getAll(PaymentSource.objectStoreName, function (data) {
        onsuccess(data);
      });
    },
    addOrUpdate: function (model, onsuccess, onerror) {
      if (!model?.deleted_at) {
        BaseDao.addOrUpdate(PaymentSource.objectStoreName, model, onsuccess, onerror);
      } else {
        BaseDao.delete(PaymentSource.objectStoreName, model.id, onsuccess);
      }
    },
  },
};
