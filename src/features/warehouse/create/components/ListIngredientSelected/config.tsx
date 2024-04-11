import { BsTrash } from 'react-icons/bs';
import { IconButton, SelectPicker } from 'rsuite';
import { numberFormat } from '~app/configs';
import { AutoResizeInput } from '~app/components';
import { getExistedSelect, renderListSelectUom } from '~app/utils/helpers/ingredientHelpers';
import { formatCurrency } from '~app/utils/helpers';

const renderUom = (ingredient: ExpectedAny, selected: ExpectedAny, onChange: (value: ExpectedAny) => void) => {
  if (ingredient.uom?.sub_uom) {
    const listUom = renderListSelectUom(ingredient);
    const disabled =
      selected.length === 0 ||
      !selected.some((s: ExpectedAny) => s?.ingredient_id === ingredient.id || s.id === ingredient.id);
    const newSelected = [...selected];
    const { existed, existedIndex } = getExistedSelect(selected, ingredient.id);
    return (
      <SelectPicker
        appearance="subtle"
        data={listUom}
        searchable={false}
        cleanable={false}
        value={existed?.uom_id || ingredient.uom.id}
        disabled={disabled}
        onSelect={(_, object: ExpectedAny, e) => {
          e.stopPropagation();
          if (existedIndex !== -1) {
            newSelected[existedIndex].uom_id = object.value;
            newSelected[existedIndex].factor = object.is_standard ? 1 : object?.factor;
            onChange(newSelected);
          }
        }}
      />
    );
  }
  return ingredient?.uom?.name || ingredient?.uom_name || '';
};

export const columnOptions = ({
  t,
  canViewPrice,
  isImportGoods,
  selectedList,
  onChange,
  handleRemoveSku,
  handleChangeQuantity,
  handleChangeHistoricalCost,
}: {
  t: ExpectedAny;
  canViewPrice: boolean;
  isImportGoods: boolean;
  selectedList: PendingPoDetailsIngredient[];
  onChange: (newSelected: ExpectedAny) => void;
  handleRemoveSku: (ingredient: ExpectedAny) => void;
  handleChangeQuantity: (value: string, ingredient: ExpectedAny) => void;
  handleChangeHistoricalCost: (value: number, ingredient: ExpectedAny) => void;
}) => {
  let historicalCost = null;
  let totalPrice = null;
  if (canViewPrice) {
    if (isImportGoods) {
      historicalCost = {
        key: 'price',
        name: 'price',
        width: 150,
        label: t('ingredient-table.historical_cost'),
        className: 'pw-text-right',
        cell: ({ rowData }: { rowData: PendingPoDetailsIngredient }) => {
          const handleChange = (value: string) => {
            handleChangeHistoricalCost(+value, rowData);
          };
          return (
            <div className="pw-h-full pw-flex pw-items-center pw-justify-end pw-pr-2.5">
              <AutoResizeInput
                name=""
                defaultValue={rowData.price.toString()}
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
        key: 'price',
        name: 'price',
        width: 150,
        label: t('ingredient-table.historical_cost'),
        className: 'pw-text-right',
        cell: ({ rowData }: { rowData: PendingPoDetailsIngredient }) => {
          return (
            <div className="pw-h-full pw-flex pw-items-center pw-justify-end pw-pr-2.5">
              {formatCurrency(rowData?.price || 0)}
            </div>
          );
        },
      };
    }
    totalPrice = {
      key: 'total_price',
      name: 'total_price',
      width: 150,
      label: t('ingredient-table.total_price'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: PendingPoDetailsIngredient }) => {
        let price = rowData.price * rowData.quantity;
        if (rowData.uom_id !== rowData.uom.id && rowData?.uom?.sub_uom) {
          price = (rowData.price * rowData.quantity) / rowData.uom.sub_uom.factor;
        }
        return <div className="pw-text-right pw-w-full pw-px-2 pw-text-sm">{numberFormat.format(price)}</div>;
      },
    };
  }

  return [
    {
      key: 'name',
      name: 'name',
      flexGrow: 1,
      label: t('ingredient-table.ingredient'),
      cell: ({ rowData }: { rowData: PendingPoDetailsIngredient }) => {
        return <div className="pw-w-full pw-px-2 pw-text-sm">{rowData.name}</div>;
      },
    },
    {
      key: 'uom',
      name: 'uom',
      label: t('ingredient-table.uom'),
      flexGrow: 0.7,
      cell: ({ rowData }: { rowData: PendingPoDetailsIngredient }) => {
        return <div className="pw-px-2.5 pw-text-base">{renderUom(rowData, selectedList, onChange)}</div>;
      },
    },
    historicalCost,
    {
      key: 'quantity',
      name: 'quantity',
      width: 100,
      label: isImportGoods ? t('ingredient-table.quantity') : t('ingredient-table.quantity-export'),
      cell: ({ rowData }: { rowData: PendingPoDetailsIngredient }) => {
        const handleChange = (value: string) => {
          handleChangeQuantity(value, rowData);
        };
        return (
          <div className="pw-h-full pw-flex pw-items-center pw-justify-end pw-pr-2.5">
            <AutoResizeInput
              name=""
              defaultValue={rowData.quantity.toString()}
              isNumber={true}
              max={!isImportGoods ? rowData.total_quantity : Infinity}
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
      cell: ({ rowData }: { rowData: PendingPoDetailsIngredient }) => {
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
