import { useTranslation } from 'react-i18next';
import { Modal } from 'rsuite';
import { CommingSoon } from '~app/components/Icons';

type Props = {
  open: boolean;
  onClose(): void;
};

const CommingSoonModal = ({ open, onClose }: Props) => {
  const { t } = useTranslation('common');
  return (
    <Modal
      open={open}
      keyboard={true}
      className="!pw-flex !pw-absolute !-pw-translate-x-1/2 !-pw-translate-y-1/2 pw-top-1/2 pw-left-1/2
        pw-items-center pw-justify-center !pw-my-0 center-modal"
      backdropClassName="!pw-z-[1050]"
    >
      <div className="pw-bg-neutral-white">
        <div className="pw-flex pw-gap-x-4 pw-items-center pw-justify-center">
          <CommingSoon />
        </div>
        <div className="pw-text-neutral-title pw-font-bold pw-text-lg pw-mb-6 pw-flex pw-justify-center">
          {t('feature_comming_soon')}
        </div>
        <div className="pw-text-base pw-text-neutral-primary pw-text-center">
          <div>{t('feature_comming_soon_description1')}</div>
          <div>{t('feature_comming_soon_description2')}</div>
        </div>
        <div className="pw-flex pw-gap-x-3 pw-mt-6 pw-justify-end">
          <button
            className="pw-rounded pw-bg-primary-main pw-text-neutral-white pw-font-bold pw-text-base pw-py-3 pw-px-4"
            onClick={onClose}
          >
            {t('understood')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CommingSoonModal;
