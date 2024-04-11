import { emitChange } from '../utils';

let paymentSources: Payment[] = [];
let listeners: ExpectedAny = [];

export const paymentSourceStore = {
  setPaymentSources(newPaymentSources: Payment[]) {
    paymentSources = newPaymentSources;
    emitChange(listeners);
  },
  subscribe(listener: ExpectedAny) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l: ExpectedAny) => l !== listener);
    };
  },
  getSnapshot() {
    return paymentSources;
  },
};
