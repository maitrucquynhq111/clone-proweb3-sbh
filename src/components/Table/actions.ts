import { ActionName } from './enums';

export const gridActions = {
  changePage:
    (dispatch: ExpectedAny) =>
    (page: number): void => {
      return dispatch({ type: ActionName.CHANGE_PAGE, payload: { page } });
    },
  changePageSize:
    (dispatch: ExpectedAny) =>
    (pageSize: number): void => {
      return dispatch({
        type: ActionName.CHANGE_PAGE_SIZE,
        payload: { pageSize, page: 1 },
      });
    },
  changeSort:
    (dispatch: ExpectedAny) =>
    (orderBy: ExpectedAny): void => {
      return dispatch({
        type: ActionName.CHANGE_ORDER_BY,
        payload: { orderBy },
      });
    },
  changeSelected:
    (dispatch: ExpectedAny) =>
    (checkedKeys: ExpectedAny): void => {
      return dispatch({
        type: ActionName.CHANGE_SELECTED,
        payload: { checkedKeys },
      });
    },
  setVariable:
    (dispatch: ExpectedAny) =>
    (variable: ExpectedAny): void => {
      return dispatch({
        type: ActionName.SET_VARIABLES,
        payload: { page: 1, ...variable },
      });
    },

  changeCompact:
    (dispatch: ExpectedAny) =>
    (compact: ExpectedAny): void => {
      return dispatch({
        type: ActionName.CHANGE_COMPACT,
        payload: { compact },
      });
    },
};
