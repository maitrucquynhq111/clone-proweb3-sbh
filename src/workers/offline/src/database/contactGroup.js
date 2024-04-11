/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

var ContactGroup = {
  objectStoreName: 'ContactGroup',
  synch: {
    fetch: function () {
      StatisticDb.dao.getByObjectType(ContactGroup.objectStoreName, function (data) {
        var lastFetchContactGroup = data?.last_fetch || '1970-01-01T00:00:00.000Z';
        var haveDeleteContactGroup = data?.last_fetch ? true : false;
        BaseSynch.fetchAllWithPagingApi(
          ContactGroup.objectStoreName,
          new Object(),
          `${apiUrl}/finan-business/api/v1/business/${self.bussiness}/get-list-group-info?sort=&name=&has_record_deleted=${haveDeleteContactGroup}&update_after=${lastFetchContactGroup}&`,
          'data',
          ContactGroup.dao.addOrUpdate,
        );
      });
    },
  },
  dao: {
    getById: function (id, onsuccess) {
      BaseDao.getByKey(ContactGroup.objectStoreName, id, function (data) {
        onsuccess(data);
      });
    },
    getAll: function (onsuccess) {
      BaseDao.getAll(ContactGroup.objectStoreName, function (data) {
        onsuccess(data);
      });
    },
    addOrUpdate: function (model, onsuccess, onerror) {
      if (!model?.deleted_at) {
        BaseDao.addOrUpdate(ContactGroup.objectStoreName, model, onsuccess, onerror);
      } else {
        BaseDao.delete(ContactGroup.objectStoreName, model.id, onsuccess);
      }
    },
  },
};
