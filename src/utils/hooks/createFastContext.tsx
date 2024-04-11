import React, { useRef, createContext, useContext, useCallback, useSyncExternalStore } from 'react';

const isPrimitive = (test: ExpectedAny) => {
  return test !== Object(test);
};

type SetAction<Store> = Store | ((prevState: Store) => Store);

export default function createFastContext<Store>(initialState: Store) {
  function useStoreData(): {
    get: () => Store;
    set: (value: SetAction<Store>) => void;
    subscribe: (callback: () => void) => () => void;
  } {
    const store = useRef(initialState);

    const get = useCallback(() => store.current, []);

    const subscribers = useRef(new Set<() => void>());

    const set = useCallback((value: SetAction<Store>) => {
      if (typeof value === 'function') {
        const newValue = value as (prevState: Store) => Store;
        const result = newValue(store.current);
        store.current = result;
      } else if (isPrimitive(value) || Array.isArray(value)) {
        store.current = value;
      } else {
        store.current = { ...store.current, ...value };
      }
      subscribers.current.forEach((callback) => callback());
    }, []);

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      set,
      subscribe,
    };
  }

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

  const StoreContext = createContext<UseStoreDataReturnType | null>(null);

  function Provider({ children }: { children: React.ReactNode }) {
    return <StoreContext.Provider value={useStoreData()}>{children}</StoreContext.Provider>;
  }

  function useStore<SelectorOutput>(
    selector: (store: Store) => SelectorOutput,
  ): [SelectorOutput, (value: SetAction<Store>) => void] {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error('Store not found');
    }

    const state = useSyncExternalStore(
      store.subscribe,
      () => selector(store.get()),
      () => selector(initialState),
    );

    return [state, store.set];
  }

  return {
    Provider,
    useStore,
  };
}
