import { useCallback, useRef, useState } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { TableHeaderAction, TransactionAnalytics, HeaderSelectAll } from './components';
import { initFilterValues, columnOptions, filterOptions, convertFilter } from './config';
import { ModalTypes, ModalPlacement, ModalSize } from '~app/modals/types';
import { useGetTransactionHistoryQuery } from '~app/services/queries';
import { CashBookType } from '~app/utils/constants';
import { Table, Filter } from '~app/components';

const Transactions = (): JSX.Element => {
  const tableRef = useRef<ExpectedAny>();
  const [variablesFilter, setVariablesFilter] = useState<ExpectedAny>(convertFilter(initFilterValues.primary));
  const location = useLocation();
  const navigate = useNavigate();

  const handleFilter = useCallback((values: ExpectedAny) => {
    const variables = convertFilter(values);
    setVariablesFilter(variables);
    tableRef?.current?.setVariables(variables);
  }, []);

  const onRowClick = (rowData: ExpectedAny) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: rowData.txn_type === 'ctxn' ? ModalTypes.DebtDetails : ModalTypes.CashbookDetails,
        id: rowData.id,
        transaction_type: rowData['transaction_type'] as CashBookType,
        placement: ModalPlacement.Right,
        size: ModalSize.Xsmall,
        contact_transaction: rowData,
      })}`,
    });
  };

  return (
    <div>
      <Table<ExpectedAny, ExpectedAny>
        headerSelectAll={({ selected }: { selected: string[] }) => {
          return <HeaderSelectAll selected={selected} />;
        }}
        ref={tableRef}
        columnOptions={columnOptions()}
        variables={convertFilter(initFilterValues.primary)}
        query={useGetTransactionHistoryQuery}
        onRowClick={onRowClick}
        dataKey="id"
        selectable
        // compact
        headerButton={<TableHeaderAction />}
        headerFilter={<Filter initValues={initFilterValues} onFilter={handleFilter} filterOptions={filterOptions()} />}
        subHeader={<TransactionAnalytics options={variablesFilter} />}
      />
    </div>
  );
};
export default Transactions;
