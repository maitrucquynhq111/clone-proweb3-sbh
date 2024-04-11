import { Button } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import cx from 'classnames';
import StepUpload from './StepUpload';
import History from './History';
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from '~app/components';
import { ModalPlacement, ModalSize } from '~app/modals';

type ModalProps = {
  historyQuery: ExpectedAny;
  historyVariables?: ExpectedAny;
  detailFailQuery?: ExpectedAny;
  sampleFile: string;
  mutation: ExpectedAny;
  queryKey: string;
  open: boolean;
  setOpen: (value: boolean) => void;
};

const MultipleUploadModal = ({
  historyQuery,
  historyVariables,
  detailFailQuery,
  sampleFile,
  mutation,
  queryKey,
  open,
  setOpen,
}: ModalProps) => {
  const { t } = useTranslation(['common', 'modal-title']);
  const [viewHistory, setViewHistory] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleViewHistory = () => {
    setViewHistory(!viewHistory);
  };

  return (
    <Drawer
      backdrop="static"
      keyboard={false}
      placement={ModalPlacement.Right}
      size={ModalSize.Small}
      open={open}
      onClose={handleClose}
      className="pw-h-screen"
    >
      <DrawerHeader
        title={viewHistory ? t('modal-title:history-upload') : t('modal-title:upload-file-modal')}
        onClose={handleClose}
      />
      <DrawerBody className="pw-flex pw-flex-col pw-relative">
        <div
          className={cx({
            'pw-hidden': viewHistory,
          })}
        >
          <StepUpload
            sampleFile={sampleFile}
            query={historyQuery}
            mutation={mutation}
            queryKey={queryKey}
            detailFailQuery={detailFailQuery}
          />
        </div>
        {viewHistory && <History query={historyQuery} variables={historyVariables} detailFailQuery={detailFailQuery} />}
      </DrawerBody>
      <DrawerFooter>
        <Button appearance="ghost" size="lg">
          <span className="pw-font-bold" onClick={handleViewHistory}>
            {viewHistory ? t('back') : t('view-last-times-upload')}
          </span>
        </Button>
        <Button appearance="ghost" className="pw-button-secondary" size="lg" onClick={handleClose}>
          <span className="pw-font-bold pw-text-neutral-primary">{t('close')}</span>
        </Button>
      </DrawerFooter>
    </Drawer>
  );
};

export default MultipleUploadModal;
