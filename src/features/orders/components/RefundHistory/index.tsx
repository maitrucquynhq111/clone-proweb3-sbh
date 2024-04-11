import cx from 'classnames';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Tag } from 'rsuite';
import HistoryTable from '../PaymentHistory/HistoryTable';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { formatCurrency } from '~app/utils/helpers';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { OrderHasRefundStateType } from '~app/utils/constants';
import { queryClient } from '~app/configs/client';
import { CONTACT_DETAIL, ORDERS_ANALYTICS_KEY, ORDERS_KEY, ORDER_DETAIL_KEY } from '~app/services/queries';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  order?: Order;
  orderId?: string;
  amount?: number;
  isDebit?: boolean;
  onSuccess?(): void;
};

const RefundHistory = () => {
  const { t } = useTranslation('orders-form');
  const [orderId] = useSelectedOrderStore((store) => store.id);
  const [buyerPay] = useSelectedOrderStore((store) => store.debit.buyer_pay);
  const [refundState] = useSelectedOrderStore((store) => store.order_has_refund_state);
  const [grandTotal] = useSelectedOrderStore((store) => store.grand_total);
  const [totalDebtAndCash] = useSelectedOrderStore((store) => store.total_debt_and_cash);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const needToRefund = useMemo(() => grandTotal - buyerPay, [buyerPay, grandTotal]);

  const isDebit = useMemo(() => {
    if (!totalDebtAndCash) return false;
    if (Math.abs(totalDebtAndCash.total_debt_amount)) return true;
    return false;
  }, [totalDebtAndCash]);

  const handleClick = () => {
    const modalData: ModalData = {
      modal: ModalTypes.ConfirmRefunding,
      size: ModalSize.Xsmall,
      placement: ModalPlacement.Right,
      orderId: orderId,
      isDebit: isDebit,
      amount: isDebit ? Math.abs(totalDebtAndCash?.total_debt_amount || 0) : needToRefund,
      onSuccess: () => {
        queryClient.invalidateQueries([ORDERS_KEY], { exact: false });
        queryClient.invalidateQueries([ORDERS_ANALYTICS_KEY], { exact: false });
        queryClient.invalidateQueries([ORDER_DETAIL_KEY], { exact: false });
        queryClient.invalidateQueries([CONTACT_DETAIL], { exact: false });
        return setModalData(null);
      },
    };
    setModalData(modalData);
  };

  return (
    <>
      <div>
        <Tag
          className={cx('!pw-text-white !pw-font-semibold pw-rounded-md pw-mb-2', {
            '!pw-bg-success-active': needToRefund === 0,
            '!pw-bg-warning-active': needToRefund !== 0 && buyerPay > 0,
            '!pw-bg-error-active': needToRefund !== 0 && buyerPay === 0,
          })}
        >
          {needToRefund === 0 ? t('refunded') : null}
          {needToRefund !== 0 && buyerPay > 0 ? t('partial_refund') : null}
          {needToRefund !== 0 && buyerPay === 0 ? t('no_refund_yet') : null}
        </Tag>
        {isDebit ? (
          <div className="pw-flex pw-items-center pw-justify-between">
            <h3 className="pw-text-secondary-main">
              {formatCurrency(Math.abs(totalDebtAndCash?.total_debt_amount || 0))}₫
            </h3>
            <Button
              appearance="primary"
              className="!pw-text-base !pw-font-bold !pw-py-3 !pw-px-4"
              onClick={handleClick}
            >
              {t('pay_debt')}
            </Button>
          </div>
        ) : needToRefund > 0 ? (
          <div className="pw-flex pw-items-center pw-justify-between">
            <h3 className="pw-text-secondary-main">{formatCurrency(needToRefund)}₫</h3>
            {refundState === OrderHasRefundStateType.NO_REFUND_YET ? (
              <Button
                appearance="primary"
                className="!pw-text-base !pw-font-bold !pw-py-3 !pw-px-4"
                onClick={handleClick}
              >
                {t('action.refund')}
              </Button>
            ) : null}
          </div>
        ) : null}
        <HistoryTable />
      </div>
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </>
  );
};

export default memo(RefundHistory);
