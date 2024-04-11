import { forwardRef, useImperativeHandle, useEffect } from 'react';
import { Pagination, Table, Checkbox } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { PageSizeDropdown, HeaderButton } from './components';
import { gridActions } from './actions';
import { Loading, EmptyState } from '~app/components';
import { NoDataImage } from '~app/components/Icons';

const { Column, HeaderCell } = Table;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ReactTable = <TITem extends Record<string, unknown>>(
  {
    columns,
    data,
    loading,
    dataGridViewState,
    totalCount,
    onRowSelect,
    onChangePageSize,
    onChangePage,
    onRowClick,
    dispatch,
    onRefetch,
    selectable,
    dataKey,
    headerSelectAll,
    headerFilter,
    headerButton,
    disableRefresh,
    height,
    subHeader,
    compact,
    emptyIcon,
    emptyDescription,
    emptyDescription2,
    emptyButton,
    showPagination,
    wordWrap,
  }: ExpectedAny,
  ref: ExpectedAny,
): JSX.Element => {
  const { t } = useTranslation('common');
  const { orderBy, checkedKeys, pageSize, page } = dataGridViewState;

  let checked = false;
  let indeterminate = false;

  if (checkedKeys.length === data.length) {
    checked = true;
  } else if (checkedKeys.length === 0) {
    checked = false;
  } else if (checkedKeys.length > 0 && checkedKeys.length < data.length) {
    indeterminate = true;
  }

  useImperativeHandle(
    ref,
    () => ({
      resetRowSelection: () => {
        gridActions.changeSelected(dispatch)([]);
      },
      getSelectedFlatRows: () => {
        return data.map((item: ExpectedAny) => {
          return item?.[dataKey];
        });
      },
      getSelectedRowIds: () => {
        return checkedKeys;
      },
      setVariables: (variables: ExpectedAny) => {
        return gridActions.setVariable(dispatch)(variables);
      },
    }),
    [],
  );

  useEffect(() => {
    if (typeof onRowSelect === 'function') onRowSelect(checkedKeys);
  });

  const handleChangeSort = (sortColumn: ExpectedAny, sortType: ExpectedAny) => {
    gridActions.changeSort(dispatch)({
      id: sortColumn,
      direction: sortType,
    });
  };

  const handleCheckAll = (_: ExpectedAny, checked: ExpectedAny) => {
    const keys = checked ? data.map((item: ExpectedAny) => item?.[dataKey]) : [];
    gridActions.changeSelected(dispatch)(keys);
  };

  const handleCheck = (value: ExpectedAny, checked: ExpectedAny) => {
    const keys = checked
      ? [...checkedKeys, value?.[dataKey]]
      : checkedKeys.filter((item: ExpectedAny) => item !== value?.[dataKey]);
    gridActions.changeSelected(dispatch)(keys);
  };

  const selected = (
    <div className="pw-pt-1">
      {t('selected')}:
      <strong className="pw-ml-1 pw-text-green-700">
        {checkedKeys.length} {t('row')}
      </strong>
    </div>
  );

  const HeaderSelectAllComponent = headerSelectAll || <></>;

  const selectedData = data.filter((item: ExpectedAny) => checkedKeys.includes(item?.[dataKey]));

  return (
    <>
      <div className="pw-flex pw-pb-4 pw-items-start pw-justify-between">
        {(headerFilter && headerFilter) || <span></span>}
        <HeaderButton
          onRefetch={onRefetch}
          dispatch={dispatch}
          headerButton={headerButton}
          dataGridViewState={dataGridViewState}
          disableRefresh={disableRefresh}
        />
      </div>
      {subHeader || <></>}
      <div className="pw-relative">
        {data?.length > 0 ? (
          <>
            {checkedKeys.length > 0 && (
              <div className="pw-h-10 pw-px-2 pw-left-14 pw-flex pw-items-center pw-justify-between pw-bg-neutral-100 pw-right-0 pw-absolute pw-z-[5]">
                {selected}
                {headerSelectAll && <HeaderSelectAllComponent selected={checkedKeys} selectedData={selectedData} />}
              </div>
            )}
            <Table
              sortColumn={orderBy?.id}
              sortType={orderBy?.sortType}
              bordered
              {...(!height && { autoHeight: true })}
              {...((height && { height }) || (data.length <= 0 && { height: 400 }))}
              onRowClick={onRowClick}
              cellBordered
              affixHorizontalScrollbar
              data={data}
              loading={loading}
              renderEmpty={() => (
                <EmptyState
                  hiddenButton={true}
                  icon={emptyIcon || <NoDataImage />}
                  description1={emptyDescription || t('no-data')}
                />
              )}
              wordWrap={wordWrap}
              rowHeight={compact ? 60 : 46}
              onSortColumn={handleChangeSort}
              renderLoading={() => <Loading backdrop />}
            >
              {columns.map((column: ExpectedAny) => {
                const { Cell, compact, justifyContent, ...rest } = column;
                const isSelect = selectable && column?.key === dataKey;
                return (
                  <Column {...rest} fullText>
                    <HeaderCell style={isSelect ? { padding: 0 } : {}}>
                      {isSelect ? (
                        <div className="pw-leading-10 pw-h-full pw-flex pw-items-center">
                          <Checkbox
                            className="pw-p-0 pw-z-20 pw-relative"
                            inline
                            checked={checked}
                            indeterminate={indeterminate}
                            onChange={handleCheckAll}
                          />
                        </div>
                      ) : (
                        column.label
                      )}
                    </HeaderCell>
                    <column.Cell
                      checkedKeys={checkedKeys}
                      dataKey={column.key}
                      compact={compact}
                      onSelect={handleCheck}
                      justifyContent={justifyContent}
                      className={onRowClick ? 'pw-cursor-pointer' : ''}
                    />
                  </Column>
                );
              })}
            </Table>
          </>
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
      {showPagination && data?.length > 0 && (
        <div className="pw-flex pw-py-4 pw-justify-between pw-items-center">
          <PageSizeDropdown value={pageSize} onChange={onChangePageSize} />
          <Pagination
            prev
            next
            first
            last
            ellipsis
            maxButtons={5}
            layout={['-', 'pager']}
            total={totalCount}
            limit={pageSize}
            activePage={page}
            onChangePage={onChangePage}
          />
        </div>
      )}
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TableUI = forwardRef(ReactTable) as <P extends Record<string, unknown>>(
  props: ExpectedAny & { ref?: ExpectedAny },
) => ReturnType<typeof ReactTable>;
