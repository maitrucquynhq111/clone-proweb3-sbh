import cx from 'classnames';
import { UseFormSetValue, useFormContext } from 'react-hook-form';
import { BsChevronUp } from 'react-icons/bs';
import { useState } from 'react';
import { Button } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { columnOptions } from './config';
import { StaticTable } from '~app/components';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';

export const ListIngredientSelected = ({
  setValue,
  isImportGoods,
}: {
  setValue: UseFormSetValue<PendingInventoryCreate>;
  isImportGoods: boolean;
}): JSX.Element => {
  const { t } = useTranslation('purchase-order');
  const [collapse, setCollapse] = useState(false);
  const { watch } = useFormContext<PendingInventoryCreate>();
  const selectedList = watch('po_detail_ingredient') || [];
  const canUpdateHistoricalCost = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);

  const handleChange = (newSelected: ExpectedAny) => {
    setValue('po_detail_ingredient', newSelected);
  };

  const handleChangeQuantity = (value: string, ingredient: PendingPoDetailsIngredient) => {
    if (!value || value === '0') return handleRemoveSku(ingredient);
    const newSelected = [...selectedList];
    const existedIndex = newSelected.findIndex((s) => s?.ingredient_id === ingredient.id || s.id === ingredient.id);
    if (existedIndex === -1) {
      setValue('po_detail_ingredient', [...newSelected, { ...ingredient, quantity: +value }]);
    } else {
      setValue(
        'po_detail_ingredient',
        newSelected.map((selected, index) => {
          if (index === existedIndex) return { ...ingredient, quantity: +value };
          return selected;
        }),
      );
    }
  };

  const handleChangeHistoricalCost = (value: number, ingredient: PendingPoDetailsIngredient) => {
    const newSelectedList = [...selectedList];
    const existedIndex = newSelectedList.findIndex((s) => s?.ingredient_id === ingredient.id || s.id === ingredient.id);
    setValue(
      'po_detail_ingredient',
      newSelectedList.map((selected, index) => {
        if (index === existedIndex) return { ...ingredient, price: value };
        return selected;
      }),
    );
  };

  const handleRemoveSku = (ingredient: PendingPoDetailsIngredient) => {
    setValue(
      'po_detail_ingredient',
      [...selectedList].filter((s) => s?.ingredient_id !== ingredient.id && s.id !== ingredient.id),
    );
  };

  return (
    <div>
      <Button
        appearance="subtle"
        startIcon={
          <BsChevronUp
            size={20}
            className={cx('pw-text-primary-main  pw-transition-all pw-duration-200 pw-ease-in', {
              'pw-rotate-180': collapse,
            })}
          />
        }
        className="!pw-text-primary-main !pw-text-base !pw-font-semibold !pw-mb-2"
        onClick={() => setCollapse(!collapse)}
      >{`${t('ingredient-table.ingredient')} (${selectedList.length})`}</Button>
      {!collapse && (
        <StaticTable
          columnConfig={columnOptions({
            t,
            canViewPrice: canUpdateHistoricalCost,
            isImportGoods,
            selectedList,
            onChange: handleChange,
            handleRemoveSku,
            handleChangeQuantity,
            handleChangeHistoricalCost,
          })}
          data={selectedList}
          rowKey="id"
        />
      )}
    </div>
  );
};
