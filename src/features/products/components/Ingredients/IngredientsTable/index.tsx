import { useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ingredientsTableConfig } from '~app/features/products/components/Ingredients/IngredientsSelection/config';
import { StaticTable } from '~app/components';
import { renderIngredientsPricePerProduct } from '~app/utils/helpers';
import { ModalPlacement, ModalRendererInline, ModalTypes, ModalSize } from '~app/modals';
import IngredientsSelection from '~app/features/products/components/Ingredients/IngredientsSelection';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  onSuccess?(value: Ingredient): void;
};

type Props = {
  selectedSku: PendingSku;
  canEdit?: boolean;
  onChange(value: ExpectedAny): void;
};

const IngredientsTable = ({ selectedSku, canEdit = true, onChange }: Props) => {
  const { t } = useTranslation('ingredients-form');
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const canViewPrice = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);

  return (
    <div>
      <div className="pw-overflow-auto scrollbar-sm pw-max-h-[40vh]">
        <StaticTable
          columnConfig={ingredientsTableConfig({
            t,
            hasDelete: canEdit,
            canEdit,
            selected: selectedSku?.recipe || [],
            onChange,
          })}
          data={selectedSku?.recipe || []}
          rowKey="id"
        />
      </div>
      <div className="pw-flex pw-items-center pw-justify-between pw-mt-6">
        <IngredientsSelection
          ingredientsLength={1} // always has ingredient list
          selectedSku={selectedSku}
          childrenType="iconButton"
          onChange={(value) => onChange(value)}
        />
        {canViewPrice && (
          <div className="pw-font-bold pw-flex pw-items-center">
            <span className="pw-mr-1">{t('cost_per_product')}:</span>
            <span className="pw-text-base pw-text-error-active">
              {renderIngredientsPricePerProduct(selectedSku.recipe)}
            </span>
          </div>
        )}
      </div>
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </div>
  );
};

export default memo(IngredientsTable);
