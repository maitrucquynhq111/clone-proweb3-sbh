import cx from 'classnames';
import { ComponentType, Fragment, Ref, forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
  Row,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import { Checkbox, Pagination } from 'rsuite';
import SortUpIcon from '@rsuite/icons/SortUp';
import SortDownIcon from '@rsuite/icons/SortDown';
import SortIcon from '@rsuite/icons/Sort';
import useDataGrid from './useDataGrid';
import { initStateFunction as getInitStateFunction } from '~app/components/Table/constants';
import { HeaderButton, PageSizeDropdown } from '~app/components/Table/components';
import { EmptyState } from '~app/components';
import { NoDataImage } from '~app/components/Icons';

type TableProps<TData> = {
  query: ExpectedAny;
  columns: ColumnDef<TData>[];
  selectable?: boolean;
  tableClassName?: string;
  variables?: ExpectedAny;
  headerFilter?: ExpectedAny;
  headerButton?: ExpectedAny;
  emptyIcon?: ExpectedAny;
  emptyDescription?: ExpectedAny;
  emptyDescription2?: ExpectedAny;
  emptyButton?: ExpectedAny;
  showPagination?: boolean;
  disableRefresh?: boolean;
  subHeader?: ExpectedAny;
  dataKey?: string;
  headerSelectAll?: ExpectedAny;
  sortOptions?: ExpectedAny;
  onRowClick?: (row: Row<TData>) => void;
  SubComponent?: ComponentType<{ rowData: TData; queryKey?: string }>;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  getRowId?: (row: TData, relativeIndex: number, parent?: Row<TData>) => string;
};

const getDataFromQuery = (data: ExpectedAny) => {
  return {
    data: data?.data?.data || data?.data || [],
    totalCount: data?.data?.meta?.total_rows || data?.meta?.total_rows || 0,
    meta: data?.meta || {},
  };
};

export type TableRef = {
  handleSetVariables: (variables: ExpectedAny) => void;
  handleRefesh: () => void;
  handleGetMetaData: () => ExpectedAny;
  handleGetQueryKey: () => ExpectedAny;
};

const Table = <TData extends Record<string, ExpectedAny>>(props: TableProps<TData>, ref: Ref<TableRef>) => {
  const { t } = useTranslation('common');
  const {
    query,
    columns,
    selectable,
    variables,
    emptyButton,
    emptyIcon,
    emptyDescription,
    emptyDescription2,
    headerSelectAll,
    subHeader,
    headerButton,
    headerFilter,
    tableClassName,
    showPagination = true,
    disableRefresh = false,
    dataKey = 'id',
    sortOptions,
    getRowCanExpand,
    getRowId,
    onRowClick,
    SubComponent,
  } = props;
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const initStateFunction = useMemo(() => {
    return getInitStateFunction({ ...variables, orderBy: sortOptions });
  }, [variables, sortOptions]);

  const {
    data,
    totalCount,
    metaData,
    dataGridViewState,
    queryKey,
    // loading,
    remoteData,
    refetch,
    dispatch,
    onChangePage,
    onChangePageSize,
    onChangeVariable,
    onChangeSort,
  } = useDataGrid<TData>({ query, getDataFromQuery, initStateFunction });

  const tableColumns = useMemo(() => {
    if (selectable && !columns.find((item) => item.id === 'checkbox')) {
      columns.unshift({
        id: 'checkbox',
        header: ({ table }) => {
          return (
            <Checkbox
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={(_value, _checked, event) => {
                event.stopPropagation();
                table.getToggleAllRowsSelectedHandler()(event);
              }}
            />
          );
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              indeterminate={row.getIsSomeSelected()}
              onChange={(_value, _checked, event) => {
                event.stopPropagation();
                row.getToggleSelectedHandler()(event);
              }}
            />
          );
        },
        size: 56,
        meta: {
          align: 'center',
          isPinned: true,
        },
      });
      return columns;
    }
    return columns;
  }, [columns, selectable]);

  const tableData = useMemo(() => {
    if (data) return data;
    return [];
  }, [data]);

  const checkedKeys = useMemo(() => {
    return Object.keys(rowSelection);
  }, [rowSelection]);

  const selectedData = useMemo(() => {
    return tableData.filter((item) => checkedKeys.includes(item?.[dataKey]));
  }, [tableData, checkedKeys, dataKey]);

  const table = useReactTable<TData>({
    data: tableData,
    columns: tableColumns,
    state: {
      rowSelection,
      sorting,
    },
    enableRowSelection: true,
    enableSorting: true,
    manualSorting: true,
    manualPagination: true,
    onSortingChange: (callback) => {
      setSorting((prevState) => {
        const newState = typeof callback === 'function' ? callback(prevState) : prevState;
        const sort = newState[0];
        if (sorting.length === 0) {
          onChangeSort({
            id: '',
            direction: '',
          });
        }
        const value = { id: sort?.id || '', direction: sort?.desc ? 'desc' : 'asc' };
        onChangeSort(value);
        return newState;
      });
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowCanExpand,
    getRowId,
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  });

  useEffect(() => {
    if (
      (remoteData?.meta?.total_pages < dataGridViewState.page && dataGridViewState.page > 1) ||
      (remoteData?.data?.meta?.total_pages < dataGridViewState.page && dataGridViewState.page > 1)
    ) {
      onChangePage(dataGridViewState.page - 1);
    }
  }, [dataGridViewState.page, JSON.stringify(remoteData)]);

  useEffect(() => {
    table.resetRowSelection();
  }, [tableData]);

  useImperativeHandle(
    ref,
    () => ({
      handleGetMetaData: () => metaData,
      handleSetVariables: (variables: ExpectedAny) => onChangeVariable(variables),
      handleGetQueryKey: () => queryKey,
      handleRefesh: () => {
        refetch?.();
        table.resetRowSelection();
      },
    }),
    [queryKey],
  );

  const HeaderSelectAllComponent = headerSelectAll || <></>;

  const checkboxWidth = useMemo(() => {
    return document.querySelector('.pw-table .pw-checkbox')?.getBoundingClientRect().width || 0;
  }, [checkedKeys]);

  return (
    <>
      <div className="pw-flex pw-pb-4 pw-items-start pw-justify-between">
        {(headerFilter && headerFilter) || <span></span>}
        <HeaderButton
          onRefetch={refetch}
          dispatch={dispatch}
          headerButton={headerButton}
          dataGridViewState={dataGridViewState}
          disableRefresh={disableRefresh}
        />
      </div>
      {subHeader || <></>}
      <div className="pw-relative">
        {checkedKeys.length > 0 ? (
          <div
            className="pw-h-9 pw-px-2 pw-flex pw-items-center pw-justify-between pw-bg-neutral-100 pw-right-0 pw-absolute pw-z-[5]"
            style={{
              left: `${checkboxWidth}px`,
            }}
          >
            <Selected totalSelectedCount={checkedKeys.length} />
            {headerSelectAll && <HeaderSelectAllComponent selected={checkedKeys} selectedData={selectedData} />}
          </div>
        ) : null}
        {tableData.length > 0 ? (
          <div className="pw-overflow-x-auto pw-table-container">
            <table className={cx(tableClassName, 'pw-table pw-w-full')} cellPadding={12}>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const sortable = (header.column.columnDef.meta as ExpectedAny)?.sortable || false;
                      const isPinned = (header.column.columnDef.meta as ExpectedAny)?.isPinned || false;
                      const isCheckbox = (header.column.columnDef as ExpectedAny)?.id === 'checkbox';
                      const handleSort = header.column.getToggleSortingHandler();
                      return (
                        <th
                          key={header.id}
                          colSpan={header.colSpan}
                          align={(header.column.columnDef.meta as ExpectedAny)?.align || 'left'}
                          style={{
                            minWidth:
                              header.column.getSize() === Number.MAX_SAFE_INTEGER ? 'auto' : header.column.getSize(),
                          }}
                          className={cx({
                            'pw-sticky pw-left-0 pw-z-10': isPinned,
                            'pw-checkbox': isCheckbox,
                          })}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!sortable) return;
                                handleSort?.(e);
                              }}
                              className={cx({
                                'pw-cursor-pointer': sortable,
                                '!pw-p-0 pw-flex pw-items-center pw-justify-center':
                                  header.column.columnDef.id === 'checkbox',
                              })}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {sortable ? (
                                <span className="rs-table-cell-header-sort-wrapper">
                                  {{
                                    asc: (
                                      <SortDownIcon className="rs-table-cell-header-icon-sort rs-table-cell-header-icon-sort-asc rs-icon" />
                                    ),
                                    desc: (
                                      <SortUpIcon className="rs-table-cell-header-icon-sort rs-table-cell-header-icon-sort-desc rs-icon" />
                                    ),
                                  }[header.column.getIsSorted() as string] ??
                                    (sortable ? <SortIcon className="rs-table-cell-header-icon-sort rs-icon" /> : null)}
                                </span>
                              ) : null}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => {
                  const isExpanded = row.getIsExpanded();
                  return (
                    <Fragment key={row.id}>
                      <tr>
                        {row.getVisibleCells().map((cell) => {
                          const isPinned = (cell.column.columnDef.meta as ExpectedAny)?.isPinned || false;
                          const isFullCell = (cell.column.columnDef.meta as ExpectedAny)?.isFullCell || false;
                          const isSelected = row.getIsSelected();
                          return (
                            <td
                              key={cell.id}
                              style={{
                                minWidth:
                                  cell.column.getSize() === Number.MAX_SAFE_INTEGER ? 'auto' : cell.column.getSize(),
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (cell.column.columnDef.id === 'checkbox') return;
                                if (onRowClick) return onRowClick?.(row);
                              }}
                              className={cx({
                                'pw-sticky pw-left-0 pw-z-10': isPinned,
                                'pw-cell-selected': isSelected,
                                'pw-cursor-pointer': !!onRowClick,
                                'pw-cell-expanded': isExpanded,
                              })}
                            >
                              <div
                                className={cx({
                                  '!pw-p-0 pw-flex pw-items-center pw-justify-center':
                                    cell.column.columnDef.id === 'checkbox',
                                  'pw-p-0 pw-w-full pw-h-full pw-flex pw-items-center': isFullCell,
                                })}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                      {isExpanded && SubComponent ? <SubComponent rowData={row.original} queryKey={queryKey} /> : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            hiddenButton={!emptyButton}
            customButton={emptyButton}
            icon={emptyIcon || <NoDataImage />}
            description1={emptyDescription || t('no-data')}
            description2={emptyDescription2 || ''}
          />
        )}
      </div>
      {showPagination && tableData.length > 0 ? (
        <div className="pw-flex pw-py-4 pw-justify-between pw-items-center">
          <PageSizeDropdown
            value={dataGridViewState.pageSize}
            onChange={(value) => onChangePageSize(value ? value : 5)}
          />
          <Pagination
            prev
            next
            first
            last
            ellipsis
            maxButtons={5}
            layout={['-', 'pager']}
            total={totalCount}
            limit={dataGridViewState.pageSize}
            activePage={dataGridViewState.page}
            onChangePage={onChangePage}
          />
        </div>
      ) : null}
    </>
  );
};

const Selected = ({ totalSelectedCount }: { totalSelectedCount: number }) => {
  const { t } = useTranslation('common');
  return (
    <div className="pw-pt-1">
      {t('selected')}:
      <strong className="pw-ml-1 pw-text-green-700">
        {totalSelectedCount} {t('row')}
      </strong>
    </div>
  );
};

export const TanstackTable = forwardRef(Table) as <TData extends Record<string, ExpectedAny>>(
  props: TableProps<TData> & { ref?: Ref<TableRef> },
) => ExpectedAny;
