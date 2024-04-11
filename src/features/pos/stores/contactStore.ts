import { emitChange } from '../utils';

let contacts: Contact[] = [];
let listeners: ExpectedAny = [];

export const contactStore = {
  setContacts(newContacts: Contact[]) {
    contacts = newContacts;
    emitChange(listeners);
  },
  subscribe(listener: ExpectedAny) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l: ExpectedAny) => l !== listener);
    };
  },
  getSnapshot() {
    return contacts;
  },
};
