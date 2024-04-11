import cx from 'classnames';
import { BsFillPlusCircleFill, BsTrash } from 'react-icons/bs';
import { IconButton } from 'rsuite';
import { AutoResizeInput } from '~app/components';
import { generateOrderItemAddonName, getTotalAddonPrice } from '~app/features/pos/utils';
import { formatCurrency } from '~app/utils/helpers';

type ConfigParams = {
  t: ExpectedAny;
  canUpdatePrice: boolean;
  isFetching: boolean;
  isEdit: boolean;
  onOpenDrawer(orderItem: PendingOrderItem): void;
  onInputChange(orderItem: PendingOrderItem, key: keyof PendingOrderItem, value: string): void;
  onRemove(orderItem: PendingOrderItem, value: string): void;
};

export function columnsConfig({
  t,
  canUpdatePrice,
  isEdit,
  isFetching,
  onInputChange,
  onRemove,
  onOpenDrawer,
}: ConfigParams) {
  const defaultColumn = [
    {
      key: 'ordinal_number',
      label: t('ordinal_number'),
      align: 'center',
      width: 59,
      cell: ({ rowIndex }: { rowIndex: number }) => {
        return (
          <div className="pw-flex pw-items-center pw-justify-center pw-text-sm pw-text-neutral-primary">
            {rowIndex + 1}
          </div>
        );
      },
    },
    {
      key: 'product_name',
      label: t('product'),
      align: 'left',
      flexGrow: 1,
      cell: ({ rowData }: { rowData: PendingOrderItem }) => {
        return (
          <>
            {rowData?.order_item_add_on.length === 0 ? (
              <div className="pw-py-3 pw-px-4">
                <div className="pw-text-sm pw-text-neutral-primary ">{rowData?.product_name}</div>
                {rowData ? (
                  <div
                    className={cx('pw-gap-x-4 pw-text-sm pw-text-neutral-secondary', {
                      'pw-mt-1': rowData?.sku_name || rowData?.order_item_add_on.length > 0,
                    })}
                  >
                    {rowData?.sku_name ? <span>{`${rowData.sku_name}`}</span> : null}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="pw-text-sm pw-text-neutral-primary pw-py-3 pw-px-4">
                <div className="pw-flex pw-items-center pw-justify-between ">
                  <div className="pw-text-sm pw-text-neutral-primary">{rowData?.product_name}</div>
                  {isFetching || !isEdit ? null : (
                    <IconButton
                      icon={<BsFillPlusCircleFill className="pw-fill-green-600 pw-text-neutral-white" size={16} />}
                      onClick={() => onOpenDrawer(rowData)}
                      className="!pw-bg-transparent !pw-p-0"
                    />
                  )}
                </div>
                {rowData ? (
                  <div
                    className={cx('pw-gap-x-4 pw-text-sm pw-text-neutral-secondary', {
                      'pw-mt-1': rowData?.sku_name || rowData?.order_item_add_on.length > 0,
                    })}
                  >
                    {rowData?.sku_name ? <span>{`${rowData.sku_name}`}</span> : null}
                    {rowData.order_item_add_on.length > 0 ? (
                      <span> / {generateOrderItemAddonName(rowData.order_item_add_on)}</span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}
          </>
        );
      },
    },
    {
      key: 'price',
      label: t('price'),
      align: 'right',
      width: 148,
      cell: ({ rowData }: { rowData: PendingOrderItem }) => {
        const handleChange = (value: string) => {
          onInputChange(rowData, 'price', value);
        };
        return (
          <div className="pw-h-full pw-flex pw-flex-col pw-gap-y-2 pw-items-end pw-pr-2.5 pw-text-neutral-primary">
            {canUpdatePrice && isEdit ? (
              <AutoResizeInput
                name=""
                defaultValue={rowData?.price.toString()}
                isNumber={true}
                placeholder="0"
                onChange={handleChange}
                isForm={false}
              />
            ) : (
              <>
                <span>{formatCurrency(rowData?.price || '')}</span>
                {rowData?.order_item_add_on.length > 0 ? (
                  <span className="pw-text-xs pw-text-neutral-placeholder">
                    +{formatCurrency(getTotalAddonPrice(rowData.order_item_add_on))}
                  </span>
                ) : null}
              </>
            )}
          </div>
        );
      },
    },
    {
      key: 'quantity',
      label: t('quantity_short'),
      align: 'right',
      width: 74,
      cell: ({ rowData }: { rowData: PendingOrderItem }) => {
        const handleChange = (value: string) => {
          onInputChange(rowData, 'quantity', value);
        };
        const handleBlur = (value: string) => {
          onRemove(rowData, value);
        };
        return (
          <div
            className={cx('pw-h-full pw-flex pw-items-center pw-justify-end  pw-text-neutral-primary', {
              'pw-px-2.5': !isEdit,
              'pw-pr-2.5': isEdit,
            })}
          >
            {isEdit ? (
              <AutoResizeInput
                name=""
                defaultValue={rowData?.quantity.toString()}
                isDecimal={true}
                placeholder="0"
                max={rowData?.can_pick_quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                isForm={false}
              />
            ) : (
              rowData?.quantity || ''
            )}
          </div>
        );
      },
    },
    {
      key: 'total_price',
      label: t('total_price'),
      align: 'right',
      width: 151,
      cell: ({ rowData }: { rowData: PendingOrderItem }) => {
        const totalPrice = (
          (rowData.price + getTotalAddonPrice(rowData.order_item_add_on)) *
          rowData.quantity
        ).toString();
        return (
          <div className="pw-flex pw-items-center pw-justify-end pw-text-sm pw-text-neutral-primary pw-py-3 pw-px-4">
            {formatCurrency(totalPrice)}
          </div>
        );
      },
    },
  ];
  const actionColumn = isEdit
    ? {
        key: 'action',
        name: 'action',
        label: '',
        width: 74,
        cell: ({ rowData: product }: { rowData: PendingOrderItem }) => {
          return (
            <div className="pw-h-full pw-flex pw-flex-col pw-items-center pw-justify-center">
              <IconButton
                appearance="subtle"
                icon={<BsTrash className="pw-w-6 pw-h-6" />}
                onClick={() => onRemove(product, '0')}
              />
            </div>
          );
        },
      }
    : {};
  const result = isEdit ? [...defaultColumn, actionColumn] : defaultColumn;
  return result;
}
