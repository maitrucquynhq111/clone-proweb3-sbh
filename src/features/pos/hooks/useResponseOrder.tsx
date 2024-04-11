import createFastContext from '~app/utils/hooks/createFastContext';

export const { Provider: ResponseOrderProvider, useStore: useResponseOrderStore } =
  createFastContext<ExpectedAny>(null);
