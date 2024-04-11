import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Divider, Tag } from 'rsuite';
import { PaymentStateInventory } from '~app/features/warehouse/utils';

type Props = {
  paymentState: string;
  staffInfo: InventoryStaffInfo | null;
};

const Title = ({ paymentState, staffInfo }: Props) => {
  const { t } = useTranslation('purchase-order');

  const getPaymentName = () => {
    switch (paymentState) {
      case '':
      case PaymentStateInventory.PAID:
        return t('common:payment_state.paid');
      case PaymentStateInventory.IN_DEBIT:
      case PaymentStateInventory.UNPAID:
        return t('common:payment_state.un_paid');
      case PaymentStateInventory.PARTIAL_PAID:
        return t('common:payment_state.partial_paid');
      default:
        break;
    }
  };

  return (
    <div className="pw-flex pw-items-center">
      <Tag
        className={cx('pw-font-semibold', {
          '!pw-text-success-active !pw-bg-success-background':
            paymentState === PaymentStateInventory.PAID || paymentState === '',
          '!pw-text-error-active !pw-bg-error-background':
            paymentState === PaymentStateInventory.UNPAID || paymentState === PaymentStateInventory.IN_DEBIT,
          '!pw-text-warning-active !pw-bg-warning-background': paymentState === PaymentStateInventory.PARTIAL_PAID,
        })}
      >
        {getPaymentName()}
      </Tag>
      <Divider vertical className="!pw-w-0.5" />
      <div>
        <span className="pw-text-sm pw-mr-0.5">{t('created_by')}:</span>
        <span className="pw-text-sm pw-font-semibold">{staffInfo?.staff_name || staffInfo?.phone_number}</span>
      </div>
    </div>
  );
};

export default Title;
