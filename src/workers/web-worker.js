/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

importScripts(
  './offline/core/makeSearch.js',
  './offline/core/offlineDB.js',
  './offline/src/actions.js',
  './offline/src/sync.js',
);
importScripts('./offline/lib/via/object.js', './offline/lib/via/property.js', './offline/lib/via/controller.js');

onmessage = function (command) {
  const data = command.data;
  const action = data.action;
  const value = data.value;

  if (data?.data?.token) {
    self.token = data?.data?.token;
  }
  if (data?.data?.bussiness) {
    self.bussiness = data?.data?.bussiness;
  }
  if (data?.data?.apiUrl) {
    self.apiUrl = data?.data?.apiUrl;
  }

  if (action != null && action != undefined) {
    console.log('---> Webworker receive command ' + action);
  }

  if (self.token && self.bussiness && self.apiUrl) {
    if (action == 'init-db') {
      initDb();
    } else if (action == 'synch-data') {
      Via.postMessage = (data) => {
        self.postMessage(data);
      };
      if (Database.dbInstance !== null) {
        self.valueFilter = value;
        setTimeout(() => {
          firstSyncData();
        }, 200);
      } else {
        setTimeout(() => {
          self.valueFilter = value;
          setTimeout(() => {
            firstSyncData();
          }, 200);
        }, 1000);
      }
    } else if (action == 'force-sync') {
      self.valueFilter = value;
      setTimeout(() => {
        syncData();
      }, 200);
    } else if (action == 'sync-Products') {
      syncProducts();
    } else if (action == 'sync-Categories') {
      syncCategories();
    } else if (action == 'sync-Contacts') {
      syncContacts();
    } else if (action == 'sync-PaymentSource') {
      syncPaymentSource();
    } else if (action == 'search-location') {
      self.valueSearchLocation = value;
      searchLocation(value);
    } else if (action == 'make-search-product') {
      makeSearchProduct();
    } else if (action == 'make-search-location') {
      makeSearchLocation();
    } else if (action == 'create-order') {
      Orders.dao.addOrUpdate(value);
    } else if (action == 'get-all-order') {
      getAllOrder();
    } else if (action == 'delete-order') {
      Orders.dao.delete(value, function (data) {
        Orders.dao.getAll(function (data) {
          self.postMessage({
            action: 'result-delete-order',
            result: sortByValue(data, 'created_at', 'desc'),
          });
        });
      });
    } else if (action == 'filter-product') {
      self.valueFilter = value;
      fitlerProducts(value);
    } else if (action == 'search-product') {
      self.valueFilter = value;
      searchProducts(value);
    } else if (action == 'get-all-category') {
      getAllCategories();
    } else if (action == 'get-all-payment-source') {
      getAllPaymentSource();
    } else if (command.data != null && command.data != undefined) {
      Via.OnMessage(command?.data);
    } else {
      console.log(command?.data?.action);
    }
  }
};

function initDb() {
  Database.openDb();
}

var sync = setTimeout(function () {
  syncData();
}, 500);

sync = setInterval(function () {
  syncData();
}, 30000);

function firstSyncData() {
  StatisticDb.dao.getAll(function (data) {
    var isFistSync = data.some((item) => {
      return new Date(item.last_fetch).getFullYear() == 1970;
    });
    if (!isFistSync && data.length > 0) {
      if (!navigator.onLine) {
        self.postMessage({
          action: 'sync-success',
          result: null,
        });
        fitlerProducts(self.valueFilter);
        searchProducts(self.valueFilter);
      }
      fitlerProducts(self.valueFilter);
      searchProducts(self.valueFilter);
      makeSearchProduct();
      makeSearchLocation();
      getAllCategories();
      getAllContact();
      getAllPaymentSource();
      getAllOrder();
      var inputName = 'perSync-Location';
      var processName = 'progress-sync-Location';
      const document = via.document;
      document.getElementById(inputName).value = '100%';
      document.getElementById(processName + '__progress-bar').classList?.add('progress-bar-transition');
      document.getElementById(processName + '__progress-bar').style.width = '100%';
      document.getElementById(processName + '__progress-percentage').innerHTML = '100%';
    } else {
      self.postMessage({
        action: 'syncing',
        result: null,
      });
      syncLocations();
    }
  });
}
