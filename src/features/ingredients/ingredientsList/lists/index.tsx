import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { BsTrash } from 'react-icons/bs';
import { initFilterValues, columnOptions, filterOptions } from './config';
import { TableHeaderAction } from '~app/features/ingredients/ingredientsList/components';
import { Table, Filter, ConfirmModal } from '~app/components';
import { INGREDIENTS_KEY, useGetIngredientsQuery } from '~app/services/queries';
import { useDeleteIngredientMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import { EmptyStateRecipeProduct } from '~app/components/Icons';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { IngredientPermission, useHasPermissions } from '~app/utils/shield';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  detail?: Ingredient;
};

const RecipeList = (): JSX.Element => {
  const { t } = useTranslation('ingredients-form');
  const tableRef = useRef<ExpectedAny>();
  const [selected, setSelected] = useState<Ingredient | null>(null);
  const [variablesFilter, setVariablesFilter] = useState<ExpectedAny>({ name: initFilterValues.name });
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const { mutateAsync } = useDeleteIngredientMutation();
  const canViewDetail = useHasPermissions([IngredientPermission.INGREDIENT_DETAIL_VIEW]);

  const handleClick = (row: Ingredient, action: string) => {
    if (action === 'edit') {
      if (!canViewDetail) return;
      onRowClick(row);
    }
    if (action === 'delete') setSelected(row);
  };

  const handleFilter = useCallback((values: ExpectedAny) => {
    setVariablesFilter({ ...values });
    tableRef?.current?.setVariables(values);
  }, []);

  const onRowClick = (rowData: Ingredient) => {
    if (!canViewDetail) return;
    setModalData({
      modal: ModalTypes.IngredientDetails,
      size: ModalSize.Small,
      placement: ModalPlacement.Right,
      detail: rowData,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (selected) {
        await mutateAsync(selected.id);
        queryClient.invalidateQueries([INGREDIENTS_KEY], { exact: false });
        toast.success(t('success.delete'));
        setSelected(null);
      }
    } catch (error) {
      // TO DO
    }
  };

  return (
    <div>
      <Table<ExpectedAny, ExpectedAny>
        ref={tableRef}
        columnOptions={columnOptions({ onClick: handleClick })}
        variables={initFilterValues}
        query={useGetIngredientsQuery}
        onRowClick={onRowClick}
        emptyIcon={!variablesFilter.name ? <EmptyStateRecipeProduct /> : null}
        emptyDescription={!variablesFilter.name ? t('ingredients-table:empty_state_1') : null}
        emptyDescription2={!variablesFilter.name ? t('ingredients-table:empty_state_2') : null}
        headerFilter={<Filter initValues={initFilterValues} onFilter={handleFilter} filterOptions={filterOptions()} />}
        headerButton={<TableHeaderAction />}
        dataKey="id"
      />
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
      {selected && (
        <ConfirmModal
          open={true}
          title={t('delete_ingredients')}
          description={t('delete_ingredients_description')}
          iconTitle={<BsTrash size={24} />}
          isDelete={true}
          onConfirm={handleConfirmDelete}
          onClose={() => setSelected(null)}
          cancelText={t('common:back') || ''}
        />
      )}
    </div>
  );
};
export default RecipeList;
