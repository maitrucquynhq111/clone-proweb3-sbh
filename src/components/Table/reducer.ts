import { ActionName } from './enums';

export const reducer = (state: ExpectedAny, action: ExpectedAny): ExpectedAny => {
  const { type, payload } = action;
  switch (type) {
    case ActionName.CHANGE_ORDER_BY:
      return {
        ...state,
        orderBy: payload?.orderBy ?? state?.orderBy,
        page: payload.page,
      };
    case ActionName.CHANGE_PAGE:
      return {
        ...state,
        page: payload.page,
      };
    case ActionName.CHANGE_SELECTED:
      return {
        ...state,
        checkedKeys: payload.checkedKeys,
      };
    case ActionName.CHANGE_PAGE_SIZE:
      return {
        ...state,
        pageSize: payload.pageSize,
        page: 1,
      };
    case ActionName.CHANGE_COMPACT:
      return {
        ...state,
        compact: payload.compact,
      };
    case ActionName.SET_VARIABLES:
      return { ...state, ...payload };
    default:
      return state;
  }
};
