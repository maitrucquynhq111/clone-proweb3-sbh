import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPrinterFill } from 'react-icons/bs';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { createOrderPrinter } from '~app/features/pos/utils';
import { AuthService } from '~app/services/api';
import { usePrinter } from '~app/utils/hooks';

type Props = {
  invoiceSettings: ExpectedAny;
  dataUser: ExpectedAny;
  paymentsInfo: ExpectedAny;
};

const PrintOrderButton = ({ invoiceSettings, dataUser, paymentsInfo }: Props) => {
  const { t } = useTranslation('orders-form');
  const [selectedOrder] = useSelectedOrderStore((store) => store);
  const [buyerInfo] = useSelectedOrderStore((store) => store.buyer_info);

  const orderPrinter = useMemo(() => {
    return createOrderPrinter({
      businessId: AuthService.getBusinessId() || '',
      order: selectedOrder || {},
      promotionDiscount: selectedOrder.promotion_discount,
      otherDiscount: selectedOrder.other_discount,
      customerPoint: selectedOrder.customer_point_discount,
      deliveryFee: selectedOrder.delivery_fee,
      customerPointDiscount: selectedOrder.is_customer_point ? selectedOrder.customer_point_discount : 0,
      validPromotion: true,
    });
  }, [selectedOrder]);

  const {
    setDebtAmount,
    showDataPrint: PrintData,
    handlePrint,
  } = usePrinter({
    ordersPrint: [orderPrinter],
    configs: invoiceSettings,
    paymentsInfo,
    businessInfo: dataUser?.business_info.current_business,
  });

  useEffect(() => {
    if (buyerInfo.name) {
      setDebtAmount([
        {
          id: '',
          amount: buyerInfo.debt_amount || 0,
        },
      ]);
    }
  }, [buyerInfo]);

  return (
    <>
      <button
        className="pw-flex pw-font-bold pw-text-neutral-primary pw-text-sm pw-py-1.5 pw-px-4 pw-rounded
    pw-bg-neutral-white pw-border pw-border-solid pw-border-neutral-border pw-gap-x-2 pw-items-center"
        onClick={handlePrint}
      >
        <BsPrinterFill />
        {t('action.print_order')}
      </button>
      <PrintData />
    </>
  );
};

export default PrintOrderButton;
