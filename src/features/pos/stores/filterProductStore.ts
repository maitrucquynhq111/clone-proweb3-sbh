import { emitChange } from '../utils';

export type PosFilter = {
  sortBy?: 'name' | 'normal_price' | 'created_at' | 'sold_quantity';
  sortValue?: 'asc' | 'desc';
  category?: string[];
  search?: string;
};

export const defaultFilterProduct: PosFilter = {
  sortBy: 'created_at',
  sortValue: 'desc',
  category: [],
  search: '',
};

let filter: PosFilter = defaultFilterProduct;

let listeners: ExpectedAny = [];

export const filterProductStore = {
  setFilter(newFilter: PosFilter) {
    filter = {
      ...filter,
      ...newFilter,
    };
    emitChange(listeners);
  },
  subscribe(listener: ExpectedAny) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l: ExpectedAny) => l !== listener);
    };
  },
  getSnapshot() {
    return filter;
  },
};
