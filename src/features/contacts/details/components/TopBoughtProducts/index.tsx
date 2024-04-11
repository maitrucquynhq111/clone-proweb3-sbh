import { useTranslation } from 'react-i18next';
import { columnOptions } from './config';
import { EmptyState, StaticTable } from '~app/components';
import { EmptyStateProduct } from '~app/components/Icons';
import { useContactDetails } from '~app/features/contacts/hooks/useContactDetails';

const TopBoughtProducts = () => {
  const { t } = useTranslation('contact-details');
  const { data } = useContactDetails();

  return (
    <div className="pw-mb-6">
      <h6 className="pw-text-lg pw-font-bold pw-mb-4">{t('title.top_bought_products')}</h6>
      {!data?.most_order_product || data.most_order_product.length === 0 ? (
        <EmptyState
          icon={<EmptyStateProduct size="120" />}
          description1={t('empty_state.no_bought_product')}
          hiddenButton
        />
      ) : (
        <StaticTable columnConfig={columnOptions({ t })} data={data.most_order_product} rowKey="id" />
      )}
    </div>
  );
};

export default TopBoughtProducts;
