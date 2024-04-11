import { useCallback, useState, useRef, useMemo } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { columnOptions, convertFilter, initFilterValues, filterOptions } from './config';
import { Filter, Table } from '~app/components';
import {
  EmptyButton,
  StockTakingAnalytics,
  TableHeaderAction,
  EmptyProductButton,
} from '~app/features/stock-taking/list/components';
import { useGetListStockTakeQuery, usePosProductsQuery } from '~app/services/queries';
import { EmptyStateOrder, EmptyStateProduct } from '~app/components/Icons';
import { ModalTypes } from '~app/modals';

const StockTakingList = () => {
  const tableRef = useRef<ExpectedAny>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation(['stocktaking-table', 'common']);

  const { data } = usePosProductsQuery({
    page: 1,
    pageSize: 10,
    keepPreviousData: true,
  });

  const isEmptyProduct = useMemo(() => {
    if (!data?.data) return true;
    return data?.data.length === 0;
  }, [data]);

  const [variablesFilter, setVariablesFilter] = useState<ExpectedAny>(convertFilter(initFilterValues.primary));

  const handleFilter = useCallback((values: ExpectedAny) => {
    const variables = convertFilter({ ...values });
    setVariablesFilter(variables);
    tableRef?.current?.setVariables(variables);
  }, []);

  const handleFilterStatus = useCallback(
    (status: ExpectedAny) => {
      const variables = { ...variablesFilter, status };
      setVariablesFilter(variables);
      tableRef?.current?.setVariables(variables);
    },
    [variablesFilter],
  );

  const onRowClick = (rowData: InventoryStockTaking) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.DetailStockTaking,
        id: rowData.id,
        po_code: rowData.po_code,
      })}`,
    });
  };

  const showEmptyProduct = isEmptyProduct && !variablesFilter?.search;
  const showNotFound = !showEmptyProduct && variablesFilter?.search;

  const emptyDescription = () => {
    if (showEmptyProduct) return 'empty_state_product';
    if (showNotFound) return 'common:no-data';
    return 'empty_state';
  };

  return (
    <div>
      <Table<ExpectedAny, ExpectedAny>
        dataKey="id"
        ref={tableRef}
        columnOptions={columnOptions()}
        variables={convertFilter(initFilterValues.primary)}
        query={useGetListStockTakeQuery}
        onRowClick={onRowClick}
        headerFilter={<Filter initValues={initFilterValues} onFilter={handleFilter} filterOptions={filterOptions()} />}
        headerButton={
          <TableHeaderAction
            options={{
              start_time: variablesFilter.startTime,
              end_time: variablesFilter.endTime,
            }}
          />
        }
        emptyIcon={<EmptyState showEmptyProduct={showEmptyProduct} showNotFound={showNotFound} />}
        emptyDescription={t(emptyDescription())}
        emptyButton={<EmptyButtonRender showEmptyProduct={showEmptyProduct} showNotFound={showNotFound} />}
        subHeader={
          <StockTakingAnalytics
            initValues={variablesFilter}
            value={variablesFilter.status}
            onChange={handleFilterStatus}
          />
        }
      />
    </div>
  );
};

const EmptyState = ({ showEmptyProduct, showNotFound }: { showEmptyProduct: boolean; showNotFound: boolean }) => {
  return <>{showEmptyProduct || showNotFound ? <EmptyStateProduct /> : <EmptyStateOrder />}</>;
};

const EmptyButtonRender = ({
  showEmptyProduct,
  showNotFound,
}: {
  showEmptyProduct: boolean;
  showNotFound: boolean;
}) => {
  if (showNotFound) return null;
  return <>{showEmptyProduct ? <EmptyProductButton /> : <EmptyButton />}</>;
};

export default StockTakingList;
