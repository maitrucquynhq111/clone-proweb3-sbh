import { HeaderAction, PrintSize, ListSkuSelected, DropdownSearch } from './components';
import { SelectedSkuProvider } from '~app/features/print-barcode/hook';

const PrintBarcode = (): JSX.Element => {
  return (
    <div className="pw-mt-4">
      <SelectedSkuProvider>
        <PrintSize />
        <HeaderAction />
        <DropdownSearch />
        <ListSkuSelected />
      </SelectedSkuProvider>
    </div>
  );
};
export default PrintBarcode;
