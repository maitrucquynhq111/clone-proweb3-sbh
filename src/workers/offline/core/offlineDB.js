/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

var Database = {
  name: 'FinanOfflineDB',
  version: 8,
  dbInstance: null,
  openDb: function () {
    if (self.bussiness) {
      let dbInstanceNull = true;
      if (Database.dbInstance != null) {
        dbInstanceNull = false;
        return;
      }
      var req = indexedDB.open(Database.name + '-' + self.bussiness, Database.version);
      req.onblocked = function () {
        console.log('Transaction open has been blocked');
      };
      req.onerror = function (event) {
        console.error('Open Db for action', event.target.error);
      };
      req.onsuccess = function (event) {
        console.log('Transaction open has been successfull!');
        Database.dbInstance = event.target.result;
      };
      req.onupgradeneeded = function (event) {
        Database.dbInstance = event.target.result;
        console.log('OpenDb onupgradeneeded');
        var transaction = event.target.transaction;

        // if (event.target.result.objectStoreNames.contains('Location')) {
        //   const objectStoreLocation = transaction.objectStore('Location');
        //   objectStoreLocation.clear();
        // }

        if (event.target.result.objectStoreNames.contains('Contacts')) {
          const objectStoreContacts = transaction.objectStore('Contacts');
          objectStoreContacts.clear();
        }
        if (event.target.result.objectStoreNames.contains('Promotions')) {
          const objectStorePromotions = transaction.objectStore('Promotions');
          objectStorePromotions.clear();
        }
        if (event.target.result.objectStoreNames.contains('ContactGroup')) {
          const objectStoreContactGroup = transaction.objectStore('ContactGroup');
          objectStoreContactGroup.clear();
        }

        if (event.target.result.objectStoreNames.contains('PaymentSource')) {
          const objectStorePaymentSource = transaction.objectStore('PaymentSource');
          objectStorePaymentSource.clear();
        }

        if (event.target.result.objectStoreNames.contains('Categories')) {
          const objectStoreCategories = transaction.objectStore('Categories');
          objectStoreCategories.clear();
        }
        if (event.target.result.objectStoreNames.contains('Products')) {
          const objectStoreProducts = transaction.objectStore('Products');
          objectStoreProducts.clear();
        }
        if (event.target.result.objectStoreNames.contains('Statistic')) {
          const objectStoreStatistic = transaction.objectStore('Statistic');
          objectStoreStatistic.clear();
        }

        Database.initSchema();
      };
      req.onabort = function () {
        console.log('Transaction open has been aborted!');
      };
      req.onclose = function () {
        console.log('Transaction transaction has been closed!');
      };
      req.addEventListener('completed', function (event) {
        console.log('Transaction open has been completed!');
      });
    }
  },
  initSchema: function () {
    var objectStoreModels = [
      new objectStoreModel('Statistic', 'object_type', true, []),
      new objectStoreModel('Products', 'id', false, [
        new dbIndex('id', false),
        // new dbIndex('name', false),
        // new dbIndex('product_code', false),
      ]),
      new objectStoreModel('Contacts', 'id', true, [
        new dbIndex('id', false),
        // new dbIndex('name', false),
        // new dbIndex('email', false),
        // new dbIndex('phone_number', false),
      ]),
      new objectStoreModel('ContactGroup', 'id', true, [
        new dbIndex('id', false),
        //new dbIndex('name', false)
      ]),
      new objectStoreModel('Orders', 'id', true, [
        new dbIndex('id', false),
        // new dbIndex('state', false),
        // new dbIndex('delivery_method', false),
        // new dbIndex('contact_id', false),
      ]),
      new objectStoreModel('Categories', 'id', false, [
        new dbIndex('id', false),
        // new dbIndex('name', false)
      ]),
      new objectStoreModel('Promotions', 'id', false, [
        new dbIndex('id', false),
        // new dbIndex('type', false),
        // new dbIndex('name', false),
        // new dbIndex('promotion_code', false),
      ]),
      new objectStoreModel('Location', 'id', false, [
        new dbIndex('id', false),
        // new dbIndex('short_id', false),
        // new dbIndex('short_name', false),
      ]),
      new objectStoreModel('PaymentSource', 'id', false, [
        new dbIndex('id', false),
        // new dbIndex('short_id', false),
        // new dbIndex('short_name', false),
      ]),
    ];
    objectStoreModels.forEach(function (objectStoreModel) {
      var db = Database.dbInstance;
      if (db.objectStoreNames.contains(objectStoreModel.name)) {
        // console.log(db.objectStoreNames, objectStoreModel.name);
        // db.deleteObjectStore(objectStoreModel.name);
      } else {
        var objectStore = db.createObjectStore(objectStoreModel.name, {
          keyPath: objectStoreModel.key,
          autoIncrement: objectStoreModel.autoIncrement,
        });
        if (objectStoreModel['indexes'] != null) {
          objectStoreModel.indexes.forEach(function (index) {
            objectStore.createIndex(index['name'], index['name'], {
              unique: index['unique'],
            });
          });
        }
      }
    });
  },
  getObjectStore: function (name, mode) {
    if (Database.dbInstance == null) {
      var req = indexedDB.open(Database.name + '-' + self.bussiness, Database.version);
      req.onsuccess = function (event) {
        Database.dbInstance = event.target.result;
        var tx = Database.dbInstance.transaction(name, mode, {
          durability: 'relaxed',
        });
        return tx.objectStore(name);
      };
    } else {
      var tx = Database.dbInstance.transaction(name, mode, {
        durability: 'relaxed',
      });
      return tx.objectStore(name);
    }
  },
};

