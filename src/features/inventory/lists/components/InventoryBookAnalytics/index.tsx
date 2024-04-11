import { useTranslation } from 'react-i18next';
import AnimatedNumber from 'animated-number-react';
import { formatCurrency } from '~app/utils/helpers';
import { useInventoryBookAnalyticsQuery } from '~app/services/queries';

const InventoryBookAnalytics = ({ filterValues }: { filterValues: ExpectedAny }) => {
  const { t } = useTranslation('inventory-table');
  const { data } = useInventoryBookAnalyticsQuery({
    start_time: filterValues.start_time,
    end_time: filterValues.end_time,
  });

  return (
    <div className={`pw-pb-4 pw-grid pw-grid-cols-4 pw-space-x-1 pw-items-end`}>
      <div className={'pw-col-span-1 pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-other-blue'}>
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={data?.first_period}
            formatValue={(value: number) => formatCurrency(value)}
          />
        </div>
        <div className="pw-text-base">{t(`analytics.first_period`)}</div>
      </div>
      <div className={'pw-col-span-1 pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-primary-main'}>
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={data?.inbound_in_period}
            formatValue={(value: number) => formatCurrency(value)}
          />
        </div>
        <div className="pw-text-base">{t(`analytics.inbound_in_period`)}</div>
      </div>
      <div className={'pw-col-span-1 pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-secondary-main'}>
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={data?.outbound_in_period}
            formatValue={(value: number) => formatCurrency(value)}
          />
        </div>
        <div className="pw-text-base">{t(`analytics.outbound_in_period`)}</div>
      </div>
      <div className={'pw-col-span-1 pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-gold'}>
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={data?.last_period}
            formatValue={(value: number) => formatCurrency(value)}
          />
        </div>
        <div className="pw-text-base">{t(`analytics.last_period`)}</div>
      </div>
    </div>
  );
};

export default InventoryBookAnalytics;
