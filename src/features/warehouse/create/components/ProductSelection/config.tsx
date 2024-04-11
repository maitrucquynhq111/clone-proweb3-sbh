import { BsPlusSquareFill } from 'react-icons/bs';
import cx from 'classnames';
import { IconButton } from 'rsuite';
import { ItemProduct } from '~app/features/print-barcode/components';
import QuantityControl from '~app/components/QuantityControl';
import { QuantityControlSize } from '~app/utils/constants';
import { OpenInventory } from '~app/features/warehouse/lists/components';

type Params = {
  t: ExpectedAny;
  isImportGoods: boolean;
  selectedList: Array<SkuSelected>;
  handleChangeQuantity: (value: string, skuItem: ExpectedAny) => void;
};

export function productTableConfig({ t, isImportGoods, handleChangeQuantity, selectedList }: Params) {
  let canPickQUantity = null;
  if (!isImportGoods) {
    canPickQUantity = {
      key: 'can_pick_quantity',
      label: t('inventory'),
      align: 'left',
      flexGrow: 1,
      cell: ({ rowData }: { rowData: SkuInventory }) => {
        return (
          <div
            className={cx(
              'pw-h-full pw-flex pw-items-center pw-justify-start pw-px-4 pw-text-sm pw-text-neutral-primary',
              {
                'pw-opacity-70': !isImportGoods && rowData.can_pick_quantity === 0,
              },
            )}
          >
            {rowData.can_pick_quantity}
          </div>
        );
      },
    };
  }
  return [
    {
      key: 'product_name',
      label: t('orders-form:product'),
      align: 'left',
      flexGrow: 1,
      cell: ({ rowData }: { rowData: SkuInventory }) => {
        return (
          <ItemProduct
            className={cx({
              'pw-opacity-70': !isImportGoods && rowData.can_pick_quantity === 0,
            })}
            data={rowData}
          />
        );
      },
    },
    canPickQUantity,
    {
      key: 'quantity',
      label: t('orders-form:quantity'),
      align: 'right',
      width: 137,
      cell: (props: ExpectedAny) => {
        const { rowData } = props;
        const dataSelected = selectedList.find((item) => item.id === rowData.id);
        const quantity = dataSelected ? dataSelected.quantity : 0;
        if (rowData.sku_type === 'non_stock') {
          return (
            <div className="pw-text-right pw-w-full pw-px-4">
              <OpenInventory sku={rowData} />
            </div>
          );
        }
        return (
          <div
            className={cx('pw-h-full pw-flex pw-items-center pw-justify-end pw-px-4', {
              'pw-opacity-70': !isImportGoods && rowData.can_pick_quantity === 0,
            })}
          >
            {quantity === 0 ? (
              <IconButton
                onClick={() => {
                  handleChangeQuantity('1', rowData);
                }}
                disabled={!isImportGoods && rowData.can_pick_quantity === 0}
                className="!pw-bg-transparent !pw-overflow-visible !pw-w-max !py-0 !px-2 pw-h-9"
                icon={<BsPlusSquareFill size={36} className="pw-text-primary-main" />}
              />
            ) : (
              <QuantityControl
                size={QuantityControlSize.Small}
                maxQuantity={!isImportGoods ? rowData.can_pick_quantity : Infinity}
                defaultValue={quantity.toString()}
                onChange={(value) => handleChangeQuantity(value, rowData)}
                placeholder="0"
                showErrorMessage={false}
                className="!pw-w-auto"
              />
            )}
          </div>
        );
      },
    },
  ];
}