var BaseSynch = {
  fetchAllWithPagingApi: function (objectStoreName, model, url, jsonNodeName, process, limit) {
    console.log('Fetch all: ' + objectStoreName);
    if (limit) {
      model.limit = limit;
    } else {
      model.limit = 75;
    }

    var token = self.token;
    updatePercentSync(objectStoreName, 0, 1);
    StatisticDb.dao.getByObjectType(objectStoreName, function (data) {
      var modifiedOnMin = null;
      if (data == null || data == undefined) {
        var newStatistic = new statisticObj(objectStoreName, 'first');
        model.page = newStatistic.page = 1;
        StatisticDb.dao.add(
          newStatistic,
          function () {
            modifiedOnMin = newStatistic.last_fetch;
            model.modified_on_min = modifiedOnMin;
            fetchPageApi(model);
          },
          function (error) {
            console.log(error);
          },
        );
      } else {
        modifiedOnMin = data.last_fetch;
        model.modified_on_min = modifiedOnMin;
        if (data.page != null && data.page != undefined && data.page > 0) {
          model.page = data.page;
          fetchPageApi(model);
        } else {
          model.page = data.page = 1;
          StatisticDb.dao.update(
            data,
            function () {
              fetchPageApi(model);
            },
            function (error) {
              console.log(error);
            },
          );
        }
      }
    });
    function fetchPageApi(filter) {
      var urlget = url + 'page=' + model.page + '&page_size=' + model.limit;
      sendRequest(
        'GET',
        urlget,
        model,
        function (data) {
          count = data?.meta?.total_rows || data?.data?.meta?.total_rows;
          if (data?.[jsonNodeName] != null && data?.[jsonNodeName].length > 0) {
            data[jsonNodeName].forEach(function (item) {
              process(item);
            });
          }
          if (data?.data?.[jsonNodeName] != null && data?.data?.[jsonNodeName].length > 0) {
            data?.data?.[jsonNodeName].forEach(function (item) {
              process(item);
            });
          }

          var totalPage = Math.ceil(count / model.limit);
          console.log('----------' + objectStoreName + '----------');
          console.log('Page: ' + filter.page + ' of ' + totalPage);
          updatePercentSync(objectStoreName, filter.page, totalPage);
          if (totalPage > filter.page) {
            setTimeout(function () {
              filter.page = filter.page + 1;
              var statistic = new statisticObj(objectStoreName, 'now');
              statistic.page = filter.page;
              statistic.totalPage = totalPage;
              statistic.last_fetch = model.modified_on_min;
              StatisticDb.dao.update(
                statistic,
                function () {
                  fetchPageApi(filter);
                },
                function (error) {
                  fetchPageApi(filter);
                },
              );
            }, 1500);
          } else {
            StatisticDb.dao.getByObjectType(objectStoreName, function (statisticDb) {
              if (statisticDb !== null && statisticDb !== undefined) {
                if (statisticDb.totalPage !== null && statisticDb.totalPage !== undefined) {
                  if (statisticDb.totalPage > filter.page) {
                    setTimeout(function () {
                      filter.page = filter.page + 1;
                      var statistic = new statisticObj(objectStoreName, 'now');
                      statistic.page = filter.page;
                      statistic.totalPage = statisticDb.totalPage;
                      statistic.last_fetch = model.modified_on_min;
                      StatisticDb.dao.update(
                        statistic,
                        function () {
                          fetchPageApi(filter);
                        },
                        function (error) {
                          fetchPageApi(filter);
                        },
                      );
                    }, 1000);
                  } else {
                    var newstatistic = new statisticObj(objectStoreName, 'now');
                    newstatistic.page = 1;
                    BaseDao.addOrUpdate(StatisticDb.objectStoreName, newstatistic);
                  }
                } else {
                  var newstatistic = new statisticObj(objectStoreName, 'now');
                  newstatistic.page = 1;
                  BaseDao.addOrUpdate(StatisticDb.objectStoreName, newstatistic);
                }
              }
            });
          }
        },
        function (requestModel) {
          setTimeout(function () {
            fetchPageApi(requestModel);
          }, 10000);
        },
        token,
      );
    }
  },
};

