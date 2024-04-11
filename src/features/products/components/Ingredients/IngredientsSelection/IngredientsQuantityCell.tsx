import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CgMathPlus } from 'react-icons/cg';
import QuantityControl from '~app/components/QuantityControl';
import { QuantityControlSize } from '~app/utils/constants';

type Props = {
  maxQuantity?: number;
  showErrorMessage?: boolean;
  ingredient: Ingredient | RecipeSkuDetail;
  selected: ExpectedAny;
  onChange(value: ExpectedAny): void;
};

const IngredientsQuantityCell = ({ maxQuantity, showErrorMessage, ingredient, selected, onChange }: Props) => {
  const { t } = useTranslation(['common', 'orders-form']);
  const selectedIngredient = selected.find(
    (s: ExpectedAny) => s?.ingredient_id === ingredient.id || s.id === ingredient.id,
  );

  const handleRemove = () => {
    onChange([...selected].filter((s) => s?.ingredient_id !== ingredient.id && s.id !== ingredient.id));
  };

  const handleClick = () => {
    onChange([...selected, { ...ingredient, quantity: 1 }]);
  };

  const handleChange = (value: string, isInput?: boolean) => {
    if (!isInput && (!value || value === '0')) return handleRemove();
    const newSelected = [...selected];
    const existedIndex = newSelected.findIndex((s) => s?.ingredient_id === ingredient.id || s.id === ingredient.id);
    if (existedIndex === -1) {
      onChange([...newSelected, { ...ingredient, quantity: +value }]);
    } else {
      newSelected[existedIndex].quantity = +value;
      onChange(newSelected);
    }
  };

  const handleBlur = (value: string) => {
    if (!value || value === '0') {
      return handleRemove();
    }
    const newSelected = [...selected];
    const existedIndex = newSelected.findIndex((s) => s.id === ingredient.id);
    newSelected[existedIndex].quantity = +value;
    onChange(newSelected);
  };

  if (!selectedIngredient) {
    return (
      <div className="pw-px-2.5 pw-flex pw-justify-end">
        <button
          className="pw-w-8 pw-h-8 pw-rounded pw-flex pw-justify-center pw-items-center pw-bg-primary-main"
          onClick={handleClick}
        >
          <CgMathPlus className="pw-text-neutral-white" size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="pw-px-2.5 pw-flex pw-flex-col pw-justify-end">
      <QuantityControl
        size={QuantityControlSize.Small}
        maxQuantity={maxQuantity}
        showErrorMessage={showErrorMessage}
        onChange={handleChange}
        onBlur={handleBlur}
        defaultValue={selectedIngredient?.quantity.toString() || '0'}
        errorMessage={(showErrorMessage && t('orders-form:error.max_quantity')) || ''}
      />
    </div>
  );
};

export default memo(IngredientsQuantityCell);
