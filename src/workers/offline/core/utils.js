/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

function sortByValue(arr, sortBy, value) {
  if (sortBy.includes('_at')) {
    return arr.sort((a, b) => {
      if (value === 'desc') {
        return new Date(a[sortBy]) > new Date(b[sortBy]) ? -1 : 1;
      } else {
        return new Date(a[sortBy]) > new Date(b[sortBy]) ? 1 : -1;
      }
    });
  } else if (sortBy.includes('normal_price')) {
    const sortedArr = arr.sort(function (a, b) {
      return value === 'desc'
        ? parseFloat(b?.list_sku[0]?.normal_price || 0) - parseFloat(a?.list_sku[0]?.normal_price || 0)
        : parseFloat(a?.list_sku[0]?.normal_price || 0) - parseFloat(b?.list_sku[0]?.normal_price || 0);
    });
    return sortedArr;
  } else if (sortBy.includes('name')) {
    const sortedArr = arr.sort(function (a, b) {
      const valueA = a[sortBy].toLowerCase().trim();
      const valueB = b[sortBy].toLowerCase().trim();
      return value === 'desc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
    return sortedArr;
  } else {
    const sortedArr = arr.sort(function (a, b) {
      if (a[sortBy] < b[sortBy]) {
        return value === 'desc' ? 1 : -1;
      }
      if (a[sortBy] > b[sortBy]) {
        return value === 'desc' ? -1 : 1;
      }
      return 0;
    });
    return sortedArr;
  }
}

async function updatePercentSync(objectStoreName, page, total) {
  if (total != null && total != undefined && total > 0) {
    var per = parseFloat((100 * page) / total).toFixed(0) + '%';
  } else {
    var per = '100%';
  }
  var inputName = 'perSync-' + objectStoreName;
  var processName = 'progress-sync-' + objectStoreName;
  const document = via.document;
  if (document.getElementById(inputName)) {
    document.getElementById(inputName).value = per;
  }
  document.getElementById(processName + '__progress-bar').classList?.add('progress-bar-transition');
  document.getElementById(processName + '__progress-bar').style.width = per;
  document.getElementById(processName + '__progress-percentage').innerHTML = per;
  if (per == '100%') {
    var [lengthElement] = await Promise.all([get(document.body.getElementsByClassName('checkCompleteSync').length)]);
    var checkComplete = true;
    for (var i = 0; i < lengthElement; i++) {
      var [element] = await Promise.all([get(document.body.getElementsByClassName('checkCompleteSync')[i]?.value)]);
      var [elementName] = await Promise.all([get(document.body.getElementsByClassName('checkCompleteSync')[i].id)]);
      if (element != '100%' && elementName != 'perSync-Location') {
        checkComplete = false;
        break;
      }
      if (elementName == 'perSync-Products' && element == '100%') {
        fitlerProducts(self.valueFilter);
        searchProducts(self.valueFilter);
      } else if (elementName == 'perSync-Categories' && element == '100%') {
        getAllCategories();
      } else if (elementName == 'perSync-Contacts' && element == '100%') {
        getAllContact();
      } else if (elementName == 'perSync-Location' && element == '100%') {
        searchLocation(self.valueSearchLocation);
      } else if (elementName == 'perSync-PaymentSource' && element == '100%') {
        getAllPaymentSource();
      }
    }

    if (checkComplete) {
      makeSearchProduct();
      makeSearchLocation();
      self.postMessage({
        action: 'sync-success',
        result: null,
      });
    }
  }
}

async function getJSONAsync() {
  var document = via.document;
  let json = await document.body.getElementsByClassName('checkCompleteSync').get();

  return json;
}

function objectStoreModel(name, key, autoIncrement, indexes) {
  this.name = name;
  this.key = key;
  this.indexes = indexes;
  this.autoIncrement = autoIncrement;
}

function dbIndex(name, unique) {
  this.name = name;
  this.unique = unique;
}

function statisticObj(object_type, last_fetch) {
  this.object_type = object_type;
  if (last_fetch == 'now') {
    var now = new Date();
    now.setHours(now.getHours());
    now.setMinutes(0, 0, 0);
    this.last_fetch = now.toISOString();
  } else {
    this.last_fetch = new Date(1970, 1, 1).toISOString();
  }
}

function sendRequest(method, url, requestModel, onsuccess, onerror, token) {
  let xmlHttp;
  if (XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else if (ActiveXObject) {
    try {
      xmlHttp = new ActiveXObject('Microsoft.XMLHTTP'); //IE 5.x, 6
    } catch (e) {
      console.log(e);
    }
  }
  if (!token) {
    throw Error('Not Authorize!!!');
  }
  xmlHttp.open(method, url);
  xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
  xmlHttp.setRequestHeader('Authorization', `Bearer ${token}`);
  xmlHttp.onreadystatechange = onCallback;
  function onCallback() {
    if (xmlHttp.readyState == 4) {
      if (xmlHttp.status == 200 || xmlHttp.status == 201) {
        var responseModel = JSON.parse(xmlHttp.responseText);
        onsuccess(responseModel);
      } else {
        var err = new Object();
        err.detail = xmlHttp.responseText;
        if (onerror) onerror(requestModel);
      }
    }
  }
  xmlHttp.send(JSON.stringify(requestModel));
}

function noAccents(str) {
  if (!str) return '';
  str = str.toLocaleLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/gi, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/gi, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/gi, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/gi, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/gi, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/gi, 'y');
  str = str.replace(/đ/gi, 'd');
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/gi, '');
  str = str.replace(/\u02C6|\u0306|\u031B/gi, '');

  return str;
}

function removeKeywordLocation(str) {
  if (!str) return '';
  str = str.replaceAll(',', '');
  str = str.replaceAll('tinh', '');
  str = str.replaceAll('xa', '');
  str = str.replaceAll('huyen', '');
  str = str.replaceAll('phuong', '');
  str = str.replaceAll('thi tran', '');
  str = str.replaceAll('thanh pho', '');
  str = str.replaceAll('quan', '');
  str = str.replaceAll('tp', '');
  str = str.replaceAll(' ', '');
  return str;
}
