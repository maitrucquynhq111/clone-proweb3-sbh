import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { BsPencilSquare } from 'react-icons/bs';
import { Tooltip, Whisper } from 'rsuite';

type Props = {
  rowData: ExpectedAny;
  rowIndex: ExpectedAny;
  onClick(index: number): void;
};

const OpenDetailDrawerButton = ({ rowData, rowIndex, onClick }: Props) => {
  const { t } = useTranslation('products-form');
  return (
    <Whisper placement="top" trigger="hover" speaker={<Tooltip>{t('product_detail')}</Tooltip>}>
      <button
        type="button"
        className={cx('pw-text-blue-600', {
          ['pw-opacity-50']: rowData?.hide_sku === true,
        })}
        onClick={() => {
          if (rowData?.hide_sku === true) return;
          onClick(rowIndex);
        }}
      >
        <BsPencilSquare className="pw-w-6 pw-h-6" />
      </button>
    </Whisper>
  );
};

export default OpenDetailDrawerButton;
