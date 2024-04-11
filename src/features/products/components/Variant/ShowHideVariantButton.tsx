import { useTranslation } from 'react-i18next';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { Tooltip, Whisper } from 'rsuite';

type Props = {
  rowData: ExpectedAny;
  rowIndex: ExpectedAny;
  onClick(index: number, value: boolean): void;
};

const ShowHideVariantButton = ({ rowData, rowIndex, onClick }: Props) => {
  const { t } = useTranslation('products-form');
  return (
    <>
      {rowData?.hide_sku === false ? (
        <Whisper placement="top" trigger="hover" speaker={<Tooltip>{t('existed_variant')}</Tooltip>}>
          <button type="button" onClick={() => onClick(rowIndex, true)}>
            <BsEye className="pw-w-6 pw-h-6" />
          </button>
        </Whisper>
      ) : (
        <Whisper placement="top" trigger="hover" speaker={<Tooltip>{t('not_existed_variant')}</Tooltip>}>
          <button type="button" onClick={() => onClick(rowIndex, false)}>
            <BsEyeSlash className="pw-w-6 pw-h-6" />
          </button>
        </Whisper>
      )}
    </>
  );
};

export default ShowHideVariantButton;
