import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { BsTrash } from 'react-icons/bs';
import { initFilterValues, columnOptions, filterOptions } from './config';
import { TableHeaderAction, HeaderSelectAll } from '~app/features/ingredients/recipe/components';
import { Table, Filter, ConfirmModal } from '~app/components';
import { RECIPES_KEY, useRecipesQuery } from '~app/services/queries';
import { useDeleteRecipeMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import { EmptyStateRecipe } from '~app/components/Icons';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { FormulaPermission, useHasPermissions } from '~app/utils/shield';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  id?: string;
};

const RecipeList = (): JSX.Element => {
  const { t } = useTranslation('recipe-table');
  const canCreate = useHasPermissions([FormulaPermission.FORMULA_CREATE]);
  const canView = useHasPermissions([FormulaPermission.FORMULA_VIEW]);
  const tableRef = useRef<ExpectedAny>();
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [variablesFilter, setVariablesFilter] = useState<ExpectedAny>({ search: initFilterValues.search });
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const { mutateAsync } = useDeleteRecipeMutation();

  const handleClick = (row: Recipe, action: string) => {
    if (action === 'edit') {
      onRowClick(row);
    }
    if (action === 'delete') setSelected(row);
  };
  const handleFilter = useCallback((values: ExpectedAny) => {
    setVariablesFilter({ ...values });
    tableRef?.current?.setVariables(values);
  }, []);

  const onRowClick = (rowData: Recipe) => {
    if (!canView) return;
    setModalData({
      modal: ModalTypes.RecipeUpdate,
      size: ModalSize.Small,
      placement: ModalPlacement.Right,
      id: rowData.id,
    });
  };

  const onClickCreate = useCallback(() => {
    setModalData({
      modal: ModalTypes.RecipeCreate,
      size: ModalSize.Small,
      placement: ModalPlacement.Right,
    });
  }, []);

  const handleConfirmDelete = async () => {
    try {
      if (selected) {
        await mutateAsync(selected.id);
        queryClient.invalidateQueries([RECIPES_KEY], { exact: false });
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
        headerSelectAll={({ selectedData }: { selectedData: Recipe[] }) => {
          return <HeaderSelectAll selected={selectedData} />;
        }}
        columnOptions={columnOptions({ onClick: handleClick })}
        variables={initFilterValues}
        query={useRecipesQuery}
        onRowClick={onRowClick}
        emptyIcon={!variablesFilter.search ? <EmptyStateRecipe /> : null}
        emptyDescription={!variablesFilter.search ? t('empty-state-1') : null}
        emptyDescription2={!variablesFilter.search ? t('empty-state-2') : null}
        selectable
        headerFilter={<Filter initValues={initFilterValues} onFilter={handleFilter} filterOptions={filterOptions()} />}
        headerButton={canCreate ? <TableHeaderAction onClickCreate={onClickCreate} /> : null}
        dataKey="id"
        compact
      />
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
      {selected && (
        <ConfirmModal
          open={true}
          title={t('delete_recipe')}
          description={t('delete_recipe_description')}
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
