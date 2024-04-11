import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Steps } from 'rsuite';
import { format } from 'date-fns';
import { OrderStatus, OrderStatusType } from '~app/utils/constants';
import { useOrderTrackingQuery } from '~app/services/queries';
import { useSelectedOrderStore } from '~app/features/pos/hooks';

const OrderTracking = () => {
  const { t } = useTranslation('common');
  const [id] = useSelectedOrderStore((store) => store.id);
  const { data } = useOrderTrackingQuery(id || '');

  const renderCurrentStep = () => {
    if (data.length === 3) return 3;
    const isComplete = data.some((tracking) => tracking.state === OrderStatusType.COMPLETE);
    return isComplete ? 3 : data.length;
  };

  const renderDescription = (status: OrderStatusType) => {
    if (data.length === 0) return <div className="pw-h-4" />;
    const existed = data.find((tracking) => tracking.state === status);
    if (!existed) return <div className="pw-h-4" />;
    return (
      <div className="pw-text-xs pw-font-semibold pw-text-neutral-placeholder">
        {format(new Date(existed.updated_at), 'dd/MM/yyyy HH:mm')}
      </div>
    );
  };

  return (
    <Steps current={renderCurrentStep()} vertical>
      {Object.values(OrderStatusType)
        .slice(0, 3)
        .map((status: OrderStatusType) => (
          <Steps.Item
            key={status}
            className="!pw-pb-4"
            title={
              <div className="pw-text-base pw-font-bold pw-text-neutral-primary">
                {t(`order-tracking.${OrderStatus[status].name}`)}
              </div>
            }
            description={renderDescription(status)}
          />
        ))}
    </Steps>
  );
};

export default memo(OrderTracking);
