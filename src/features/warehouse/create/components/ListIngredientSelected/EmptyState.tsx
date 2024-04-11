import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { EmptyStateProduct } from '~app/components/Icons';

const EmptyState = ({ isImportGoods }: { isImportGoods: boolean }) => {
  const { t } = useTranslation('purchase-order');
  const { watch } = useFormContext<PendingInventoryCreate>();

  if (watch('po_details').length > 0 || watch('po_detail_ingredient').length > 0) return null;

  return (
    <div className="pw-flex pw-flex-col pw-items-center pw-justify-center pw-mt-4">
      <EmptyStateProduct />
      <h4 className="pw-mt-6 pw-text-base pw-font-normal pw-text-neutral-primary">
        {isImportGoods ? t('empty_state.summary-purchase') : t('empty_state.summary-adjust')}
      </h4>
    </div>
  );
};

export default EmptyState;
