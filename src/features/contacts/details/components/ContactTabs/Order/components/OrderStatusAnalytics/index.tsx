import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import AnimatedNumber from 'animated-number-react';
import { formatCurrency } from '~app/utils/helpers';
import { OrderStatusType, OrderStatus } from '~app/utils/constants';

type Props = {
  value: string;
  dataMeta?: ResponseMeta & {
    cancel_count?: number;
    complete_count?: number;
    count_complete?: number;
    delivering_count?: number;
    refund_count?: number;
    return_count?: number;
    sum_grand_total_complete?: string;
    waiting_confirm_count?: number;
  };
  onChange: (value: string) => void;
};

const OrderStatusAnalytics = ({ value, onChange, dataMeta }: Props) => {
  const { t } = useTranslation('common');

  const renderCountOrder = (status: string) => {
    switch (status) {
      case OrderStatusType.REFUND:
        return dataMeta?.refund_count || 0;
      case OrderStatusType.CANCEL:
        return dataMeta?.cancel_count || 0;
      default:
        return dataMeta?.count_complete || 0;
    }
  };

  return (
    <div className="pw-py-4 pw-bg-white">
      <div className="pw-grid pw-grid-cols-4 pw-space-x-1 pw-items-end">
        <div className="pw-px-4 pw-text-white pw-p-2 pw-h-18 pw-cursor-pointer !pw-bg-amber-600">
          <div>
            <span className="pw-text-sm">đ</span>
            <span className="pw-text-2xl pw-font-bold">
              <AnimatedNumber
                duration={300}
                value={dataMeta?.sum_grand_total_complete || 0}
                formatValue={(value: number) => {
                  return formatCurrency(value);
                }}
              />
            </span>
          </div>
          <div className="pw-text-base">Doanh thu</div>
        </div>
        {Object.values(OrderStatusType)
          .filter(
            (item) =>
              item !== OrderStatusType.RETURN &&
              item !== OrderStatusType.WAITING_CONFIRM &&
              item !== OrderStatusType.DELIVERING,
          )
          .map((status: OrderStatusType) => {
            return (
              <div
                className={cn('pw-px-4 pw-text-white pw-p-2 pw-h-18 pw-cursor-pointer', OrderStatus[status].bgColor, {
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
                  </span>{' '}
                  <span className="pw-text-sm">{t('pos:order')}</span>
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
