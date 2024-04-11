import { BsTrash } from 'react-icons/bs';
import { IconButton } from 'rsuite';
import ItemProduct from '../ItemProduct';
import { numberFormat } from '~app/configs';
import { AutoResizeInput } from '~app/components';
import { getFinalPrice } from '~app/utils/helpers';

export const columnOptions = ({
  t,
  handleRemoveSku,
  handleChangeQuantity,
}: {
  t: ExpectedAny;
  handleRemoveSku: (skuItem: ExpectedAny) => void;
  handleChangeQuantity: (value: string, skuItem: ExpectedAny) => void;
}) => {
  return [
    {
      key: 'sku',
      name: 'sku',
      width: 100,
      label: t('sku-table.sku'),
      cell: ({ rowData }: { rowData: SkuInventory }) => {
        const sku_code = rowData.sku_code;
        return <div className="pw-w-full pw-px-2 pw-text-sm">{sku_code}</div>;
      },
    },
    {
      key: 'name',
      name: 'name',
      label: t('sku-table.product'),
      flexGrow: 1,
      minWidth: 300,
      cell: ({ rowData }: { rowData: SkuInventory; dataKey: string }) => {
        return <ItemProduct data={rowData} />;
      },
    },
    {
      key: 'quantity',
      name: 'quantity',
      width: 100,
      label: t('sku-table.quantity_print'),
      cell: (props: ExpectedAny) => {
        const { rowData, dataKey } = props;
        const defaultValue = rowData[dataKey]?.toString() || '';
        const handleChange = (value: string) => {
          handleChangeQuantity(value, rowData);
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
            />
          </div>
        );
      },
    },
    {
      key: 'normal_price',
      name: 'normal_price',
      width: 200,
      label: t('sku-table.retail_price'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: SkuInventory }) => {
        return (
          <div className="pw-text-right pw-w-full pw-px-2 pw-text-sm">
            {numberFormat.format(getFinalPrice(rowData))}
          </div>
        );
      },
    },
    {
      key: 'action',
      name: 'action',
      width: 50,
      label: '',
      cell: ({ rowData }: { rowData: SkuInventory }) => {
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
