import { BsTrash } from 'react-icons/bs';
import { IconButton } from 'rsuite';
import { ItemProduct } from '~app/features/print-barcode/components';
import { numberFormat } from '~app/configs';
import { AutoResizeInput } from '~app/components';
import { formatCurrency } from '~app/utils/helpers';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';

export const columnOptions = ({
  t,
  isImportGoods,
  handleRemoveSku,
  handleChangeQuantity,
  handleChangeHistoricalCost,
}: {
  t: ExpectedAny;
  isImportGoods: boolean;
  handleRemoveSku: (skuItem: ExpectedAny) => void;
  handleChangeQuantity: (value: string, skuItem: ExpectedAny) => void;
  handleChangeHistoricalCost: (value: string, skuItem: ExpectedAny) => void;
}) => {
  let historicalCost = null;
  let totalPrice = null;
  const canUpdateHistoricalCost = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);
  if (canUpdateHistoricalCost) {
    if (isImportGoods) {
      historicalCost = {
        key: 'historical_cost',
        name: 'historical_cost',
        width: 150,
        label: t('sku-table.historical_cost'),
        className: 'pw-text-right',
        cell: ({ rowData }: { rowData: SkuSelected }) => {
          const handleChange = (value: string) => {
            handleChangeHistoricalCost(value, rowData);
          };
          return (
            <div className="pw-h-full pw-flex pw-items-center pw-justify-end pw-pr-2.5">
              <AutoResizeInput
                name=""
                defaultValue={rowData.historical_cost.toString()}
                isNumber={true}
                placeholder="0"
                onBlur={handleChange}
                isForm={false}
              />
            </div>
          );
        },
      };
    } else {
      historicalCost = {
        key: 'pricing',
        name: 'pricing',
        width: 150,
        label: t('sku-table.historical_cost'),
        className: 'pw-text-right',
        cell: ({ rowData }: { rowData: SkuSelected }) => {
          return (
            <div className="pw-h-full pw-flex pw-items-center pw-justify-end pw-pr-2.5">
              {formatCurrency(rowData?.historical_cost || 0)}
            </div>
          );
        },
      };
    }
    totalPrice = {
      key: 'total_price',
      name: 'total_price',
      width: 150,
      label: t('sku-table.total_price'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: SkuSelected }) => {
        return (
          <div className="pw-text-right pw-w-full pw-px-2 pw-text-sm">
            {numberFormat.format(rowData.historical_cost * rowData.quantity)}
          </div>
        );
      },
    };
  }
  return [
    {
      key: 'sku',
      name: 'sku',
      flexGrow: 0.4,
      label: t('sku-table.sku'),
      cell: ({ rowData }: { rowData: SkuSelected }) => {
        const sku_code = rowData.sku_code;
        return <div className="pw-w-full pw-px-2 pw-text-sm">{sku_code}</div>;
      },
    },
    {
      key: 'name',
      name: 'name',
      label: t('sku-table.product'),
      flexGrow: 1,
      cell: ({ rowData }: { rowData: SkuSelected; dataKey: string }) => {
        return <ItemProduct data={rowData} />;
      },
    },
    historicalCost,
    {
      key: 'quantity',
      name: 'quantity',
      width: 100,
      label: isImportGoods ? t('sku-table.quantity') : t('sku-table.quantity-export'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: SkuSelected }) => {
        const handleChange = (value: string) => {
          handleChangeQuantity(value, rowData);
        };
        return (
          <div className="pw-h-full pw-flex pw-items-center pw-justify-end pw-pr-2.5">
            <AutoResizeInput
              name=""
              defaultValue={rowData.quantity.toString()}
              isNumber={true}
              max={!isImportGoods ? rowData.can_pick_quantity : Infinity}
              placeholder="0"
              onBlur={handleChange}
              isForm={false}
            />
          </div>
        );
      },
    },
    totalPrice,
    {
      key: 'action',
      name: 'action',
      width: 50,
      label: '',
      cell: ({ rowData }: { rowData: SkuSelected }) => {
        return (
          <div className="pw-flex pw-justify-center">
            <IconButton
              size="sm"
              appearance="subtle"
              icon={<BsTrash size={20} />}
              onClick={() => handleRemoveSku(rowData)}
            />
          </div>
        );
      },
    },
  ];
};
