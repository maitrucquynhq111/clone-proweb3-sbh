import { emitChange } from '../utils';

let products: Product[] = [];
let listeners: ExpectedAny = [];

export const productStore = {
  setProducts(newProducts: Product[]) {
    products = newProducts;
    emitChange(listeners);
  },
  subscribe(listener: ExpectedAny) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l: ExpectedAny) => l !== listener);
    };
  },
  getSnapshot() {
    return products;
  },
};
