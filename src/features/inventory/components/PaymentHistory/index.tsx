import { memo, useMemo, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Tag } from 'rsuite';
import { StaticTable } from '~app/components';
import { paymentHistoryColumnsConfig } from '~app/features/orders/details/config';
import { formatCurrency } from '~app/utils/helpers';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { PaymentStateInventory } from '~app/features/warehouse/utils';
import { InventoryPermission, ProductPermission, useHasPermissions } from '~app/utils/shield';

type Props = {
  inventoryDetail: InventoryDetail | null;
};

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  detail: InventoryDetail;
  debtAmount: number;
  onSuccess?(): void;
};

const PaymentHistory = ({ inventoryDetail }: Props) => {
  const { t } = useTranslation('orders-form');
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const canPayment = useHasPermissions([InventoryPermission.INVENTORY_PURCHASEORDER_PAYMENT_VIEW]);
  const canUpdateHistoricalCost = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);
  const hasHistory = useMemo(
    () => inventoryDetail?.payment_purchase_order && inventoryDetail.payment_purchase_order.length > 0,
    [inventoryDetail?.payment_purchase_order],
  );

  const debtAmount = useMemo(() => {
    if (!inventoryDetail) return 0;
    if (inventoryDetail.payment_purchase_order?.length > 0) {
      return (
        inventoryDetail.total_amount -
        inventoryDetail.payment_purchase_order.reduce((acc, curr) => acc + curr.amount, 0)
      );
    }
    if (inventoryDetail.payment_state === PaymentStateInventory.UNPAID) return inventoryDetail.total_amount;
    return 0;
  }, [inventoryDetail]);

  const handleClick = () => {
    if (!inventoryDetail) return;
    setModalData({
      modal: ModalTypes.DebitPaymentPurchaseOrder,
      size: ModalSize.Xsmall,
      placement: ModalPlacement.Right,
      detail: inventoryDetail,
      debtAmount,
    });
  };

  return (
    <>
      {inventoryDetail?.is_debit && (
        <Tag color="orange" className="pw-mb-2 pw-font-semibold !pw-bg-gold">
          {t('purchase-order:debitited')}
        </Tag>
      )}
      {canUpdateHistoricalCost &&
        inventoryDetail?.payment_state !== PaymentStateInventory.PAID &&
        inventoryDetail?.payment_state !== PaymentStateInventory.EMPTY && (
          <div
            className={cx('pw-flex pw-items-center pw-justify-between', {
              'pw-mb-4': hasHistory,
            })}
          >
            <h3 className="pw-text-secondary-main pw-text-3.5xl">{formatCurrency(debtAmount)}₫</h3>
            {canPayment && (
              <Button appearance="primary" className="!pw-font-bold" onClick={handleClick}>
                {t('common:payment')}
              </Button>
            )}
          </div>
        )}
      {hasHistory && (
        <StaticTable
          columnConfig={paymentHistoryColumnsConfig({ t, canViewPrice: canUpdateHistoricalCost })}
          data={
            (inventoryDetail?.payment_purchase_order || []).map((payment) => ({
              ...payment,
              name: payment.payment_source_name,
            })) || []
          }
          rowKey="id"
        />
      )}
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </>
  );
};

export default memo(PaymentHistory);
