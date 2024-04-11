import cx from 'classnames';
import { Modal, Button } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { UpgradePackage } from '~app/components/Icons';
import { MainRouteKeys } from '~app/routes/enums';
import { CHAT_SUPPORT } from '~app/configs';

type Props = {
  description: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  backdropClassName?: string;
  className?: string;
  size?: ExpectedAny;
  onConfirm: () => void;
  onClose: () => void;
};

const UpgradePackageModal = ({
  description,
  confirmText,
  cancelText,
  backdropClassName,
  className,
  size,
  onConfirm,
  onClose,
}: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const handleConfirm = () => {
    navigate(MainRouteKeys.ChatInboxDetails.replace(':pageId', CHAT_SUPPORT), {
      replace: true,
      state: { contentAutoSend: t('want_upgrade') },
    });
    onConfirm();
  };

  return (
    <Modal
      backdrop={true}
      keyboard={false}
      open={true}
      size={size || 'xs'}
      className={cx('!pw-flex pw-items-center pw-justify-center center-modal', className)}
      backdropClassName={backdropClassName}
    >
      <Modal.Header className="!pw-pr-0">
        <div className="pw-flex pw-justify-center pw-mb-6">
          <UpgradePackage />
        </div>
        <Modal.Title className="!pw-font-bold !pw-text-lg">{t('feature_for_you')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="!pw-my-6 !pw-pb-0 !pw-overflow-hidden pw-text-center">{description}</Modal.Body>
      <Modal.Footer>
        <Button className="pw-button-secondary !pw-py-2 !pw-px-4" onClick={onClose}>
          <span className="pw-text-base pw-font-bold pw-text-neutral-primary">{cancelText || t('back')}</span>
        </Button>
        <Button onClick={handleConfirm} className="pw-button-primary !pw-py-2 !pw-px-4">
          <span className="pw-text-base pw-font-bold pw-text-neutral-white">{confirmText || t('upgrade')}</span>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpgradePackageModal;
