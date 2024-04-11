import { useTranslation } from 'react-i18next';
import { BsTrash } from 'react-icons/bs';
import { Modal } from 'rsuite';

type Props = {
  open: boolean;
  setOpen(value: boolean): void;
  onClick(): void;
};

const RefuseOrderModal = ({ open, setOpen, onClick }: Props) => {
  const { t } = useTranslation('orders-form');
  return (
    <Modal
      open={open}
      keyboard={true}
      className="!pw-flex !pw-absolute !-pw-translate-x-1/2 !-pw-translate-y-1/2 pw-top-1/2 pw-left-1/2
        pw-items-center pw-justify-center !pw-my-0 center-modal"
      backdropClassName="!pw-z-[1050]"
    >
      <div className="pw-p-1 pw-bg-neutral-white">
        <div className="pw-flex pw-gap-x-4 pw-mb-6 pw-items-center">
          <BsTrash size={24} />
          <h4 className="pw-font-bold pw-text-lg pw-text-neutral-title">{t('refuse_order_title')}?</h4>
        </div>
        <div className="pw-text-base pw-text-neutral-secondary">{t('refuse_order_desc')}</div>
        <div className="pw-flex pw-gap-x-3 pw-mt-6 pw-justify-end">
          <button
            className="pw-rounded pw-bg-error-active pw-text-neutral-white pw-font-bold pw-text-base pw-py-3 pw-px-4"
            onClick={onClick}
          >
            {t('action.confirm')}
          </button>
          <button
            className="pw-rounded pw-bg-neutral-white pw-border pw-border-solid pw-py-3 pw-px-4
            pw-border-neutral-border pw-text-base pw-text-neutral-primary pw-font-bold"
            onClick={() => setOpen(false)}
          >
            {t('action.back')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RefuseOrderModal;
