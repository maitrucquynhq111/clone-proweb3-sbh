import { BsTrash, BsPencilSquare } from 'react-icons/bs';
import { IconButton, Whisper, Tooltip } from 'rsuite';
import ItemProduct from './ItemProduct';
import { AutoResizeInput } from '~app/components';
import QuantityControl from '~app/components/QuantityControl';
import { QuantityControlSize } from '~app/utils/constants';
import { formatCurrency } from '~app/utils/helpers';
import { getOrderItemCanPickQuantity } from '~app/features/pos/utils';

export const columnOptions = ({
  t,
  handleRemoveSku,
  listOrderItems,
  handleChangeQuantity,
  handleChangePrice,
  setShowEditNote,
}: {
  t: ExpectedAny;
  handleRemoveSku: (skuItem: ExpectedAny) => void;
  listOrderItems: Array<PendingOrderItem>;
  handleChangeQuantity: (value: string, orderItem: PendingOrderItem) => void;
  handleChangePrice: (value: string, orderItem: PendingOrderItem) => void;
  setShowEditNote: (id: PendingOrderItem) => void;
}) => {
  return [
    {
      key: 'action',
      name: 'action',
      width: 50,
      label: '',
      cell: ({ rowData }: { rowData: PendingOrderItem }) => {
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
    {
      key: 'sku_code',
      name: 'sku_code',
      width: 120,
      label: 'SKU',
      cell: ({ rowData }: { rowData: PendingOrderItem }) => {
        const sku_code = rowData.sku_code;
        return <div className="pw-w-full pw-px-2 pw-text-sm">{sku_code}</div>;
      },
    },
    {
      key: 'sku_code',
      name: 'sku_code',
      flexGrow: 1,
      minWidth: 200,
      label: t('pos:products'),
      cell: ({ rowData }: { rowData: PendingOrderItem }) => {
        return <ItemProduct orderItem={rowData} />;
      },
    },
    {
      key: 'quantity',
      name: 'quantity',
      width: 120,
      label: t('pos:quantity'),
      cell: ({ rowData }: { rowData: PendingOrderItem }) => {
        const defaultValue = rowData.quantity?.toString() || '';
        const canPickQuantity = getOrderItemCanPickQuantity(
          rowData.sku_id,
          rowData?.can_pick_quantity || Infinity,
          listOrderItems,
          rowData.id,
        );
        const handleChange = (value: string, isInput: boolean) => {
          if (!isInput) handleChangeQuantity(value, rowData);
        };
        return (
          <div className="pw-h-full pw-flex pw-flex-col pw-items-center pw-justify-center pw-px-2">
            <QuantityControl
              size={QuantityControlSize.Small}
              defaultValue={defaultValue}
              maxQuantity={canPickQuantity}
              onBlur={handleChange}
              onChange={handleChange}
              showErrorMessage={false}
              classNameTextInput="!pw-text-blue-700 !pw-text-sm"
            />
          </div>
        );
      },
    },
    {
      key: 'price',
      name: 'price',
      width: 100,
      label: t('pos:normal_price'),
      cell: ({ rowData }: { rowData: PendingOrderItem }) => {
        const defaultValue = rowData.price?.toString() || '';
        const handleChange = (value: string) => {
          handleChangePrice(value, rowData);
        };
        return (
          <div className="pw-h-full pw-flex pw-items-center pw-justify-end pw-pr-2.5">
            <AutoResizeInput
              name=""
              defaultValue={defaultValue}
              isNumber={true}
              placeholder="0"
              onBlur={handleChange}
              isForm={false}
              className="!pw-text-sm"
            />
          </div>
        );
      },
    },
    {
      key: 'total_price',
      name: 'total_price',
      width: 100,
      label: t('pos:total_price'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: PendingOrderItem }) => {
        return (
          <div className="pw-text-right pw-w-full pw-px-2 pw-font-semibold pw-text-sm">
            {formatCurrency(rowData.quantity * rowData.price)}
          </div>
        );
      },
    },
    {
      key: 'action-edit',
      name: 'action',
      width: 50,
      label: '',
      cell: ({ rowData }: { rowData: PendingOrderItem }) => {
        return (
          <div className="pw-flex pw-justify-center">
            <Whisper
              placement="autoVertical"
              trigger="hover"
              speaker={<Tooltip arrow={true}>{t('pos:add_note')}</Tooltip>}
            >
              <button
                className="pw-bg-transparent pw-mr-1 pw-p-3 pw-cursor-pointer pw-text-neutral-secondary hover:pw-bg-slate-100 pw-rounded"
                onClick={() => setShowEditNote(rowData)}
              >
                <BsPencilSquare size={20} />
              </button>
            </Whisper>
          </div>
        );
      },
    },
  ];
};
