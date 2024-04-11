import { useTranslation } from 'react-i18next';
import AnimatedNumber from 'animated-number-react';
import { formatCurrency } from '~app/utils/helpers';
import { useInventoryAnalyticsQuery } from '~app/services/queries';
import { numberFormat } from '~app/configs';

const WarehouseAnalytics = () => {
  const { t } = useTranslation('warehouse-table');
  const { data } = useInventoryAnalyticsQuery();

  return (
    <div className={`pw-pb-4 pw-grid pw-grid-cols-4 pw-space-x-1 pw-items-end`}>
      <div className={'pw-col-span-1 pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-secondary-main'}>
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={data?.total_quantity}
            formatValue={(value: number) => numberFormat.format(value)}
          />
        </div>
        <div className="pw-text-base">{t(`quantity`)}</div>
      </div>
      <div className={'pw-col-span-1 pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-primary-main'}>
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={data?.total_amount}
            formatValue={(value: number) => numberFormat.format(value)}
          />
        </div>
        <div className="pw-text-base">{t(`inventory_value`)}</div>
      </div>
      <div className={'pw-col-span-1 pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-gold'}>
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={data?.total_out_of_stock}
            formatValue={(value: number) => formatCurrency(value)}
          />
        </div>
        <div className="pw-text-base">{t(`out_of_stock`)}</div>
      </div>
      <div className={'pw-col-span-1 pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-secondary-border'}>
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={data?.total_non_stock}
            formatValue={(value: number) => formatCurrency(value)}
          />
        </div>
        <div className="pw-text-base">{t(`not_open_inventory`)}</div>
      </div>
    </div>
  );
};

export default WarehouseAnalytics;
