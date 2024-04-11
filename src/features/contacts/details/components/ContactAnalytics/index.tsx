import { useTranslation } from 'react-i18next';
import { useContactDetails } from '~app/features/contacts/hooks/useContactDetails';
import { formatCurrency } from '~app/utils/helpers';

const ContactAnalytics = () => {
  const { t } = useTranslation('contact-details');
  const { data } = useContactDetails();

  return (
    <div className="pw-grid pw-gap-1 pw-items-end sm:pw-grid-cols-1 md:pw-grid-cols-2 lg:pw-grid-cols-4">
      <div className="pw-text-white pw-p-4 pw-bg-gold">
        <span className="pw-text-2xl pw-font-bold">{formatCurrency(data?.total_amount_order || 0)}</span>
        <div className="pw-text-base pw-mt-0.5">{t('analytics.revenue')}</div>
      </div>
      <div className="pw-text-white pw-p-4 pw-bg-success-active">
        <span className="pw-text-2xl pw-font-bold">{formatCurrency(data?.total_quantity_order || 0)}</span>
        <span className="pw-ml-2">{t('order')}</span>
        <div className="pw-text-base pw-mt-0.5">{t('analytics.delivered_order')}</div>
      </div>
      <div className="pw-text-white pw-p-4 pw-bg-warning-active">
        <span className="pw-text-2xl pw-font-bold">{formatCurrency(data?.debt_amount || 0)}</span>
        <div className="pw-text-base pw-mt-0.5">{t('analytics.debt')}</div>
      </div>
      <div className="pw-text-white pw-p-4 pw-bg-neutral-placeholder">
        <span className="pw-text-2xl pw-font-bold">{formatCurrency(data?.total_return_order || 0)}</span>
        <span className="pw-ml-2">{t('order')}</span>
        <div className="pw-text-base pw-mt-0.5">{t('analytics.return_order')}</div>
      </div>
    </div>
  );
};

export default ContactAnalytics;
