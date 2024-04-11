import { useTranslation } from 'react-i18next';
import { EmptyStateRecipeProduct } from '~app/components/Icons';
import { IngredientsSelection } from '~app/features/products/components';

type Props = {
  selectedSku: PendingSku;
  ingredientsLength: number;
  onChange(value: ExpectedAny): void;
};

const EmptyRecipeProduct = ({ selectedSku, ingredientsLength, onChange }: Props) => {
  const { t } = useTranslation('products-form');
  return (
    <div className="pw-flex pw-items-center pw-justify-center pw-flex-col pw-text-center">
      <EmptyStateRecipeProduct />
      <p className="pw-text-base pw-my-3">{t('add_ingredient_to_product')}</p>
      <IngredientsSelection
        ingredientsLength={ingredientsLength}
        selectedSku={selectedSku}
        childrenType="primary"
        onChange={(value) => onChange(value)}
      />
    </div>
  );
};

export default EmptyRecipeProduct;
