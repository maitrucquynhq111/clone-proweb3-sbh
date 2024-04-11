import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AnimatedNumber from 'animated-number-react';
import { useCommissionsQuery } from '~app/services/queries';
import { currencyFormat } from '~app/utils/helpers';

type Props = {
  initValues: ExpectedAny;
};

const CommissionAnalytics = ({ initValues }: Props) => {
  const { t } = useTranslation('commission-table');
  const { data } = useCommissionsQuery(initValues);

  const { total_upgrade, total_commission } = useMemo(() => {
    if (data?.meta) {
      return {
        total_upgrade: data?.meta?.total_upgrade || 0,
        total_commission: data?.meta?.total_commission || 0,
      };
    }
    return { total_upgrade: 0, total_commission: 0 };
  }, [data?.meta]);

  return (
    <div className="pw-py-4 pw-bg-white">
      <div className="pw-grid pw-grid-cols-1 md:pw-grid-cols-2 pw-gap-1 pw-items-end">
        <div className="pw-px-4 pw-col-span-1 pw-text-white pw-p-2 pw-h-18 pw-bg-primary-main">
          <div>
            <span className="pw-text-2xl pw-font-bold">
              <AnimatedNumber
                duration={300}
                value={total_commission}
                formatValue={(value: number) => {
                  return `${currencyFormat(value.toFixed(0).toString())}`;
                }}
              />
            </span>
          </div>
          <div className="pw-text-base">{t('commission_amount')}</div>
        </div>
        <div className="pw-px-4 pw-col-span-1 pw-text-white pw-p-2 pw-h-18 pw-bg-blue-primary">
          <div>
            <span className="pw-text-2xl pw-font-bold">
              <AnimatedNumber
                duration={300}
                value={total_upgrade}
                formatValue={(value: number) => {
                  return value;
                }}
              />
            </span>
          </div>
          <div className="pw-text-base">{t('total_upgrade_package')}</div>
        </div>
      </div>
    </div>
  );
};

export default CommissionAnalytics;