var BaseDao = {
  getByKey: function (objectStoreName, key, onsuccess, onerror) {
    var objectStore = Database.getObjectStore(objectStoreName, 'readonly');
    if (objectStore == null || objectStore == undefined) {
      setTimeout(function () {
        objectStore = Database.getObjectStore(objectStoreName, 'readonly');
      }, 1500);
    }
    var request = objectStore.get(key);
    request.onerror = function (event) {
      console.log('Get ' + objectStoreName + 'by key: ' + key + 'error');
      if (onerror) onerror(event.target.error);
    };
    request.onsuccess = function (event) {
      onsuccess(event.target.result);
    };
  },
  count: function (objectStoreName, onsuccess, onerror) {
    var objectStore = Database.getObjectStore(objectStoreName, 'readonly');
    var request = objectStore.count();
    request.onsuccess = function () {
      onsuccess(request.result);
    };
  },
  getAll: function (objectStoreName, onsuccess, onerror) {
    var objectStore = Database.getObjectStore(objectStoreName, 'readwrite');
    var request = objectStore?.getAll();
    if (request) {
      request.onerror = function (event) {
        console.log('Get all: ' + objectStoreName + 'error');
        if (onerror) onerror(event.target.error);
      };
      request.onsuccess = function (event) {
        onsuccess(event.target.result);
      };
    }
  },
  getByIndex: function (objectStoreName, indexName, indexValue, onsuccess, onerror) {
    var objectStore = Database.getObjectStore(objectStoreName, 'readonly');
    var index = objectStore.index(indexName);
    index.get(indexValue).onsuccess = function (event) {
      onsuccess(event.target.result);
    };
    index.get(indexValue).onerror = function (event) {
      if (onerror) onerror(event.target.error);
    };
  },
  getByRangeIndex: function (objectStoreName, indexName, lowerIndexValue, upperIndexValue, onsuccess, onerror) {
    var objectStore = Database.getObjectStore(objectStoreName, 'readonly');
    var index = objectStore.index(indexName);
    var req = index.openCursor(IDBKeyRange.bound(lowerIndexValue, upperIndexValue));
    var result = [];
    req.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        result.push(cursor.value);
        cursor.continue();
      } else {
        onsuccess(result);
      }
    };
    req.onerror = function (event) {};
  },
  add: function (objectStoreName, model, onsuccess, onerror) {
    var objectStore = Database.getObjectStore(objectStoreName, 'readwrite');
    var request = objectStore.add(model);
    if (onsuccess != undefined)
      request.onsuccess = function (event) {
        console.log('Add: ' + objectStoreName);
        onsuccess(event.target.result);
      };
    if (onerror)
      request.onerror = function (event) {
        onerror(event.target.error);
      };
  },
  update: function (objectStoreName, model, onsuccess, onerror) {
    var objectStore = Database.getObjectStore(objectStoreName, 'readwrite');
    var request = objectStore.put(model);
    if (onsuccess != undefined)
      request.onsuccess = function (event) {
        onsuccess(event.target.result);
      };
    request.onerror = function (error) {
      console.log('update ' + objectStoreName + '_' + model.id + ' error');
      if (onerror) {
        onerror();
      }
    };
  },
  addOrUpdate: function (objectStoreName, model, onsuccess, onerror) {
    var objectStore = Database.getObjectStore(objectStoreName, 'readwrite');
    var keyPath = objectStore.keyPath;
    if (model[keyPath] == null)
      BaseDao.add(
        objectStoreName,
        model,
        function (data) {
          if (onsuccess) onsuccess(data);
        },
        function (data) {
          if (onerror) onerror(data);
        },
      );
    else
      BaseDao.update(
        objectStoreName,
        model,
        function (data) {
          if (onsuccess) onsuccess(data);
        },
        function (data) {
          if (onerror) onerror(data);
        },
      );
  },
  clear: function (objectStoreName, onsuccess, onerror) {
    var objectStore = Database.getObjectStore(objectStoreName, 'readwrite');
    var request = objectStore.clear();
    request.onsuccess = function () {
      onsuccess();
    };
    if (onerror)
      request.onerror = function () {
        onerror();
      };
  },
  delete: function (objectStoreName, key, onsuccess, onerror) {
    var objectStore = Database.getObjectStore(objectStoreName, 'readwrite');
    var request = objectStore.delete(key);
    request.onsuccess = function () {
      if (onsuccess != undefined) onsuccess();
    };
    request.onerror = function () {
      if (onerror) onerror();
    };
  },
};

importScripts(
  './offline/src/database/statistic.js',
  './offline/src/database/location.js',
  './offline/src/database/product.js',
  './offline/src/database/category.js',
  './offline/src/database/promotion.js',
  './offline/src/database/contact.js',
  './offline/src/database/contactGroup.js',
  './offline/src/database/paymentSource.js',
  './offline/src/database/order.js',
  './offline/core/utils.js',
);
