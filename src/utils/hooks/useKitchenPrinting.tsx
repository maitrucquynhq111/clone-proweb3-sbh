import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import KitchenTicket from '~app/features/table/components/KitchenTicket';

function useKitchenPrinting({
  orderInfo,
  note,
  reservationInfo,
}: {
  orderInfo?: KitchenTicketItem | PendingOrderForm;
  note?: string;
  reservationInfo?: ReservationMeta | null;
}) {
  const componentPrintRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentPrintRef.current,
  });

  const showDataPrint = () => (
    <div
      ref={componentPrintRef}
      style={{
        width: '100%',
      }}
    >
      <KitchenTicket orderInfo={orderInfo} note={note} reservationInfo={reservationInfo} />
    </div>
  );

  return { handlePrint, showDataPrint };
}

export { useKitchenPrinting };
