import { useCallback, useRef, useState, useEffect } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { TableHeaderAction, DebtAnalytics } from './components';
import { initFilterValues, columnOptions, filterOptions, convertFilter } from './config';
import { ModalTypes } from '~app/modals/types';
import { useContactsQuery } from '~app/services/queries';
import { Table, Filter } from '~app/components';
import { TabKeyType } from '~app/features/contacts/details/components/ContactTabs/utils';
import { isJsonString } from '~app/utils/helpers';

const Debt = (): JSX.Element => {
  const tableRef = useRef<ExpectedAny>();
  const filterRef = useRef<ExpectedAny>();
  const location = useLocation();
  const navigate = useNavigate();
  const [variablesFilter, setVariablesFilter] = useState<ExpectedAny>({
    ...initFilterValues.primary,
    ...convertFilter(initFilterValues.secondary),
  });

  useEffect(() => {
    if (location.state) {
      const optionsState =
        location.state?.options && isJsonString(location.state?.options) ? JSON.parse(location.state?.options) : [];
      filterRef?.current?.handleSetSecondaryVariables({
        options: optionsState,
      });
      filterRef?.current?.setValueSecondaryFilter('options', optionsState);
      // clear the state location
      navigate(location.pathname, { replace: true });
    }
  }, []);

  const handleFilter = useCallback((values: ExpectedAny) => {
    setVariablesFilter(values);
    tableRef?.current?.setVariables(convertFilter(values));
  }, []);

  const onRowClick = (rowData: ExpectedAny) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.ContactDetails,
        tab: TabKeyType.DEBT,
        id: rowData.id,
      })}`,
    });
  };

  return (
    <div>
      <Table<ExpectedAny, ExpectedAny>
        ref={tableRef}
        columnOptions={columnOptions()}
        variables={{
          ...initFilterValues.primary,
          ...initFilterValues.secondary,
        }}
        query={useContactsQuery}
        onRowClick={onRowClick}
        dataKey="id"
        headerFilter={
          <Filter
            ref={filterRef}
            initValues={initFilterValues}
            onFilter={handleFilter}
            filterOptions={filterOptions()}
          />
        }
        compact
        subHeader={<DebtAnalytics />}
        headerButton={
          <TableHeaderAction
            options={{
              ...variablesFilter,
              transaction_type: '',
            }}
            isBuffer={true}
          />
        }
      />
    </div>
  );
};
export default Debt;
