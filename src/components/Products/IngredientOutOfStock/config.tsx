import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { BsTrash } from 'react-icons/bs';
import { IconButton } from 'rsuite';
import IngredientTable from './IngredientTable';
import UomSelect from './UomSelect';
import { ComponentType } from '~app/components/HookForm/utils';
import { formatCurrency } from '~app/utils/helpers';
import { AutoResizeInput } from '~app/components/FormControls';

export const ingredientOutOfStockYupSchema = () => {
  return yup.object().shape({
    data: yup.array(),
  });
};

type ColumnsConfigProps = {
  data: Ingredient[];
  update: (index: number, value: ExpectedAny) => void;
  remove: (index: number) => void;
};

export const ingredientOutOfStockFormSchema = () => {
  const content = [
    {
      type: ComponentType.Custom,
      name: 'products',
      component: IngredientTable,
    },
  ];

  return {
    type: 'container',
    name: 'form',
    children: content,
  };
};

export const paymentHistoryColumnsConfig = ({ data, update, remove }: ColumnsConfigProps) => {
  const { t } = useTranslation('pos');
  return [
    {
      key: 'name',
      name: 'name',
      label: t('out_of_stock_ingredient.ingredient'),
      flexGrow: 1,
      cell: (props: ExpectedAny) => <div className="pw-text-base pw-p-3">{props.rowData.name}</div>,
    },
    {
      key: 'uom',
      name: 'uom',
      label: t('out_of_stock_ingredient.uom'),
      flexGrow: 1,
      cell: (props: ExpectedAny) => {
        const { rowData, rowIndex } = props;
        if (rowData.uom?.sub_uom) {
          const data = toListUom(rowData);
          const isMainUom = rowData.uom_id === rowData.uom.id;
          return (
            <UomSelect
              data={data}
              selectedName={isMainUom ? rowData.uom.name : rowData.uom.sub_uom.name}
              onChange={(value) => {
                let newPrice = rowData.price;
                if (isMainUom) {
                  newPrice = rowData.price / rowData.uom.sub_uom.factor;
                } else {
                  newPrice = rowData.price * rowData.uom.sub_uom.factor;
                }
                update(rowIndex, { ...rowData, uom_id: value, price: newPrice });
              }}
            />
          );
        }
        return <div className="pw-p-3">{rowData.uom.name}</div>;
      },
    },
    {
      key: 'price',
      name: 'price',
      label: t('out_of_stock_ingredient.selling_price'),
      align: 'right',
      flexGrow: 1,
      cell: (props: ExpectedAny) => {
        const { rowData, rowIndex } = props;
        return (
          <div className="pw-px-3">
            <AutoResizeInput
              name={`data[${rowIndex}].price`}
              defaultValue={rowData.price.toString()}
              isNumber
              placeholder="0"
              className="pw-cursor-pointer"
              onBlur={(value) => update(rowIndex, { ...rowData, price: +value })}
            />
          </div>
        );
      },
    },
    {
      key: 'total_quantity',
      name: 'total_quantity',
      label: t('out_of_stock_ingredient.quantity'),
      align: 'right',
      flexGrow: 0.5,
      cell: (props: ExpectedAny) => {
        const { rowData, rowIndex } = props;
        return (
          <div className="pw-px-3">
            <AutoResizeInput
              name={`data[${rowIndex}].total_quantity`}
              defaultValue={rowData.total_quantity.toString()}
              isNumber
              placeholder="0"
              className="pw-cursor-pointer"
              onBlur={(value) => update(rowIndex, { ...rowData, total_quantity: +value })}
            />
          </div>
        );
      },
    },
    {
      key: 'total_import',
      name: 'total_import',
      label: t('out_of_stock_ingredient.total_import'),
      align: 'right',
      flexGrow: 1,
      cell: (props: ExpectedAny) => {
        const { rowIndex } = props;
        const item = data[rowIndex];
        return (
          <div className="pw-px-3 pw-text-base pw-font-semibold">
            {formatCurrency(Math.abs(item?.total_quantity || 0) * (item?.price || 0))}
          </div>
        );
      },
    },
    {
      key: 'action',
      name: 'action',
      label: '',
      width: 50,
      cell: (props: ExpectedAny) => {
        const { rowIndex } = props;
        return (
          <IconButton
            className="pw-px-3 pw-cursor-pointer"
            icon={<BsTrash size={24} />}
            onClick={() => remove(rowIndex)}
          ></IconButton>
        );
      },
    },
  ];
};

export const toPendingPurchaseOrderIngredient = (data: Ingredient[]) => ({
  po_type: 'in',
  option: 'update_quantity_stock',
  po_details: data.map((ingredient) => ({
    sku_id: ingredient.id,
    pricing: ingredient.price,
    quantity: Math.abs(ingredient.total_quantity),
    uom_id: ingredient.uom_id,
  })),
});

export const toListUom = (ingredient: Ingredient) => {
  return [
    { id: ingredient.uom.id, name: ingredient.uom.name, factor: ingredient.uom.sub_uom?.factor || 1 },
    { id: ingredient.uom.sub_uom?.to_uom_id || '', name: ingredient.uom.sub_uom?.name || '' },
  ];
};
