import render from '@finan/fe-reports';
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { RETAILCUSTOMER } from '~app/configs';

function usePrinter({
  ordersPrint,
  configs,
  paymentsInfo,
  businessInfo,
}: {
  ordersPrint: OrderPrinter[] | Order[];
  configs: ConfigInvoice | null;
  paymentsInfo?: PaymentInfo[] | null;
  businessInfo: Business;
}) {
  const [debtAmount, setDebtAmount] = useState<Array<{ id: string; amount: number }>>([]);

  let reports = '';
  if (ordersPrint && Array.isArray(ordersPrint) && ordersPrint.length > 0) {
    ordersPrint.map((orderItem, index) => {
      const debt = debtAmount?.find((item) => item.id === (orderItem.id || ''));
      const order = {
        ...orderItem,
        debt_amount:
          orderItem?.buyer_info.name !== RETAILCUSTOMER.name && orderItem.grand_total > orderItem.amount_paid
            ? orderItem.grand_total - orderItem.amount_paid || 0
            : 0,
        total_debt_amount:
          debt && orderItem?.buyer_info.name !== RETAILCUSTOMER.name ? debt.amount - (orderItem?.debt_amount || 0) : 0,
      };
      const dataBill = {
        business: businessInfo,
        order,
        configs: configs || null,
        paymentInfo: paymentsInfo || [],
      };

      if (orderItem.order_item && orderItem.order_item.length > 0) {
        if (index === 0) {
          reports = render('Bill', dataBill);
        } else {
          reports = reports.concat('<br><br><br>', render('Bill', dataBill));
        }
      }
    });
  }

  const componentPrintRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentPrintRef.current,
  });

  const showDataPrint = () => (
    <div style={{ display: 'none', width: '100%' }}>
      <div ref={componentPrintRef} dangerouslySetInnerHTML={{ __html: reports }}></div>
    </div>
  );

  return { handlePrint, showDataPrint, setDebtAmount, debtAmount };
}

export { usePrinter };
