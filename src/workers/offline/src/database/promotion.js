/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

var Promotions = {
  objectStoreName: 'Promotions',
  synch: {
    fetch: function () {
      StatisticDb.dao.getByObjectType(Promotions.objectStoreName, function (data) {
        var lastFetchPromotions = data?.last_fetch || '1970-01-01T00:00:00.000Z';
        var haveDeletePromotions = data?.last_fetch ? true : false;
        BaseSynch.fetchAllWithPagingApi(
          Promotions.objectStoreName,
          new Object(),
          `${apiUrl}/finan-promotion/api/v1/promotions/get-list?business_id=${self.bussiness}&sort=&name=&has_record_deleted=${haveDeletePromotions}&update_after=${lastFetchPromotions}&`,
          'data',
          Promotions.dao.addOrUpdate,
        );
      });
    },
  },
  dao: {
    addOrUpdate: function (model, onsuccess, onerror) {
      if (!model?.deleted_at) {
        BaseDao.addOrUpdate(Promotions.objectStoreName, model, onsuccess, onerror);
      } else {
        BaseDao.delete(Promotions.objectStoreName, model.id, onsuccess);
      }
    },
  },
};
