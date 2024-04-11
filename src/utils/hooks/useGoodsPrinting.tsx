import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { GoodsTicket } from '~app/features/inventoryImportBook/details/components';

function useGoodsPrinting({ inventoryDetail }: { inventoryDetail?: InventoryDetail }) {
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
      <GoodsTicket inventoryDetail={inventoryDetail} />
    </div>
  );

  return { handlePrint, showDataPrint };
}

export { useGoodsPrinting };
