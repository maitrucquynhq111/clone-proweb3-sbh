/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

function syncData() {
  syncProducts();
  syncCategories();
  syncContacts();
  syncPaymentSource();
  // syncContactGroup();
}

function syncPaymentSource() {
  if (Database.dbInstance !== null) {
    console.log('---> Sync data: Payment Source');
    PaymentSource.synch.fetch();
  } else {
    setTimeout(() => {
      syncPaymentSource();
    }, 2000);
  }
}

function syncLocations() {
  if (Database.dbInstance !== null) {
    console.log('---> Sync data: Locations');

    Location.synch.fetch();
  } else {
    setTimeout(() => {
      syncLocations();
    }, 2000);
  }
}

function syncCategories() {
  if (Database.dbInstance !== null) {
    console.log('---> Sync data: Categories');
    Category.synch.fetch();
  } else {
    setTimeout(() => {
      syncCategories();
    }, 2000);
  }
}

function syncProducts() {
  if (Database.dbInstance !== null) {
    console.log('---> Sync data: Products');
    Product.synch.fetch();
  } else {
    setTimeout(() => {
      syncProducts();
    }, 2000);
  }
}

function syncContacts() {
  if (Database.dbInstance !== null) {
    console.log('---> Sync data: Contacts');
    Contacts.synch.fetch();
  } else {
    setTimeout(() => {
      syncContacts();
    }, 2000);
  }
}

function syncContactGroup() {
  if (Database.dbInstance !== null) {
    console.log('---> Sync data: ContactGroup');
    ContactGroup.synch.fetch();
  } else {
    setTimeout(() => {
      syncContactGroup();
    }, 2000);
  }
}
