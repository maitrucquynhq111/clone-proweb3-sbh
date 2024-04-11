/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

var Contacts = {
  objectStoreName: 'Contacts',
  synch: {
    fetch: function () {
      StatisticDb.dao.getByObjectType(Contacts.objectStoreName, function (data) {
        var lastFetchContact = data?.last_fetch || '1970-01-01T00:00:00.000Z';
        var haveDeleteContact = data?.last_fetch ? true : false;
        BaseSynch.fetchAllWithPagingApi(
          Contacts.objectStoreName,
          new Object(),
          `${apiUrl}/finan-business/api/v1/contact/get-list?business_id=${self.bussiness}&state=delivering&choose_customer=all&is_active=true&sort=&name=&has_record_deleted=${haveDeleteContact}&update_after=${lastFetchContact}&`,
          'data',
          Contacts.dao.addOrUpdate,
        );
      });
    },
  },
  dao: {
    getById: function (id, onsuccess) {
      BaseDao.getByKey(Contacts.objectStoreName, id, function (data) {
        onsuccess(data);
      });
    },
    getAll: function (onsuccess) {
      BaseDao.getAll(Contacts.objectStoreName, function (data) {
        onsuccess(data);
      });
    },
    addOrUpdate: function (model, onsuccess, onerror) {
      if (model?.is_customer_active) {
        BaseDao.delete(Contacts.objectStoreName, model.id, onsuccess);
      } else {
        BaseDao.addOrUpdate(Contacts.objectStoreName, model, onsuccess, onerror);
      }
    },
  },
};
