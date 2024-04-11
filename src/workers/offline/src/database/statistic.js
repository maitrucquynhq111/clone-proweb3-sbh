/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

var StatisticDb = {
  objectStoreName: 'Statistic',
  dao: {
    add: function (model, onsuccess, onerror) {
      BaseDao.add(StatisticDb.objectStoreName, model, onsuccess, onerror);
    },
    update: function (model, onsuccess, onerror) {
      BaseDao.update(StatisticDb.objectStoreName, model, onsuccess, onerror);
    },
    getByObjectType: function (objectType, onsuccess, onerror) {
      BaseDao.getByKey(StatisticDb.objectStoreName, objectType, onsuccess, onerror);
    },
    getAll: function (onsuccess) {
      BaseDao.getAll(StatisticDb.objectStoreName, function (data) {
        onsuccess(data);
      });
    },
  },
};
