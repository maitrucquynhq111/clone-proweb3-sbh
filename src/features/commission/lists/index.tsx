import { useCallback, useRef, useState } from 'react';
import { columnOptions, convertFilter, filterOptions, initFilterValues } from './config';
import { Filter, Table } from '~app/components';
import { useCommissionsQuery } from '~app/services/queries';
import { CommissionAnalytics } from '~app/features/commission/components';

const CommissionList = () => {
  const tableRef = useRef<ExpectedAny>();
  const [variablesFilter, setVariablesFilter] = useState<ExpectedAny>(convertFilter(initFilterValues.primary));

  const handleFilter = useCallback((values: ExpectedAny) => {
    const variables = convertFilter({
      ...values,
      filter_key: values?.filter_key || [],
      sender_phone: values?.senderPhone || '',
    });
    setVariablesFilter(variables);
    tableRef?.current?.setVariables({ ...variables, filter_key: variables.filter_key.join(',') });
  }, []);

  return (
    <Table<ExpectedAny, ExpectedAny>
      dataKey="id"
      columnOptions={columnOptions()}
      ref={tableRef}
      variables={convertFilter(initFilterValues.primary)}
      query={useCommissionsQuery}
      wordWrap="break-word"
      headerFilter={
        <Filter
          initValues={initFilterValues}
          onFilter={handleFilter}
          filterOptions={filterOptions()}
          placement="autoVerticalStart"
          secondaryFilterClassName="!pw-w-72 !lg:pw-w-80"
        />
      }
      subHeader={<CommissionAnalytics initValues={variablesFilter} />}
    />
  );
};

export default CommissionList;
