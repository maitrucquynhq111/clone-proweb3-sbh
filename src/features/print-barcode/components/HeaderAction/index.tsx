import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from 'rsuite';
import { GUIDE_PRINT_BARCODE } from '~app/utils/constants';
import { useSelectedSku } from '~app/features/print-barcode/hook';
import { useBarcodePrinting } from '~app/utils/hooks';

const HeaderAction = () => {
  const { t } = useTranslation('barcode');
  const [store] = useSelectedSku((store: ExpectedAny) => store);
  const { handlePrint, showDataPrint } = useBarcodePrinting({
    setting: store.settings,
    selectedSkus: store.selected_list,
  });

  const handleSubmit = (type: string) => {
    if (store.selected_list.length === 0) {
      toast.warning(t('warning.please_choose_product_print'));
      return;
    }
    if (!store.settings.pageSize || !store.settings.size) {
      toast.warning(t('warning.please_choose_size_print'));
      return;
    }
    handlePrint(type);
  };

  return (
    <div className="pw-flex pw-flex-col">
      <div className="pw-flex pw-justify-end pw-my-6">
        <Button
          as="a"
          target="_blank"
          href={GUIDE_PRINT_BARCODE}
          appearance="link"
          className="hover:!pw-no-underline focus:!pw-no-underline"
        >
          <span className="pw-text-secondary-main-blue pw-text-base pw-font-normal">{t('printer_setting_guide')}</span>
        </Button>
        <Button onClick={() => handleSubmit('export_pdf')} appearance="primary" type="submit">
          <strong className="pw-text-base">{`${t('export_pdf')}`}</strong>
        </Button>
      </div>
      <div className="pw-hidden">{showDataPrint()}</div>
    </div>
  );
};

export default HeaderAction;
