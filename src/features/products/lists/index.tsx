import { useCallback, useMemo, useRef } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Row } from '@tanstack/table-core';
import { TableHeaderAction, HeaderSelectAll, ProductExpandedRow } from './components';
import { initFilterValues, columnOptions, filterOptions, convertFilter, getRowCanExpand, getRowId } from './config';
import { ModalTypes } from '~app/modals/types';
import { Filter } from '~app/components';
import { useProductsQuery } from '~app/services/queries';
import { useHasPermissions, ProductPermission } from '~app/utils/shield';
import { TableRef, TanstackTable } from '~app/features/products/components';
import { useUpdateProductMutation } from '~app/services/mutations/useUpdateProductMutation';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { handleUpdateProduct } from '~app/features/products/utils';
import { isJsonString } from '~app/utils/helpers';
import { TableColumnsProvider, useTableColumnsStore } from '~app/utils/hooks';
import { TableColumnsKey } from '~app/utils/constants';

const ProductsList = (): JSX.Element => {
  const tableRef = useRef<TableRef>(null);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { syncDataByTypes } = useOfflineContext();
  const { mutateAsync } = useUpdateProductMutation();

  const handleFilter = useCallback((values: ExpectedAny) => {
    tableRef?.current?.handleSetVariables(convertFilter(values));
  }, []);

  const canViewList = useHasPermissions([ProductPermission.PRODUCT_PRODUCTLIST_VIEW]);
  const canViewDetail = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_VIEW]);
  const canView = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_VIEW]);
  const canDelete = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_DELETE]);
  const canViewInventory = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_INVENTORY_VIEW]);
  const canViewHistoricalCost = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);

  const [filteredColumns] = useTableColumnsStore((store) => store?.table_columns?.[TableColumnsKey.PRODUCT_LIST]);

  const onRowClick = (row: Row<Product>) => {
    const product = row.original;
    if (product.product_type === 'variant') {
      return row.getToggleExpandedHandler()();
    }
    if (canViewDetail) {
      navigate({
        pathname: location.pathname,
        search: `?${createSearchParams({
          modal: ModalTypes.ProductDetails,
          id: product.id,
        })}`,
      });
    }
  };

  const onUpdateProduct = useCallback((productId: string, sku: Sku, successMessage?: string) => {
    const queryKey = tableRef.current?.handleGetQueryKey();
    return handleUpdateProduct(productId, sku, queryKey, mutateAsync, syncDataByTypes, t, successMessage);
  }, []);

  const columns = useMemo(
    () =>
      columnOptions(
        canView,
        canDelete,
        canViewInventory,
        canViewHistoricalCost,
        location,
        navigate,
        syncDataByTypes,
        onUpdateProduct,
        filteredColumns,
      ),
    [onUpdateProduct, filteredColumns],
  );

  return (
    <div>
      {canViewList ? (
        <TanstackTable<Product>
          ref={tableRef}
          columns={columns}
          sortOptions={
            location.state?.sort && isJsonString(location.state?.sort) ? JSON.parse(location.state?.sort) : {}
          }
          query={useProductsQuery}
          SubComponent={ProductExpandedRow}
          getRowCanExpand={getRowCanExpand}
          getRowId={getRowId}
          onRowClick={onRowClick}
          selectable
          variables={{
            ...initFilterValues.primary,
            ...initFilterValues.secondary,
          }}
          headerSelectAll={({ selected }: { selected: string[] }) => {
            return <HeaderSelectAll selected={selected} />;
          }}
          headerFilter={
            <Filter initValues={initFilterValues} onFilter={handleFilter} filterOptions={filterOptions()} />
          }
          headerButton={<TableHeaderAction />}
        />
      ) : null}
    </div>
  );
};

const ProductListWrapper = () => {
  return (
    <TableColumnsProvider>
      <ProductsList />
    </TableColumnsProvider>
  );
};

export default ProductListWrapper;
