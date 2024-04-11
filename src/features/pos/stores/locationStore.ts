import { emitChange } from '../utils';

let locations: AddressLocation[] = [];
let listeners: ExpectedAny = [];

export const locationStore = {
  setLocations(newLocations: AddressLocation[]) {
    locations = newLocations;
    emitChange(listeners);
  },
  subscribe(listener: ExpectedAny) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l: ExpectedAny) => l !== listener);
    };
  },
  getSnapshot() {
    return locations;
  },
};
