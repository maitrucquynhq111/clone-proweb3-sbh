/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

var Location = {
  objectStoreName: 'Location',
  synch: {
    fetch: function () {
      BaseDao.count(Location.objectStoreName, function (total) {
        BaseSynch.fetchAllWithPagingApi(
          Location.objectStoreName,
          new Object(),
          `${apiUrl}/finan-location-tree/api/v2/location/get-list?loc_lvl=3&`,
          'data',
          Location.dao.addOrUpdate,
          500,
        );
      });
    },
  },
  dao: {
    getById: function (id, onsuccess) {
      BaseDao.getByKey(Location.objectStoreName, key, function (data) {
        onsuccess(data);
      });
    },
    getAll: function (onsuccess) {
      BaseDao.getAll(Location.objectStoreName, function (data) {
        onsuccess(data);
      });
    },
    getByCountryId: function (countryId, onsuccess) {
      BaseDao.getByIndex(Location.objectStoreName, 'country_id', countryId, function (data) {
        onsuccess(data);
      });
    },
    addOrUpdate: function (model, onsuccess, onerror) {
      if (!model?.deleted_at) {
        locationFuse.add(model);
        BaseDao.addOrUpdate(Location.objectStoreName, model, onsuccess, onerror);
      } else {
        BaseDao.delete(Location.objectStoreName, model.id, onsuccess);
      }
    },
    add: function (model, onsuccess, onerror) {
      BaseDao.add(Location.objectStoreName, model, onsuccess, onerror);
    },
  },
};
