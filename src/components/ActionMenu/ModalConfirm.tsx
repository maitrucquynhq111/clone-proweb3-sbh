import { useImperativeHandle, forwardRef, useState, Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'rsuite';
import { ModalRefObject, MenuItemProps } from './types';

type ModalConfirmProps = {
  backdrop?: boolean | 'static';
  backdropClassName?: string;
  className?: string;
};

const ModalConfirm = (props: ModalConfirmProps, ref: Ref<ModalRefObject>) => {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<MenuItemProps | null>(null);

  const handleOpen = (data: MenuItemProps) => {
    setData(data);
    setOpen(true);
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setLoading(false);
    setData(null);
  };
  const handleAction = async () => {
    setLoading(true);
    try {
      await data?.action?.();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    handleClose();
  };

  useImperativeHandle(
    ref,
    () => ({
      handleOpen,
      handleClose,
    }),
    [handleOpen, handleClose],
  );

  const { modalTitle, modalContent, acceptText, cancelText } = data || {};

  return (
    (data && (
      <Modal
        backdrop={props?.backdrop || 'static'}
        backdropClassName={props?.backdropClassName || ''}
        className={props.className}
        keyboard={false}
        open={open}
        onClose={handleClose}
      >
        <Modal.Header>
          <div className="pw-text-2xl pw-font-bold">{modalTitle || t('modal-confirm-title')}</div>
        </Modal.Header>

        <Modal.Body>{modalContent || t('modal-confirm-content')}</Modal.Body>
        <Modal.Footer>
          <Button loading={loading} disabled={loading} onClick={handleAction} appearance="primary" color="red">
            {acceptText || t('modal-confirm-accept-btn')}
          </Button>
          <Button disabled={loading} onClick={handleClose} appearance="subtle">
            {cancelText || t('modal-confirm-cancel-btn')}
          </Button>
        </Modal.Footer>
      </Modal>
    )) || <></>
  );
};

export default forwardRef(ModalConfirm);
