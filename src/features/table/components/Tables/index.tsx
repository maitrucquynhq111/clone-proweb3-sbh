import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { Tooltip, Whisper } from 'rsuite';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaShoppingBasket, FaShippingFast } from 'react-icons/fa';
import TableItem from './TableItem';
import { useTablesQuery } from '~app/services/queries/useTablesQuery';
import { useSelectedTableStore } from '~app/features/table/hooks/useSelectedTable';
import { countTablesInZone, filterTableStatus } from '~app/features/table/utils';
import EmptyState from '~app/components/EmptyState';
import { EmptyStateTable } from '~app/components/Icons';
import { CommingSoonModal } from '~app/components';
import { TableStatus } from '~app/features/table/constants';
import { MainRouteKeys } from '~app/routes/enums';
import { DeliveryMethodType } from '~app/features/pos/utils';

type Props = {
  className?: string;
};
const defaultDeliveryMethod = () => {
  const { t } = useTranslation('pos');
  return [
    {
      value: DeliveryMethodType.BUYER_PICK_UP,
      label: t('buyer_pick_up'),
      icon: <FaShoppingBasket size={40} className="pw-text-main" />,
    },
    {
      value: DeliveryMethodType.SELLER_DELIVERY,
      label: t('seller_delivery'),
      icon: <FaShippingFast size={40} className="pw-text-main" />,
    },
  ];
};

const Tables = ({ className }: Props) => {
  const { t } = useTranslation('table');
  const navigate = useNavigate();
  const location = useLocation();
  const [{ selectedZoneId, searchValue, statusTableSelected }] = useSelectedTableStore((store) => store);
  const { data: dataTables } = useTablesQuery({ search: searchValue });
  const [openCommingSoon, setOpenCommingSoon] = useState(false);

  const tables = useMemo(() => {
    if (!dataTables?.data) return { data: [], countTables: 0 };

    // Filter by Status
    let tablesFilter = dataTables?.data || [];
    if (statusTableSelected.length > 0 && statusTableSelected.length < Object.keys(TableStatus).length) {
      tablesFilter = filterTableStatus(dataTables?.data || [], statusTableSelected);
    }
    // all zone
    if (selectedZoneId === '') {
      return { data: tablesFilter, countTables: countTablesInZone(tablesFilter) };
    }
    // selected specific zone
    const data = tablesFilter.filter((item) => item.id === selectedZoneId);
    return { data, countTables: countTablesInZone(data) };
  }, [statusTableSelected.toString(), selectedZoneId, dataTables?.data]);

  const handleClick = (item: Table, tableItem: TableItem) => {
    if (tableItem.status === TableStatus.USING && location.state?.isChangeTable) {
      return toast.error(t('error.using_table'));
    }
    navigate(MainRouteKeys.Pos, {
      state: {
        is_change_table: location.state?.isChangeTable || false,
        order_id: location.state?.isChangeTable ? location.state?.order_id : tableItem.reservation?.order_id || '',
        sector_id: item.id,
        sector_name: item.title,
        table_id: tableItem.id,
        table_name: tableItem.title,
        tab_method: DeliveryMethodType.TABLE,
      },
    });
  };

  const handleClickNewOrder = (method: string) => {
    navigate(MainRouteKeys.Pos, {
      state: {
        tab_method: method,
      },
    });
  };

  const getDeliveryMethod = () => {
    if (location.state?.isChangeTable) {
      return null;
    }
    return (
      <>
        {defaultDeliveryMethod().map((method) => (
          <Whisper
            placement="autoVertical"
            trigger="hover"
            speaker={<Tooltip arrow={false}>{method.label}</Tooltip>}
            onClick={() => handleClickNewOrder(method.value)}
          >
            <div className="pw-rounded pw-cursor-pointer pw-bg-white pw-text-main pw-border pw-border-main pw-p-3">
              <div className="pw-h-full pw-flex pw-flex-col pw-items-center pw-justify-center">
                {method.icon}
                <div className="pw-font-bold pw-text-center pw-text-base line-clamp-1 !pw-block pw-text-ellipsis pw-mt-1">
                  {method.label}
                </div>
              </div>
            </div>
          </Whisper>
        ))}
      </>
    );
  };

  return (
    <div className={cx(className)}>
      {tables.countTables === 0 ? (
        <>
          <div
            className="pw-max-h-full pw-grid md:pw-grid-cols-4 lg:pw-grid-cols-5 xl:pw-grid-cols-6 2xl:pw-grid-cols-10
        pw-gap-6 pw-whitespace-nowrap pw-snap-x pw-mr-10"
          >
            {getDeliveryMethod()}
          </div>
          <EmptyState
            icon={<EmptyStateTable />}
            description1={t('empty_state_1')}
            description2={t('empty_state_2') || ''}
            textBtn={t('create_table') || ''}
            className="pw-mt-6"
            onClick={() => setOpenCommingSoon(true)}
          />
        </>
      ) : (
        <>
          {tables.data.map((item, index) => {
            return (
              <div className="pw-px-6 pw-py-4 pw-mb-3 pw-bg-neutral-background pw-rounded" key={item.id}>
                <div className="pw-mb-4">
                  <b className="pw-mr-1">{item.title}</b>
                  <span className="pw-lowercase">
                    {item.tables.length === 0 ? `(${t('no_table')})` : `(${item.tables.length} ${t('table')})`}
                  </span>
                </div>
                <div
                  className="pw-max-h-full pw-grid md:pw-grid-cols-4 lg:pw-grid-cols-5 xl:pw-grid-cols-6 2xl:pw-grid-cols-10
                pw-gap-6 pw-whitespace-nowrap pw-snap-x"
                >
                  {index === 0 && getDeliveryMethod()}
                  {item.tables.map((table) => (
                    <TableItem
                      key={table.id}
                      item={table}
                      onClick={(tableItem: TableItem) => handleClick(item, tableItem)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
      {openCommingSoon && <CommingSoonModal open={openCommingSoon} onClose={() => setOpenCommingSoon(false)} />}
    </div>
  );
};

export default Tables;
