import createFastContext from '~app/utils/hooks/createFastContext';
import { configPrintData } from '~app/features/print-barcode/components/PrintSize/config';

export const { Provider: SelectedSkuProvider, useStore: useSelectedSku } = createFastContext<{
  selected_list: Array<SkuSelected>;
  settings: BarcodePrintingSetting;
}>({
  selected_list: [],
  settings: { pageSize: '', size: '', options: configPrintData },
});
