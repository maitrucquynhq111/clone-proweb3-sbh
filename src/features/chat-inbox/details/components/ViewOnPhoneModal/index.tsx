import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'rsuite';

type Props = {
  visible: boolean;
  onClose(): void;
};

const ViewOnPhoneModal = ({ visible, onClose }: Props) => {
  const { t } = useTranslation('chat');
  return (
    <Modal
      open={visible}
      onClose={onClose}
      className="!pw-flex !pw-absolute !-pw-translate-x-1/2 xl:-pw-translate-y-1/2 xl:pw-top-1/2 pw-left-1/2 pw-items-center pw-justify-center xl:!pw-my-0 center-modal"
    >
      <h3 className="pw-text-lg pw-text-neutral-title pw-font-bold pw-mb-6">{t('view_on_phone_title')}</h3>
      <p className="pw-text-base pw-text-neutral-secondary">{t('view_on_phone_content')}</p>
      <div className="pw-flex pw-justify-end pw-items-center pw-gap-x-3 pw-mt-4">
        <Button appearance="primary" onClick={onClose}>
          {t('action.understood')}
        </Button>
      </div>
    </Modal>
  );
};

export default ViewOnPhoneModal;
