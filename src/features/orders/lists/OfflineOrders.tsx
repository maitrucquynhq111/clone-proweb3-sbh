import { useCallback, useState, useRef, useSyncExternalStore } from 'react';
import { isBefore, isAfter } from 'date-fns';
import { TagGroup, Tag } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, TableOrderOffline } from './components';
import { initFilterValues, filterOptions, convertFilter } from './configOffline';
import { Filter } from '~app/components';
import { noAccents } from '~app/utils/helpers';
import { orderStore } from '~app/features/pos/stores';
import { MainRouteKeys } from '~app/routes/enums';
import { OrderPermission, useHasPermissions } from '~app/utils/shield';

const OfflineOrders = (): JSX.Element => {
  const canCreateOrder = useHasPermissions([OrderPermission.ORDER_CART_CREATE]);
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const orders = useSyncExternalStore(orderStore.subscribe, orderStore.getSnapshot);
  const syncing = useSyncExternalStore(orderStore.subscribe, orderStore.getSnapshotSyncing);

  const tableRef = useRef<ExpectedAny>();
  const [variablesFilter, setVariablesFilter] = useState<ExpectedAny>(convertFilter(initFilterValues.primary));

  const handleFilter = useCallback(
    (values: ExpectedAny) => {
      const variables = convertFilter(values);
      setVariablesFilter(variables);
      tableRef?.current?.setVariables(variables);
    },
    [variablesFilter],
  );

  const filteredOrderByValue =
    variablesFilter?.search !== ''
      ? orders.filter((item) => {
          const phoneNumber = noAccents(item.buyer_info?.phone_number.toLowerCase());
          const name = noAccents(item.buyer_info?.name.toLowerCase());
          const valueSearch = noAccents(variablesFilter.search.toLowerCase());
          return phoneNumber.includes(valueSearch) || name.includes(valueSearch);
        })
      : orders;
  const filteredOrderByDate =
    variablesFilter?.start_time !== '' && variablesFilter?.end_time !== ''
      ? filteredOrderByValue.filter((item: PendingOrderForm) => {
          const startTime = new Date(variablesFilter?.start_time);
          const endTime = new Date(variablesFilter?.end_time);
          const time = new Date(item?.created_at);
          const isInRange = isBefore(time, endTime) && isAfter(time, startTime);

          return isInRange;
        })
      : filteredOrderByValue;

  const handleCloseTag = () => {
    navigate(MainRouteKeys.Orders);
  };
  return (
    <div className="pw-mt-4">
      {canCreateOrder && <Header />}
      <div className="pw-mt-6">
        <Filter initValues={initFilterValues} onFilter={handleFilter} filterOptions={filterOptions()} />
      </div>
      <div className="pw-mt-2">
        <TagGroup>
          <span className="pw-ml-3">{t('current-filter')}:</span>{' '}
          <Tag onClose={handleCloseTag} className="pw-mr-1 pw-font-bold !pw-bg-secondary-background" closable>
            <span className="!pw-text-main pw-text-sm">{t('orders-not-synchronized')}</span>
          </Tag>
        </TagGroup>
      </div>
      <TableOrderOffline loading={syncing} data={filteredOrderByDate} />
    </div>
  );
};
export default OfflineOrders;
