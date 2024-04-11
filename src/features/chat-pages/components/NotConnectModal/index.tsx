import { Button, Modal } from 'rsuite';
import { useTranslation } from 'react-i18next';

type Props = {
  open: boolean;
  onClose: () => void;
};

const NotConnectModal = ({ open, onClose }: Props) => {
  const { t } = useTranslation('chat');

  return (
    <Modal open={open} onClose={onClose} className="!pw-w-106">
      <Modal.Header closeButton={false} className="!pw-pr-0 !-pw-m-5 !pw-mb-0">
        <img
          src="https://d3hr4eej8cfgwy.cloudfront.net/finan-prd/20962f85-88f9-49d9-938b-964e83ba11c3/image/ca62adf3-7d65-4fca-b46e-43c0f8f72d37.png"
          alt="Header image"
          className="pw-rounded-tl-md pw-rounded-tr-md"
        />
      </Modal.Header>
      <Modal.Body className="pw-p-1">
        <h6 className="pw-mb-6">{t('common:note')}</h6>
        <div className="pw-text-base">{t('not_connect_page_description')}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" className="!pw-font-bold !pw-text-base" onClick={onClose}>
          {t('common:i_understood')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotConnectModal;
