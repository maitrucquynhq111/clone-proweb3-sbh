import cx from 'classnames';
import { Modal, Button } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';

type Props = {
  open: boolean;
  title: string;
  description: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDelete?: boolean;
  iconTitle?: JSX.Element;
  backdropClassName?: string;
  className?: string;
  size?: ExpectedAny;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
};

const ConfirmModal = ({
  open,
  title,
  description,
  confirmText,
  cancelText,
  backdropClassName,
  className,
  isDelete = false,
  iconTitle,
  size,
  onConfirm,
  onClose,
  isLoading,
}: Props) => {
  const { t } = useTranslation('common');

  return (
    <Modal
      backdrop={true}
      keyboard={false}
      open={open}
      size={size || 'xs'}
      onClose={onClose}
      className={cx('!pw-flex pw-items-center pw-justify-center center-modal', className)}
      backdropClassName={backdropClassName}
    >
      <Modal.Header className="pw-flex pw-items-center">
        {iconTitle && <div className="pw-mr-4">{iconTitle}</div>}
        <Modal.Title className="!pw-font-bold !pw-text-lg">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{description}</Modal.Body>
      <Modal.Footer>
        {isDelete ? (
          <>
            <Button
              appearance="primary"
              color="red"
              className="!pw-text-base !pw-font-bold !pw-py-2 !pw-px-4 !pw-rounded"
              onClick={onConfirm}
            >
              {confirmText || t('delete')}
            </Button>
            <Button className="pw-button-secondary !pw-py-2 !pw-px-4" onClick={onClose}>
              <span className="pw-text-base pw-font-bold pw-text-neutral-primary">{cancelText || t('cancel')}</span>
            </Button>
          </>
        ) : (
          <>
            <Button className="pw-button-secondary !pw-py-2 !pw-px-4" onClick={onClose} disabled={isLoading}>
              <span className="pw-text-base pw-font-bold pw-text-neutral-primary">{cancelText || t('back')}</span>
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              loading={isLoading}
              className="pw-button-primary !pw-py-2 !pw-px-4"
            >
              <span className="pw-text-base pw-font-bold pw-text-neutral-white">
                {confirmText || t('modal-confirm')}
              </span>
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
