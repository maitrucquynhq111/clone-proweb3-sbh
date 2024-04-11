import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import LastOrderTable from './LastOrderTable';
import { EmptyState } from '~app/components';
import { EmptyStateOrder } from '~app/components/Icons';
import { useOrdersQuery } from '~app/services/queries';
import { useContactDetails } from '~app/features/contacts/hooks/useContactDetails';

const LastOrder = () => {
  const { t } = useTranslation('contact-details');
  const { data } = useContactDetails();
  const defaultVariables = useMemo(
    () => ({ page: 1, pageSize: 1, orderBy: 'created_at desc', contact_id: data?.id || '' }),
    [data],
  );
  const { data: orders } = useOrdersQuery({ ...defaultVariables, enabled: !!data?.id });

  return (
    <div className="pw-mb-6">
      <h6 className="pw-text-lg pw-font-bold">{t('title.last_order')}</h6>
      {orders?.data?.length === 0 ? (
        <EmptyState icon={<EmptyStateOrder size="120" />} description1={t('empty_state.no_interaction')} hiddenButton />
      ) : (
        <LastOrderTable defaultVariables={defaultVariables} />
      )}
    </div>
  );
};

export default LastOrder;
