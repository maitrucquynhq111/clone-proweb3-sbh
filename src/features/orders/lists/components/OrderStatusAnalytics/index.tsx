import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import AnimatedNumber from 'animated-number-react';
import { OrderStatus, OrderStatusType } from '~app/utils/constants';
import { useOrdersAnalyticsQuery } from '~app/services/queries';

type Props = {
  value: string;
  initValues: ExpectedAny;
  onChange: (value: string) => void;
};

const OrderStatusAnalytics = ({ value, onChange, initValues }: Props) => {
  const { t } = useTranslation('common');
  const { data } = useOrdersAnalyticsQuery(initValues);

  const renderCountOrder = (status: string) => {
    switch (status) {
      case OrderStatusType.WAITING_CONFIRM:
        return data?.count_waiting_confirm || 0;
      case OrderStatusType.DELIVERING:
        return data?.count_delivering || 0;
      case OrderStatusType.REFUND:
        return data?.count_refund || 0;
      case OrderStatusType.CANCEL:
        return data?.count_cancel || 0;
      default:
        return data?.count_complete || 0;
    }
  };

  return (
    <div className="pw-pb-4 pw-bg-white">
      <div className="pw-grid pw-grid-cols-5 pw-space-x-1 pw-items-end">
        {Object.values(OrderStatusType)
          .filter((item) => item !== OrderStatusType.RETURN)
          .map((status: OrderStatusType) => {
            return (
              <div
                className={cn('pw-px-3 pw-text-white pw-p-2 pw-h-18 pw-cursor-pointer', OrderStatus[status].bgColor, {
                  'pw-border-black pw-border-opacity-20 pw-border-b-8 pw-h-20': value === OrderStatus[status].name,
                })}
                key={status}
                onClick={() => onChange(value === OrderStatus[status].name ? '' : OrderStatus[status].name)}
              >
                <div>
                  <span className="pw-text-2xl pw-font-bold">
                    <AnimatedNumber
                      duration={300}
                      value={renderCountOrder(OrderStatus[status].name) || 0}
                      formatValue={(value: number) => {
                        return value.toFixed(0).toString();
                      }}
                    />
                  </span>
                  <span className="pw-text-sm pw-ml-3">{t('pos:order')}</span>
                </div>
                <div className="pw-text-base">{t(`order-status.${OrderStatus[status].name}`)}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default OrderStatusAnalytics;
