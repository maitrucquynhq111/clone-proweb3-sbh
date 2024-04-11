import { useTranslation } from 'react-i18next';
import AnimatedNumber from 'animated-number-react';
import { currencyFormat } from '~app/utils/helpers';
import { useGetCashbookTotalAmount } from '~app/services/queries';

const TransactionAnalytics = ({
  options: { start_time, end_time },
}: {
  options: {
    start_time: string;
    end_time: string;
  };
}) => {
  const { t } = useTranslation('common');

  const { data } = useGetCashbookTotalAmount({
    start_time,
    end_time,
  });

  const { total_amount_in = 0, total_amount_out = 0 } = data || {};

  return (
    <div className={`pw-pb-4 pw-grid pw-grid-cols-3 pw-space-x-1 pw-items-end`}>
      <div className={'pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-green-700'}>
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={total_amount_in}
            formatValue={(value: number) => {
              return `đ ${currencyFormat(value.toFixed(0).toString())}`;
            }}
          />
        </div>
        <div className="pw-text-base">{t(`cashbook-analytic.description-in`)}</div>
      </div>
      <div className={'pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-red-600'}>
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={total_amount_out}
            formatValue={(value: number) => {
              return `đ ${currencyFormat(value.toFixed(0).toString())}`;
            }}
          />
        </div>
        <div className="pw-text-base">{t(`cashbook-analytic.description-out`)}</div>
      </div>
      <div className={'pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-sky-600'}>
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={total_amount_in - total_amount_out}
            formatValue={(value: number) => {
              return `đ ${currencyFormat(value.toFixed(0).toString())}`;
            }}
          />
        </div>
        <div className="pw-text-base">{t(`cashbook-analytic.description-balance`)}</div>
      </div>
    </div>
  );
};

export default TransactionAnalytics;
