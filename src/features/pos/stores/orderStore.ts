import { emitChange } from '../utils';

let orders: PendingOrderForm[] = [];
let syncing = false;
let listeners: ExpectedAny = [];

export const orderStore = {
  setOrders(newOrders: PendingOrderForm[]) {
    orders = newOrders;
    emitChange(listeners);
  },
  setSyncing(newSyncing: boolean) {
    syncing = newSyncing;
    emitChange(listeners);
  },
  subscribe(listener: ExpectedAny) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l: ExpectedAny) => l !== listener);
    };
  },
  getSnapshot() {
    return orders;
  },
  getSnapshotSyncing() {
    return syncing;
  },
};
