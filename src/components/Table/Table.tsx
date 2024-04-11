//TODO: Using ExpectedAny for now, but should be replaced with the correct type in the future.
import { useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import { DefaultColumnOptions, initStateFunction } from './constants';
import { useDataGrid } from './useDataGrid';
import { TableUI } from './TableUI';
import { gridActions } from './actions';

const DataGrid = (
  {
    query,
    sortOptions,
    columnOptions = DefaultColumnOptions,
    onRowSelect,
    onRowClick,
    selectable,
    dataKey = 'id',
    headerSelectAll,
    headerFilter,
    subHeader,
    headerButton,
    variables,
    height,
    disableRefresh = false,
    compact = false,
    emptyIcon = null,
    emptyDescription = null,
    emptyDescription2 = null,
    emptyButton,
    showPagination = true,
    wordWrap = undefined,
  }: ExpectedAny,
  ref: ExpectedAny,
): JSX.Element => {
  const tableUIRef = useRef<ExpectedAny>();

  const getDataFromQuery = (data: ExpectedAny) => {
    return {
      data: data?.data?.data || data?.data || [],
      totalCount: data?.data?.meta?.total_rows || data?.meta?.total_rows || 0,
      meta: data?.meta || {},
    };
  };

  const initStateF = initStateFunction({
    orderBy: sortOptions,
    ...variables,
  });

  const {
    loading,
    totalCount,
    metaData,
    columns,
    dataGridViewState,
    data,
    remoteData,
    initialStateTable,
    onChangePage,
    changePageSize,
    dispatch,
    refetch,
  } = useDataGrid<ExpectedAny, ExpectedAny>({
    getDataFromQuery,
    columnOptions,
    sortOptions,
    initStateFunction: initStateF,
    ref,
    query,
    selectable,
    dataKey,
  });
  useEffect(() => {
    tableUIRef?.current?.resetRowSelection();
    if (
      (remoteData?.meta?.total_pages < dataGridViewState.page && dataGridViewState.page > 1) ||
      (remoteData?.data?.meta?.total_pages < dataGridViewState.page && dataGridViewState.page > 1)
    ) {
      gridActions.changePage(dispatch)(dataGridViewState.page - 1);
    }
  }, [dataGridViewState.page, dataGridViewState.pageSize, dataGridViewState.orderBy, JSON.stringify(remoteData)]);

  useImperativeHandle(
    ref,
    () => ({
      getMetaData: () => metaData,
      getSelectedRowIds: () => tableUIRef?.current?.getSelectedRowIds(),
      getSelectedFlatRows: () => tableUIRef?.current?.getSelectedFlatRows(),
      setVariables: (variables: ExpectedAny) => {
        tableUIRef?.current?.setVariables(variables);
      },
      refresh: () => {
        refetch?.();
        tableUIRef?.current?.resetRowSelection();
      },
    }),
    [],
  );

  return (
    <TableUI
      height={height}
      dispatch={dispatch}
      ref={tableUIRef}
      columns={columns}
      data={data}
      onRefetch={refetch}
      loading={loading}
      sortOptions={sortOptions}
      onRowSelect={onRowSelect}
      dataGridViewState={dataGridViewState}
      onRowClick={onRowClick}
      totalCount={totalCount}
      onChangePageSize={changePageSize}
      onChangePage={onChangePage}
      initialState={initialStateTable}
      selectable={selectable}
      dataKey={dataKey}
      headerSelectAll={headerSelectAll}
      headerFilter={headerFilter}
      subHeader={subHeader}
      headerButton={headerButton}
      disableRefresh={disableRefresh}
      compact={compact}
      emptyIcon={emptyIcon}
      emptyDescription={emptyDescription}
      emptyDescription2={emptyDescription2}
      emptyButton={emptyButton}
      showPagination={showPagination}
      wordWrap={wordWrap}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Table = forwardRef(DataGrid) as <T, P>(props: ExpectedAny & { ref?: ExpectedAny }) => ExpectedAny;

export default Table;
