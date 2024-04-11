import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Pagination, Tag } from 'rsuite';
import cx from 'classnames';
import Action from './Action';
import { OrderStatus, OrderStatusType } from '~app/utils/constants';
import { formatCurrency, formatDateToString } from '~app/utils/helpers';
import { PageSizeDropdown } from '~app/components/Table/components';
import { NoDataImage } from '~app/components/Icons';
import { EmptyState } from '~app/components';

const { Column, HeaderCell, Cell } = Table;

type Props = {
  data: PendingOrderForm[];
  loading: boolean;
};

function TableOrderOffline({ data, loading }: Props) {
  const { t } = useTranslation(['orders-table', 'common', 'notification', 'pos']);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const handleChangeLimit = (limitSize: number) => {
    setPage(1);
    setLimit(limitSize);
  };

  const dataTable = data.filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });

  return (
    <div className="pw-mt-4">
      {data.length > 0 ? (
        <>
          <Table
            renderEmpty={() => <EmptyState hiddenButton={true} icon={<NoDataImage />} description1={t('no-data')} />}
            loading={loading}
            cellBordered
            affixHorizontalScrollbar
            bordered
            {...(data.length <= 0 && { height: 400 })}
            autoHeight={true}
            data={dataTable}
            rowHeight={56}
          >
            <Column minWidth={200} flexGrow={1}>
              <HeaderCell>{t('order_number')}</HeaderCell>
              <Cell>
                {(rowData) => (
                  <div className="pw-w-full pw-px-2">
                    <div className="pw-font-bold pw-text-secondary-main-blue pw-mb-1">{rowData.buyer_info.name}</div>
                  </div>
                )}
              </Cell>
            </Column>
            <Column width={180}>
              <HeaderCell>{t('created_at')}</HeaderCell>
              <Cell>
                {(rowData) => (
                  <div className="pw-w-full pw-px-2">
                    <div className="pw-mb-1">
                      {rowData?.created_at ? formatDateToString(rowData.created_at, 'dd/MM/yyyy HH:mm') : ''}
                    </div>
                  </div>
                )}
              </Cell>
            </Column>
            <Column minWidth={150} flexGrow={1}>
              <HeaderCell>{t('state')}</HeaderCell>
              <Cell>
                {(rowData) => {
                  const state = rowData.state as OrderStatusType;
                  return (
                    <Tag className={cx('!pw-text-white !pw-font-semibold', OrderStatus[state]?.bgColor)}>
                      {t(`common:order-status.${OrderStatus[state]?.name}`)}
                    </Tag>
                  );
                }}
              </Cell>
            </Column>
            <Column minWidth={150} flexGrow={1}>
              <HeaderCell>{t('grand_total')}</HeaderCell>
              <Cell>{(rowData) => <div className="pw-w-full pw-px-2">{formatCurrency(rowData.grand_total)}</div>}</Cell>
            </Column>
            <Column width={200}>
              <HeaderCell>{t('action')}</HeaderCell>
              <Cell>
                {(rowData) => {
                  return <Action data={rowData} />;
                }}
              </Cell>
            </Column>
          </Table>
          {dataTable?.length > 0 && (
            <div className="pw-flex pw-py-4 pw-justify-between pw-items-center">
              <PageSizeDropdown value={limit} onChange={(value: number | null) => handleChangeLimit(value || 10)} />
              <Pagination
                prev
                next
                first
                last
                ellipsis
                maxButtons={5}
                layout={['-', 'pager']}
                total={data.length}
                limit={limit}
                activePage={page}
                onChangePage={setPage}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState hiddenButton={true} icon={<NoDataImage />} description1={t('common:no-data')} />
      )}
    </div>
  );
}

export default TableOrderOffline;
