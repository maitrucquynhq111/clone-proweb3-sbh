import { lazy, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const StockTakingReceipt = lazy(() => import('../../components/PrintingReceipt/StockTakingReceipt'));

type Params = {
  inventoryDetail?: InventoryDetail;
  data: PendingStockTaking;
};

const useStockTakeReceiptPrinting = ({ data, inventoryDetail }: Params) => {
  const componentPrintRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentPrintRef.current,
  });

  const showDataPrint = () => (
    <div style={{ display: 'none', width: '100%' }}>
      <div ref={componentPrintRef}>
        {inventoryDetail ? <StockTakingReceipt data={data} inventoryDetail={inventoryDetail} /> : null}
      </div>
    </div>
  );

  return { handlePrint, showDataPrint };
};

export default useStockTakeReceiptPrinting;
