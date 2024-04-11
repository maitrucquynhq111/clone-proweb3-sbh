import { useTranslation } from 'react-i18next';
import AnimatedNumber from 'animated-number-react';
import { currencyFormat } from '~app/utils/helpers';
import { useGetTransactionTotalAmount } from '~app/services/queries';

const DebtAnalytics = () => {
  const { t } = useTranslation('common');

  const { data } = useGetTransactionTotalAmount({});

  return (
    <div className={`pw-pb-4 pw-grid pw-grid-cols-4 pw-space-x-1 pw-items-end`}>
      <div className="pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-green-700">
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={data?.total_amount_in || 0}
            formatValue={(value: number) => {
              return `đ ${currencyFormat(value.toFixed(0).toString())}`;
            }}
          />
        </div>
        <div className="pw-text-base">
          <span>{t(`debt-analytic.must-receive`)}</span>
        </div>
      </div>

      <div className="pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-red-600">
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={data?.total_amount_out || 0}
            formatValue={(value: number) => {
              return `đ ${currencyFormat(value.toFixed(0).toString())}`;
            }}
          />
        </div>
        <div className="pw-text-base">
          <span>{t(`debt-analytic.must-pay`)}</span>
        </div>
      </div>
      <div className="pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-green-500">
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={data?.total_amount_in_overdue || 0}
            formatValue={(value: number) => {
              return `đ ${currencyFormat(value.toFixed(0).toString())}`;
            }}
          />
        </div>
        <div className="pw-text-base">
          <span>{t(`debt-analytic.must-receive-overdue`)}</span>
        </div>
      </div>
      <div className="pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-red-400">
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={data?.total_amount_out_overdue || 0}
            formatValue={(value: number) => {
              return `đ ${currencyFormat(value.toFixed(0).toString())}`;
            }}
          />
        </div>
        <div className="pw-text-base">
          <span>{t(`debt-analytic.must-pay-overdue`)}</span>
        </div>
      </div>
    </div>
  );
};

export default DebtAnalytics;
