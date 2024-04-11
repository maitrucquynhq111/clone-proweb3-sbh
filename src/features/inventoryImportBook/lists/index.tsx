import { useCallback, useRef } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { initFilterValues, columnOptions, convertFilter, filterOptions } from './config';
import { TableHeaderAction } from './components';
import { useInventoryImportBookQuery } from '~app/services/queries';
import { Filter, Table } from '~app/components';
import { ModalPlacement, ModalSize, ModalTypes } from '~app/modals';

const InventoryImportBook = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const tableRef = useRef<ExpectedAny>();

  const handleFilter = useCallback((values: ExpectedAny) => {
    tableRef?.current?.setVariables(convertFilter(values));
  }, []);

  const onRowClick = (rowData: InventoryImportBook) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.ImportGoodsDetails,
        placement: ModalPlacement.Top,
        size: ModalSize.Full,
        po_code: rowData.po_code,
        id: rowData.id,
      })}`,
    });
  };

  return (
    <div>
      <Table<ExpectedAny, ExpectedAny>
        ref={tableRef}
        columnOptions={columnOptions({ onClick: onRowClick })}
        variables={convertFilter(initFilterValues.primary)}
        query={useInventoryImportBookQuery}
        dataKey="id"
        onRowClick={onRowClick}
        headerButton={<TableHeaderAction options={initFilterValues.primary} />}
        headerFilter={<Filter initValues={initFilterValues} onFilter={handleFilter} filterOptions={filterOptions()} />}
      />
    </div>
  );
};
export default InventoryImportBook;
