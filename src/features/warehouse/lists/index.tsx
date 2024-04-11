import { useCallback, useMemo, useRef, useState } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { initFilterValues, columnOptions, filterOptions, convertFilter } from './config';
import { EmptyButton, TableHeaderAction, WarehouseAnalytics } from './components';
import { toDefaultSkuInventory, toPendingSkuInventory } from './components/OpenInventory/config';
import { INVENTORY_ANALYTICS_KEY, SKUS_INVENTORY_KEY, useSkuQueryInventory } from '~app/services/queries';
import { Table, Filter } from '~app/components';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';
import { ModalPlacement, ModalSize, ModalTypes } from '~app/modals';
import { EmptyStateProduct } from '~app/components/Icons';
import { useUpdateSkuMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';

const Warehouse = (): JSX.Element => {
  const location = useLocation();
  const { t } = useTranslation('warehouse-table');
  const tableRef = useRef<ExpectedAny>();
  const navigate = useNavigate();
  const [filterValues, setFilterValues] = useState<ExpectedAny>(initFilterValues);
  const { data } = useSkuQueryInventory({ page: 1, pageSize: 1, search: '' });
  const { mutateAsync: updateSku } = useUpdateSkuMutation();
  const canUpdateInventory = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_INVENTORY_VIEW]);
  const emptyState = useMemo(
    () => !filterValues.search && filterValues?.category_ids?.length === 0 && data.data.length === 0,
    [filterValues],
  );

  const handleFilter = useCallback((values: ExpectedAny) => {
    tableRef?.current?.setVariables(convertFilter(values));
    setFilterValues(convertFilter(values));
  }, []);

  const onRowClick = (rowData: SkuInventory) => {
    if (canUpdateInventory) {
      navigate({
        pathname: location.pathname,
        search: `?${createSearchParams({
          modal: ModalTypes.WarehouseDetails,
          placement: ModalPlacement.Right,
          size: ModalSize.Xsmall,
          id: rowData.id,
        })}`,
      });
    }
  };

  const handleSubmit = async ({ rowData, total_inventory }: { rowData: SkuInventory; total_inventory: number }) => {
    try {
      if (total_inventory === rowData.total_quantity) return;
      const defaultSkuInventory = toDefaultSkuInventory(rowData);
      if (total_inventory !== defaultSkuInventory.total_quantity) {
        defaultSkuInventory.po_details.quantity = total_inventory - defaultSkuInventory.total_quantity;
      }
      await updateSku({
        id: rowData.id,
        sku: toPendingSkuInventory(defaultSkuInventory),
      });
      queryClient.invalidateQueries([SKUS_INVENTORY_KEY], { exact: false });
      queryClient.invalidateQueries([INVENTORY_ANALYTICS_KEY], { exact: false });
      toast.success(t('inventory-form:success.open_inventory'));
    } catch (_) {
      // TO DO
    }
  };

  return (
    <div>
      <Table<ExpectedAny, ExpectedAny>
        ref={tableRef}
        columnOptions={columnOptions({ onBlur: handleSubmit })}
        variables={{ ...initFilterValues.primary, ...initFilterValues.secondary }}
        query={useSkuQueryInventory}
        onRowClick={onRowClick}
        dataKey="id"
        compact
        headerFilter={<Filter initValues={initFilterValues} onFilter={handleFilter} filterOptions={filterOptions()} />}
        subHeader={<WarehouseAnalytics />}
        emptyIcon={emptyState ? <EmptyStateProduct /> : null}
        emptyDescription={emptyState ? t('empty_state') : null}
        emptyButton={emptyState ? <EmptyButton /> : null}
        headerButton={<TableHeaderAction />}
      />
    </div>
  );
};
export default Warehouse;
