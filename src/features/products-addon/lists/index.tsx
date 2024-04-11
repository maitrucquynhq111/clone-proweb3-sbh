import { useCallback, useRef } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { TableHeaderAction } from './components';
import { initFilterValues, columnOptions, filterOptions } from './config';
import { ModalTypes } from '~app/modals/types';
import { Table, Filter } from '~app/components';
import { useProductsAddonQuery } from '~app/services/queries';

const ContactsGroupList = (): JSX.Element => {
  const tableRef = useRef<ExpectedAny>();
  const location = useLocation();
  const navigate = useNavigate();

  const handleFilter = useCallback((values: ExpectedAny) => {
    tableRef?.current?.setVariables(values);
  }, []);

  const onRowClick = (rowData: ProductAddOn) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.ProductAddonDetails,
        id: rowData.id,
      })}`,
    });
  };

  return (
    <div>
      <Table<ExpectedAny, ExpectedAny>
        ref={tableRef}
        columnOptions={columnOptions()}
        variables={initFilterValues}
        query={useProductsAddonQuery}
        onRowClick={onRowClick}
        dataKey="id"
        compact
        headerButton={<TableHeaderAction />}
        headerFilter={<Filter initValues={initFilterValues} onFilter={handleFilter} filterOptions={filterOptions()} />}
      />
    </div>
  );
};
export default ContactsGroupList;
