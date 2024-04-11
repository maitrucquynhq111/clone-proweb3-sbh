import { useTranslation } from 'react-i18next';
import { EmptyStateProduct } from '~app/components/Icons';

const EmptyState = () => {
  const { t } = useTranslation('barcode');
  return (
    <div className="pw-flex pw-flex-col pw-items-center pw-justify-center pw-mt-4">
      <EmptyStateProduct />
      <h4 className="pw-mt-6 pw-text-base pw-font-normal pw-text-neutral-primary">{t('empty_state.summary')}</h4>
    </div>
  );
};

export default EmptyState;
