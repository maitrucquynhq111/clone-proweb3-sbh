import * as yup from 'yup';
import { BsPlusSquareFill } from 'react-icons/bs';
import cx from 'classnames';
import { IconButton } from 'rsuite';
import { toast } from 'react-toastify';
import ItemProduct from '../ItemProduct';
import InputDropdown from './InputDropdown';
import QuantityControl from '~app/components/QuantityControl';
import { QuantityControlSize } from '~app/utils/constants';
import { ComponentType } from '~app/components/HookForm/utils';

export const searchYupSchema = () => {
  return yup.object().shape({});
};

export type InputDropdownProps = {
  name: string;
  data: ExpectedAny[];
  placeholder?: string;
  isRequired?: boolean;
  async?: boolean;
  searchKey?: string;
  tableHeight?: number;
  rowHeight?: number;
};

export const searchSchema = ({ t }: { t: ExpectedAny }) => {
  return {
    className: 'pw-grid pw-grid-cols-12',
    type: 'container',
    name: 'form',
    children: [
      {
        type: ComponentType.Label,
        className: 'pw-col-span-12 !pw-text-base pw-font-bold',
        label: t('barcode:printing_products'),
      },
      {
        blockClassName: 'pw-col-span-12 pw-pt-2 pw-pb-6 pw-px-4 -pw-mx-4 pw-w-5/12',
        className: ``,
        type: 'block',
        visible: true,
        name: 'first-block',
        children: [
          {
            type: ComponentType.Custom,
            name: 'search',
            valueName: 'search',
            placeholder: t('print-barcode.search'),
            key: 'contact-info',
            className: 'pw-gap-x-4 pw-items-center',
            titleClassName: 'pw-text-base pw-font-normal pw-text-black',
            subTitleClassName: 'pw-text-sm pw-font-normal pw-mt-1',
            rowHeight: 56,
            component: InputDropdown,
          },
        ],
      },
    ],
  };
};

export const skuListConfig = ({
  t,
  selectedList,
  handleChangeQuantity,
}: {
  t: ExpectedAny;
  selectedList: Array<SkuSelected>;
  handleChangeQuantity: (value: string, skuItem: ExpectedAny) => void;
}) => {
  return [
    {
      key: 'name',
      name: 'name',
      label: t('sku-table.product'),
      flexGrow: 1,
      minWidth: 200,
      cell: ({ rowData }: { rowData: SkuInventory }) => {
        return <ItemProduct data={rowData} />;
      },
    },
    {
      key: 'quantity',
      name: 'quantity',
      label: t('sku-table.quantity'),
      width: 150,
      align: 'right',
      cell: (props: ExpectedAny) => {
        const { rowData } = props;
        const dataSelected = selectedList.find((item) => item.id === rowData.id);
        const quantity = dataSelected ? dataSelected.quantity : 0;
        return (
          <div className="pw-h-full pw-flex pw-items-center pw-justify-end pw-px-4">
            {quantity === 0 ? (
              <IconButton
                onClick={() => {
                  if (rowData.sku_code) {
                    handleChangeQuantity('1', rowData);
                  } else {
                    toast.warning(t('warning.please_update_sku_code'));
                  }
                }}
                className="!pw-bg-transparent !pw-overflow-visible !pw-w-max !py-0 !px-2 pw-h-9"
                icon={
                  <BsPlusSquareFill
                    size={40}
                    className={cx('pw-text-green-700', {
                      '!pw-text-gray-300': !rowData.sku_code,
                    })}
                  />
                }
              />
            ) : (
              <QuantityControl
                size={QuantityControlSize.Small}
                defaultValue={quantity.toString()}
                disabled={!rowData.sku_code}
                onChange={(value) => handleChangeQuantity(value, rowData)}
                placeholder="0"
                className="!pw-w-auto"
              />
            )}
          </div>
        );
      },
    },
  ];
};
