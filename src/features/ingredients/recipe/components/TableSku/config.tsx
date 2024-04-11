import { RiPencilFill } from 'react-icons/ri';
import { Tooltip, Whisper } from 'rsuite';
import { IngredientsSelection } from '~app/features/products/components';
import { renderIngredientsPricePerProduct } from '~app/utils/helpers';

type Params = {
  t: ExpectedAny;
  canViewPrice?: boolean;
  canCreateEdit?: boolean;
  ingredientsLength: number;
  handleChooseSku(value: number): void;
  onChangeIngredients(index: number, value: ExpectedAny): void;
};

export function columnOptions({
  t,
  canViewPrice = true,
  canCreateEdit = true,
  ingredientsLength,
  handleChooseSku,
  onChangeIngredients,
}: Params) {
  let historicalCost = null;
  let action = null;
  if (canViewPrice) {
    historicalCost = {
      key: 'historical_cost',
      name: 'historical_cost',
      label: t('historical_cost'),
      align: 'right',
      width: 132,
      cell: (props: ExpectedAny) => {
        const { rowData } = props;
        const defaultValue = renderIngredientsPricePerProduct(rowData?.recipe || []);
        return <span className="pw-h-full pw-mr-2.5">{defaultValue}</span>;
      },
    };
  }
  if (canCreateEdit) {
    action = {
      key: 'action',
      name: 'action',
      label: '',
      width: 106,
      cell: (props: ExpectedAny) => {
        const { rowIndex } = props;
        return (
          <div className="pw-h-full pw-flex pw-justify-center pw-p-1">
            <Whisper placement="top" trigger="hover" speaker={<Tooltip>{t('recipe_detail')}</Tooltip>}>
              <button
                type="button"
                className="pw-text-blue-600"
                onClick={() => {
                  handleChooseSku(rowIndex);
                }}
              >
                <RiPencilFill className="pw-w-6 pw-h-6" />
              </button>
            </Whisper>
          </div>
        );
      },
    };
  }
  return [
    {
      key: 'name',
      label: t('variant'),
      align: 'left',
      className: 'pw-text-base',
      flexGrow: 1,
    },
    historicalCost,
    {
      key: 'recipe',
      name: 'recipe',
      label: t('ingredients_shorten'),
      width: 132,
      align: 'right',
      cell: (props: ExpectedAny) => {
        const { rowIndex, rowData } = props;
        return (
          <div className="pw-pr-2.5 pw-cursor-pointer pw-flex pw-items-center pw-justify-end pw-h-full pw-w-full pw-absolute pw-top-0">
            <IngredientsSelection
              selectedSku={{ ...rowData, recipe: rowData?.recipe || [] }}
              ingredientsLength={ingredientsLength}
              onChange={(value: ExpectedAny) => onChangeIngredients(rowIndex, value)}
            />
          </div>
        );
      },
    },
    action,
  ];
}
