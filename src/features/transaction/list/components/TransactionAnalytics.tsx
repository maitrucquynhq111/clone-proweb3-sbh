import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import AnimatedNumber from 'animated-number-react';
import { currencyFormat } from '~app/utils/helpers';
import { useGetCashbookTotalAmount, useGetTransactionTotalAmount } from '~app/services/queries';

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

  const { data: dataTransaction } = useGetTransactionTotalAmount({
    start_time,
    end_time,
  });

  return (
    <div className={`pw-pb-4 pw-grid pw-grid-cols-4 pw-space-x-1 pw-items-end`}>
      <div className={cn('pw-px-3 pw-text-white pw-border-opacity-20 pw-p-2 pw-h-18 pw-bg-green-500')}>
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold ">
          <AnimatedNumber
            duration={300}
            value={data?.total_amount_in || 0}
            formatValue={(value: number) => {
              return `đ ${currencyFormat(value.toFixed(0).toString())}`;
            }}
          />
        </div>
        <div className="pw-text-base">
          <span>
            <AnimatedNumber
              duration={300}
              value={data?.total_txn_in || 0}
              formatValue={(value: number) => value.toFixed(0)}
            />
          </span>
          <span className="pw-ml-1 pw-whitespace-nowrap pw-text-ellipsis">{t(`transaction-analytic.received`)}</span>
        </div>
      </div>
      <div className={cn('pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-green-700')}>
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={dataTransaction?.total_amount_in || 0}
            formatValue={(value: number) => {
              return `đ ${currencyFormat(value.toFixed(0).toString())}`;
            }}
          />
        </div>
        <div className="pw-text-base">
          <span>
            <AnimatedNumber
              duration={0}
              value={dataTransaction?.total_txn_in || 0}
              formatValue={(value: number) => value.toFixed(0)}
            />
          </span>
          <span className="pw-ml-1 pw-whitespace-nowrap pw-text-ellipsis">
            {t(`transaction-analytic.must-receive`)}
          </span>
        </div>
      </div>
      <div className={cn('pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-red-400')}>
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
          <span>
            <AnimatedNumber
              duration={300}
              value={data?.total_txn_out}
              formatValue={(value: number) => value.toFixed(0)}
            />
          </span>
          <span className="pw-ml-1 pw-whitespace-nowrap pw-text-ellipsis">{t(`transaction-analytic.spent`)}</span>
        </div>
      </div>
      <div className={cn('pw-px-3 pw-border-opacity-20 pw-text-white pw-p-2 pw-h-18 pw-bg-red-600')}>
        <div className="pw-text-2xl pw-whitespace-nowrap pw-font-bold">
          <AnimatedNumber
            duration={300}
            value={dataTransaction?.total_amount_out || 0}
            formatValue={(value: number) => {
              return `đ ${currencyFormat(value.toFixed(0).toString())}`;
            }}
          />
        </div>
        <div className="pw-text-base">
          <span>
            <AnimatedNumber
              duration={300}
              value={dataTransaction?.total_txn_out || 0}
              formatValue={(value: number) => value.toFixed(0)}
            />
          </span>
          <span className="pw-ml-1 pw-whitespace-nowrap pw-text-ellipsis">{t(`transaction-analytic.must-spent`)}</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionAnalytics;
