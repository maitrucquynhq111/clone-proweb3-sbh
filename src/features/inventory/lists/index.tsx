import { useCallback, useRef, useState } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { InventoryBookAnalytics, TableHeaderAction } from './components';
import { initFilterValues, columnOptions, filterOptions, convertFilter } from './config';
import { useInventoryQuery } from '~app/services/queries';
import { Table, Filter } from '~app/components';
import { ModalPlacement, ModalSize, ModalTypes } from '~app/modals';
import { InventoryCategory, InventoryObjectType, InventoryTransactionType, InventoryType } from '~app/utils/constants';

const InventoryList = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const tableRef = useRef<ExpectedAny>();
  const [variablesFilter, setVariablesFilter] = useState<ExpectedAny>(convertFilter(initFilterValues.primary));

  const handleFilter = useCallback((values: ExpectedAny) => {
    tableRef?.current?.setVariables(convertFilter(values));
    setVariablesFilter(convertFilter(values));
  }, []);

  const onRowClick = (rowData: Inventory) => {
    if (
      rowData.type === InventoryType.INBOUND ||
      rowData.category_name === InventoryCategory.INBOUND_CANCELLED ||
      (rowData.object_type_po === InventoryObjectType.ORDER && rowData.transaction_type === InventoryTransactionType.IN)
    ) {
      return navigate({
        pathname: location.pathname,
        search: `?${createSearchParams({
          modal: ModalTypes.ImportGoodsDetails,
          placement: ModalPlacement.Top,
          size: ModalSize.Full,
          id: rowData.po_id,
          po_code: rowData.po_code,
        })}`,
      });
    }
    if (
      rowData.type === InventoryType.OUTBOUND ||
      rowData.po_code.includes('HXH') ||
      (rowData.object_type_po === InventoryObjectType.ORDER &&
        rowData.transaction_type === InventoryTransactionType.OUT)
    ) {
      return navigate({
        pathname: location.pathname,
        search: `?${createSearchParams({
          modal: ModalTypes.ExportGoodsDetails,
          placement: ModalPlacement.Top,
          size: ModalSize.Full,
          id: rowData.po_id,
          po_code: rowData.po_code,
        })}`,
      });
    }
    if (rowData.type === InventoryType.STOCKTAKE) {
      return navigate({
        pathname: location.pathname,
        search: `?${createSearchParams({
          modal: ModalTypes.DetailStockTaking,
          placement: ModalPlacement.Top,
          size: ModalSize.Full,
          id: rowData.po_id,
          po_code: rowData.po_code,
        })}`,
      });
    }
    if (rowData.object_type_po === InventoryObjectType.ORDER) {
      // Has order number
      if (rowData.object_key) {
        return navigate({
          pathname: location.pathname,
          search: `?${createSearchParams({
            modal: ModalTypes.OrderDetails,
            placement: ModalPlacement.Top,
            size: ModalSize.Full,
            id: rowData.object_key,
          })}`,
        });
      }
    }
  };

  return (
    <div>
      <Table<ExpectedAny, ExpectedAny>
        ref={tableRef}
        columnOptions={columnOptions({ onClick: onRowClick })}
        variables={convertFilter(initFilterValues.primary)}
        query={useInventoryQuery}
        onRowClick={onRowClick}
        dataKey="id"
        compact
        headerFilter={<Filter initValues={initFilterValues} onFilter={handleFilter} filterOptions={filterOptions()} />}
        subHeader={<InventoryBookAnalytics filterValues={variablesFilter} />}
        headerButton={<TableHeaderAction options={initFilterValues.primary} />}
      />
    </div>
  );
};
export default InventoryList;
