import { IconButton } from 'rsuite';
import { BsTrash } from 'react-icons/bs';
import QuantityCell from '../QuantityCell';
import { ImageTextCell } from '~app/components';
import { StockTakingAnalyticStatus } from '~app/utils/constants';

type ConfigParams = {
  t: ExpectedAny;
  status: string;
  onRemove(sku: PendingStockTakingPoDetailSku): void;
};

export function skuColumnsConfig({ t, status, onRemove }: ConfigParams) {
  const columns = [
    {
      key: 'sku_code',
      label: 'SKU',
      cell: ({ rowData }: { rowData: PendingStockTakingPoDetailSku }) => {
        return (
          <div className="pw-w-full pw-px-2.5 pw-text-base pw-text-neutral-primary">{rowData.sku_info.sku_code}</div>
        );
      },
    },
    {
      key: 'product_name',
      label: t('product'),
      flexGrow: 1,
      cell: ({ rowData }: { rowData: PendingStockTakingPoDetailSku }) => {
        return (
          <div className="pw-w-full pw-px-2.5">
            <ImageTextCell
              image={rowData?.sku_info?.media?.[0] || ''}
              text={rowData?.sku_info?.product_name || ''}
              textClassName="pw-font-semibold pw-text-sm pw-text-neutral-primary line-clamp-2"
              secondText={rowData?.sku_info?.sku_name}
              secondTextClassName="pw-font-normal pw-text-neutral-secondary pw-text-sm"
            />
          </div>
        );
      },
    },
    {
      key: 'before_change_quantity',
      label: t('system_stock'),
      width: 143,
      align: 'right',
      cell: ({ rowData }: { rowData: PendingStockTakingPoDetailSku }) => {
        return (
          <div className="pw-w-full pw-text-right pw-px-2.5 pw-font-semibold pw-text-base pw-text-neutral-primary">
            {Number(rowData.before_change_quantity.toFixed(4))}
          </div>
        );
      },
    },
    {
      key: 'after_change_quantity',
      width: 140,
      label: t('real_stock'),
      align: 'right',
      cell: ({ rowData, rowIndex }: { rowData: PendingStockTakingPoDetailSku; rowIndex: number }) => {
        return (
          <div className="pw-w-full pw-text-right pw-font-semibold pw-text-base pw-text-neutral-primary">
            {status === StockTakingAnalyticStatus.PROCESSING ? (
              <QuantityCell name={`po_details.${rowIndex}.after_change_quantity`} />
            ) : (
              <div className="pw-px-2.5">{rowData.after_change_quantity}</div>
            )}
          </div>
        );
      },
    },
    {
      key: 'diff',
      label: t('total_quantity_short'),
      align: 'right',
      cell: ({ rowData }: { rowData: PendingStockTakingPoDetailSku }) => {
        const { before_change_quantity, after_change_quantity } = rowData;
        const diff = +after_change_quantity - before_change_quantity;
        return (
          <div className="pw-w-full pw-text-right pw-px-2.5 pw-font-semibold pw-text-base pw-text-neutral-primary">
            {diff > 0 ? `+${Number(diff.toFixed(4))}` : Number(diff.toFixed(4))}
          </div>
        );
      },
    },
  ];
  if (status === StockTakingAnalyticStatus.PROCESSING) {
    columns.push({
      key: 'action',
      cell: ({ rowData }: { rowData: PendingStockTakingPoDetailSku }) => {
        return (
          <div className="pw-w-full pw-text-left pw-px-2.5">
            <IconButton appearance="subtle" icon={<BsTrash size={24} />} onClick={() => onRemove(rowData)} />
          </div>
        );
      },
    } as ExpectedAny);
  }
  return columns;
}
