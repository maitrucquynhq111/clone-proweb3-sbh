import { useTranslation } from 'react-i18next';
import { EmptyStateProduct } from '~app/components/Icons';

const EmptyState = () => {
  const { t } = useTranslation('pos');
  return (
    <div className="pw-flex pw-flex-col pw-items-center pw-justify-center pw-mt-10">
      <EmptyStateProduct />
      <h4 className="pw-mt-6 pw-text-base pw-font-normal pw-text-neutral-primary pw-px-4">
        {t('empty_state.summary')}
      </h4>
    </div>
  );
};

export default EmptyState;
