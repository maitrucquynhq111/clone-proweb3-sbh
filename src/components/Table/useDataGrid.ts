import { useMemo, useReducer } from 'react';
import { gridActions } from './actions';
import { reducer as defaultReducer } from './reducer';
import { buildTableColumns } from './utils';

export const useDataGrid = <TQueryRsp, TResult>({
  query,
  getDataFromQuery,
  columnOptions,
  initStateFunction,
  selectable,
  dataKey,
}: ExpectedAny): ExpectedAny => {
  const reducer = defaultReducer;

  const [dataGridViewState, dispatch] = useReducer(reducer, {}, initStateFunction);

  const { isLoading, isLoadingError, isFetching, data: remoteData, queryKey, refetch } = query(dataGridViewState);

  const { data, totalCount, meta } = getDataFromQuery(remoteData ?? null);

  const loading = isLoading || isLoadingError || isFetching;
  const columns = useMemo(
    () => buildTableColumns(columnOptions, data[0] as unknown as ExpectedAny, selectable, dataKey),
    [remoteData, columnOptions],
  );

  const memoizedData = useMemo(() => data?.data || data, [data]);

  const onChangePage = (page: number) => gridActions.changePage(dispatch)(page);

  const changePageSize = (pageSize: number) => {
    gridActions.changePageSize(dispatch)(pageSize);
  };

  return {
    loading,
    totalCount,
    metaData: meta,
    columns,
    dispatch,
    dataGridViewState: dataGridViewState,
    onChangePage,
    changePageSize,
    data: memoizedData,
    remoteData,
    queryKey,
    refetch,
  };
};
