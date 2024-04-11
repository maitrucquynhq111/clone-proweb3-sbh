import { IconButton, SelectPicker } from 'rsuite';
import { BsTrash } from 'react-icons/bs';
import IngredientsQuantityCell from './IngredientsQuantityCell';
import { getExistedSelect, renderListSelectUom } from '~app/utils/helpers/ingredientHelpers';
import { numberFormat } from '~app/configs';

type Params = {
  t: ExpectedAny;
  isImportGoods?: boolean;
  selected: ExpectedAny;
  hasDelete?: boolean;
  isInPopover?: boolean;
  canEdit?: boolean;
  onChange(value: ExpectedAny): void;
};

const renderUom = (
  ingredient: ExpectedAny,
  selected: ExpectedAny,
  isInPopover: boolean,
  onChange: (value: ExpectedAny) => void,
) => {
  if (ingredient.uom?.sub_uom) {
    const listUom = renderListSelectUom(ingredient);
    const disabled =
      selected.length === 0 ||
      !selected.some((s: ExpectedAny) => s?.ingredient_id === ingredient.id || s.id === ingredient.id);
    const newSelected = [...selected];
    const { existed, existedIndex } = getExistedSelect(selected, ingredient.id);
    if (isInPopover) {
      return (
        <SelectPicker
          appearance="subtle"
          data={listUom}
          searchable={false}
          cleanable={false}
          value={existed?.uom_id || ingredient.uom.id}
          disabled={disabled}
          container={document.getElementById('select-ingredients') || undefined}
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

export function ingredientsTableConfig({
  t,
  isImportGoods,
  selected,
  hasDelete,
  canEdit = true,
  isInPopover = false,
  onChange,
}: Params) {
  const action = {
    key: 'action',
    label: '',
    width: 60,
    cell: ({ rowData }: { rowData: Ingredient }) => {
      return (
        <div className="pw-flex pw-justify-center pw-items-center">
          <IconButton
            appearance="subtle"
            className="pw-w-full pw-h-10 !pw-flex pw-justify-center pw-items-center"
            icon={<BsTrash size={24} className="pw-fill-neutral-secondary" />}
            onClick={() => onChange(selected.filter((s: ExpectedAny) => s.id !== rowData.id))}
          />
        </div>
      );
    },
  };
  const content: ExpectedAny = [
    {
      key: 'name',
      label: t('name'),
      align: 'left',
      className: 'pw-text-base',
      flexGrow: 1,
    },
    {
      key: 'quantity',
      label: t('quantity'),
      align: 'right',
      width: 137,
      cell: ({ rowData: ingredient }: { rowData: Ingredient }) => {
        if (!canEdit) {
          return (
            <div className="pw-text-base pw-w-full pw-px-2.5">
              {numberFormat.format(ingredient.total_quantity || (ingredient as ExpectedAny).quantity || 0)}
            </div>
          );
        }
        return (
          <IngredientsQuantityCell
            ingredient={ingredient}
            maxQuantity={!isImportGoods ? ingredient.total_quantity : Infinity}
            selected={selected}
            showErrorMessage={false}
            onChange={onChange}
          />
        );
      },
    },
    {
      key: 'uom',
      label: t('uom'),
      flexGrow: 0.7,
      cell: ({ rowData }: { rowData: Ingredient }) => {
        return <div className="pw-px-2.5 pw-text-base">{renderUom(rowData, selected, isInPopover, onChange)}</div>;
      },
    },
  ];
  if (hasDelete) {
    content.push(action);
  }
  return content;
}
