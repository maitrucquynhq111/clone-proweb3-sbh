import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPrinterFill } from 'react-icons/bs';
import { useStockTakeReceiptPrinting } from '~app/utils/hooks';

type Props = { inventoryDetail?: InventoryDetail; data: PendingStockTaking };

const PrintingButton = ({ inventoryDetail, data }: Props) => {
  const { t } = useTranslation('stocktaking-form');

  const { handlePrint, showDataPrint } = useStockTakeReceiptPrinting({
    inventoryDetail,
    data,
  });

  return (
    <>
      <button
        className="pw-flex pw-font-bold pw-text-neutral-primary pw-text-sm pw-py-1.5 pw-px-4 pw-rounded 
          pw-bg-neutral-white pw-border pw-border-solid pw-border-neutral-border pw-gap-x-2 pw-items-center"
        onClick={handlePrint}
      >
        <BsPrinterFill />
        {t('action.print_receipt')}
      </button>
      {showDataPrint()}
    </>
  );
};

export default memo(PrintingButton);
