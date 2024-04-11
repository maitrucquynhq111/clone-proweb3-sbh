import { PackageKey } from '~app/utils/constants';

let packageInfo: PackageInfo = { package_key: PackageKey.FREE, expire_time: '' };
let listeners: ExpectedAny = [];

export const packageStore = {
  setPackage(newData: PackageInfo) {
    packageInfo = newData;
    emitChange();
  },
  subscribe(listener: ExpectedAny) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l: ExpectedAny) => l !== listener);
    };
  },
  getSnapshot() {
    return packageInfo;
  },
};

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

type PackageInfo = { package_key: string; expire_time: string };
