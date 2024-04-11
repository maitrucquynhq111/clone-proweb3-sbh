import { emitChange } from '../utils';

let categories: string[] = [];
let listeners: ExpectedAny = [];

export const categoryStore = {
  setCategories(newCategories: string[]) {
    categories = newCategories;
    emitChange(listeners);
  },
  subscribe(listener: ExpectedAny) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l: ExpectedAny) => l !== listener);
    };
  },
  getSnapshot() {
    return categories;
  },
};
