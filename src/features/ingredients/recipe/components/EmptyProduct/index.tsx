import { useTranslation } from 'react-i18next';
import { EmptyStateProduct } from '~app/components/Icons';
import { ProductSelection } from '~app/features/ingredients/recipe/components';

type Props = {
  idSelected?: string;
  onChange(value: ExpectedAny): void;
};

const EmptyProduct = ({ idSelected, onChange }: Props) => {
  const { t } = useTranslation('recipe-table');
  return (
    <div className="pw-flex pw-items-center pw-justify-center pw-flex-col pw-text-center">
      <EmptyStateProduct size="120" />
      <p className="pw-text-base pw-my-3">{t('add_product_to_create_recipe')}</p>
      <ProductSelection idSelected={idSelected} onChange={(value) => onChange(value)} childrenType="btn" />
    </div>
  );
};

export default EmptyProduct;
