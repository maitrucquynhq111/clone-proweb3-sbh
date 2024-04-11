import { useCallback, useMemo, useReducer } from 'react';
import { gridActions } from '~app/components/Table/actions';
import { reducer } from '~app/components/Table/reducer';

const useDataGrid = <TData>({ query, getDataFromQuery, initStateFunction }: ExpectedAny) => {
  const [dataGridViewState, dispatch] = useReducer(reducer, {}, initStateFunction);

  const { isLoading, isLoadingError, isFetching, data: remoteData, queryKey, refetch } = query(dataGridViewState);

  const { data, totalCount, meta } = getDataFromQuery(remoteData ?? null);

  const loading: boolean = isLoading || isLoadingError || isFetching;

  const memoizedData: TData[] = useMemo(() => data?.data || data, [data]);

  const onChangePage = useCallback(
    (page: number) => {
      gridActions.changePage(dispatch)(page);
    },
    [dispatch],
  );

  const onChangePageSize = useCallback(
    (pageSize: number) => {
      gridActions.changePageSize(dispatch)(pageSize);
    },
    [dispatch],
  );

  const onChangeVariable = useCallback(
    (variables: ExpectedAny) => {
      gridActions.setVariable(dispatch)(variables);
    },
    [dispatch],
  );

  const onChangeSort = useCallback(
    (data: ExpectedAny) => {
      gridActions.changeSort(dispatch)(data);
    },
    [dispatch],
  );

  const result = useMemo(
    () => ({
      loading,
      totalCount,
      data: memoizedData,
      metaData: meta,
      dataGridViewState: dataGridViewState,
      remoteData,
      queryKey,
      refetch,
      dispatch,
      onChangePage,
      onChangePageSize,
      onChangeVariable,
      onChangeSort,
    }),
    [
      loading,
      totalCount,
      memoizedData,
      meta,
      dataGridViewState,
      remoteData,
      queryKey,
      refetch,
      dispatch,
      onChangePage,
      onChangePageSize,
      onChangeVariable,
      onChangeSort,
    ],
  );

  return result;
};

export default useDataGrid;
