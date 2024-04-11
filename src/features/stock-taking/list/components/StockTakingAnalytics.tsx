import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useGetListStockTakeQuery } from '~app/services/queries';
import { StockTakingAnalyticStatus, StockTakingAnalyticStatusOption } from '~app/utils/constants';

type Props = {
  value: string;
  initValues: ExpectedAny;
  onChange: (value: string) => void;
};

const StockTakingAnalytics = ({ value, initValues, onChange }: Props) => {
  const { t } = useTranslation('stocktaking-table');
  const { data } = useGetListStockTakeQuery(initValues);

  const handleChange = (newValue: string) => {
    if (newValue === value) return onChange('');
    onChange(newValue);
  };

  return (
    <div className="pw-pb-4 pw-bg-white">
      <div className="pw-grid pw-grid-cols-3 pw-gap-x-1 pw-items-end">
        <div
          className={cx(
            'pw-px-3 pw-py-2 pw-text-white pw-h-18 pw-cursor-pointer',
            StockTakingAnalyticStatusOption[StockTakingAnalyticStatus.PROCESSING].bgColor,
            {
              'pw-border-black pw-border-opacity-50 pw-border-b-8 pw-h-20':
                value === StockTakingAnalyticStatus.PROCESSING,
            },
          )}
          onClick={() => handleChange(StockTakingAnalyticStatus.PROCESSING)}
        >
          <h4 className="pw-font-bold pw-text-2xl">{data?.meta?.processing_count || 0}</h4>
          <div className="pw-text-base">
            {t(StockTakingAnalyticStatusOption[StockTakingAnalyticStatus.PROCESSING].title)}
          </div>
        </div>
        <div
          className={cx(
            'pw-px-3 pw-py-2 pw-text-white pw-h-18 pw-cursor-pointer',
            StockTakingAnalyticStatusOption[StockTakingAnalyticStatus.COMPLETED].bgColor,
            {
              'pw-border-black pw-border-opacity-50 pw-border-b-8 pw-h-20':
                value === StockTakingAnalyticStatus.COMPLETED,
            },
          )}
          onClick={() => handleChange(StockTakingAnalyticStatus.COMPLETED)}
        >
          <h4 className="pw-font-bold pw-text-2xl">{data?.meta?.completed_count || 0}</h4>
          <div className="pw-text-base">
            {t(StockTakingAnalyticStatusOption[StockTakingAnalyticStatus.COMPLETED].title)}
          </div>
        </div>
        <div
          className={cx(
            'pw-px-3 pw-py-2 pw-text-white pw-h-18 pw-cursor-pointer',
            StockTakingAnalyticStatusOption[StockTakingAnalyticStatus.CANCELLED].bgColor,
            {
              'pw-border-black pw-border-opacity-50 pw-border-b-8 pw-h-20':
                value === StockTakingAnalyticStatus.CANCELLED,
            },
          )}
          onClick={() => handleChange(StockTakingAnalyticStatus.CANCELLED)}
        >
          <h4 className="pw-font-bold pw-text-2xl">{data?.meta?.canceled_count || 0}</h4>
          <div className="pw-text-base">
            {t(StockTakingAnalyticStatusOption[StockTakingAnalyticStatus.CANCELLED].title)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockTakingAnalytics;
