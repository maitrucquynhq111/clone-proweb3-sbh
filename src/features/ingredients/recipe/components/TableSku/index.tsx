import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { columnOptions } from './config';
import { StaticTable } from '~app/components';
import { FormulaPermission, ProductPermission, useHasPermissions } from '~app/utils/shield';

type Props = {
  listSku: RecipeDetailSku[];
  ingredientsLength: number;
  onChangeIngredients(index: number, value: ExpectedAny): void;
  handleChooseSku(value: number): void;
};

const TableSku = ({ listSku, ingredientsLength, handleChooseSku, onChangeIngredients }: Props) => {
  const { t } = useTranslation('recipe-table');
  const canViewHistoricalCost = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);
  const canCreateEdit = useHasPermissions([FormulaPermission.FORMULA_CREATE, FormulaPermission.FORMULA_UPDATE]);

  return (
    <div className="pw-overflow-auto scrollbar-sm pw-max-h-[40vh] pw-px-6">
      <StaticTable
        columnConfig={columnOptions({
          t,
          canViewPrice: canViewHistoricalCost,
          canCreateEdit,
          ingredientsLength,
          handleChooseSku,
          onChangeIngredients,
        })}
        data={listSku || []}
        rowKey="id"
      />
    </div>
  );
};

export default memo(TableSku);
