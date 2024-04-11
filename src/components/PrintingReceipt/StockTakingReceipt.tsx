import cx from 'classnames';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StockTakingAnalyticStatus, StockTakingAnalyticStatusOption } from '~app/utils/constants';
import { formatDateToString } from '~app/utils/helpers';
import '../../styles/stocktake-receipt.css';

type Props = {
  inventoryDetail?: InventoryDetail;
  data: PendingStockTaking;
};

const TABLE_HEADER = [
  {
    title: 'SKU',
    key: 'sku',
    className: 'pw-text-left',
  },
  {
    title: 'product',
    key: 'product',
    className: 'pw-text-left',
  },
  {
    title: 'uom',
    key: 'uom',
    className: 'pw-text-center',
  },
  {
    title: 'system_stock_receipt',
    key: 'system_stock_receipt',
    className: 'pw-text-right',
  },
  {
    title: 'real_stock_receipt',
    key: 'real_stock_receipt',
    className: 'pw-text-right',
  },
  {
    title: 'total_quantity_receipt',
    key: 'total_quantity_receipt',
    className: 'pw-text-right',
  },
];

const StockTakingReceiptTable = ({ data }: { data: PendingStockTaking }) => {
  const { t } = useTranslation('stocktaking-form');

  return (
    <table className="pw-border-collapse pw-w-full pw-break-after-auto">
      <thead>
        <tr>
          {TABLE_HEADER.map((item) => (
            <th
              key={item.key}
              className={cx('pw-text-black pw-font-semibold pw-text-xs pw-py-1 pw-px-2', item.className)}
            >
              {t(item.title)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.po_details.map((item) => {
          const { before_change_quantity, after_change_quantity } = item;
          const diff = +after_change_quantity - before_change_quantity;
          return (
            <tr className="pw-text-xs pw-text-black" key={item.sku_id}>
              <td width="10%">{item?.sku_info.sku_code}</td>
              <td width="40%">
                {item?.sku_info.product_name} {item?.sku_info?.sku_name ? ` - ${item?.sku_info?.sku_name}` : ''}
              </td>
              <td width="10%" className="pw-text-center">
                {item?.sku_info?.uom}
              </td>
              <td width="15%" className="pw-text-right">
                {item?.before_change_quantity}
              </td>
              <td width="15%" className="pw-text-right">
                {item?.after_change_quantity}
              </td>
              <td width="10%" className="pw-text-right">
                {diff > 0 ? `+${Number(diff.toFixed(4))}` : Number(diff.toFixed(4))}
              </td>
            </tr>
          );
        })}
        {data.po_detail_ingredient.map((item) => {
          const { before_change_quantity, after_change_quantity } = item;
          const diff = +after_change_quantity - before_change_quantity;
          return (
            <tr className="pw-text-xs pw-text-black" key={item.sku_id}>
              <td width="10%"></td>
              <td width="40%">{item?.name}</td>
              <td width="10%" className="pw-text-center">
                {item?.uom.name}
              </td>
              <td width="10%" className="pw-text-right">
                {item?.before_change_quantity}
              </td>
              <td width="10%" className="pw-text-right">
                {item?.after_change_quantity}
              </td>
              <td width="10%" className="pw-text-right">
                {diff > 0 ? `+${Number(diff.toFixed(4))}` : Number(diff.toFixed(4))}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const StockTakingReceipt = ({ data, inventoryDetail }: Props) => {
  const { t } = useTranslation('stocktaking-form');

  return (
    <div className="stocktake-receipt pw-w-a4 pw-h-a4 pw-bg-white">
      <div className="pw-text-center pw-text-black pw-font-semibold pw-mb-4 pw-uppercase">{t('stocktake_receipt')}</div>
      <div className="pw-flex pw-text-xs pw-text-black pw-mb-0.5">
        <div className="pw-flex pw-flex-1 pw-gap-x-1">
          <div className="pw-font-semibold">{t('receipt_code')}:</div>
          <div>{inventoryDetail?.po_code}</div>
        </div>
        <div className="pw-flex pw-flex-1 pw-gap-x-1">
          <div className="pw-font-semibold">{t('status')}:</div>
          {inventoryDetail?.status ? (
            <div>
              {t(
                `stocktaking-table:${
                  StockTakingAnalyticStatusOption[inventoryDetail.status as StockTakingAnalyticStatus].title
                }`,
              )}
            </div>
          ) : null}
        </div>
      </div>
      <div className="pw-flex pw-text-xs pw-text-black pw-mb-0.5">
        <div className="pw-flex pw-flex-1 pw-gap-x-1">
          <div className="pw-font-semibold">{t('create_staff')}:</div>
          <div>{inventoryDetail?.staff_info?.staff_name}</div>
        </div>
        <div className="pw-flex pw-flex-1 pw-gap-x-1">
          <div className="pw-font-semibold">{t('created_at')}:</div>
          <div>{formatDateToString(inventoryDetail?.created_at || new Date(), 'HH:mm - dd/MM/yyyy')}</div>
        </div>
      </div>
      <div className="pw-flex pw-text-xs pw-text-black pw-mb-3">
        <div className="pw-flex pw-flex-1 pw-gap-x-1">
          <div className="pw-font-semibold">{t('balanced_staff')}:</div>
          <div>{inventoryDetail?.staff_info_update?.staff_name || inventoryDetail?.staff_info?.staff_name}</div>
        </div>
        <div className="pw-flex pw-flex-1 pw-gap-x-1">
          <div className="pw-font-semibold">{t('balanced_at')}:</div>
          <div>{formatDateToString(inventoryDetail?.updated_at || new Date(), 'HH:mm - dd/MM/yyyy')}</div>
        </div>
      </div>
      <div className="pw-flex pw-text-xs pw-text-black pw-gap-x-1 pw-mb-3">
        <div className="pw-font-semibold">{t('note')}:</div>
        <div>{data?.note}</div>
      </div>
      <StockTakingReceiptTable data={data} />
      <div className="pw-w-full pw-flex pw-flex-col pw-items-end pw-mt-6 pw-text-xs pw-text-black">
        <div className="pw-flex pw-w-full pw-max-w-1/2 pw-justify-between pw-py-1 pw-mb-0.5">
          <div className="pw-w-1/2 pw-text-right">{t('total_before_change_quantity')}</div>
          <div className=" pw-font-semibold">{Number(inventoryDetail?.total_before_change_quantity.toFixed(4))}</div>
        </div>
        <div className="pw-flex pw-w-full pw-max-w-1/2 pw-justify-between pw-py-1 pw-mb-0.5">
          <div className="pw-w-1/2 pw-text-right">{t('total_after_change_quantity')}</div>
          <div className=" pw-font-semibold">{Number(inventoryDetail?.total_after_change_quantity.toFixed(4))}</div>
        </div>
        <div className="pw-flex pw-w-full pw-max-w-1/2 pw-justify-between pw-py-1">
          <div className="pw-w-1/2 pw-text-right">{t('total_quantity')}</div>
          <div className=" pw-font-semibold">
            {Number(
              Math.abs(
                (inventoryDetail?.total_after_change_quantity || 0) -
                  (inventoryDetail?.total_before_change_quantity || 0),
              ).toFixed(4),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(StockTakingReceipt);
