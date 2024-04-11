import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsFileEarmarkText } from 'react-icons/bs';
import { Progress, Button } from 'rsuite';
import ModalDetails from './ModalDetails';

const UploadFile = ({ file, detailFailQuery }: { file: MassUpload; detailFailQuery?: ExpectedAny }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { t } = useTranslation('common');
  const percentComplete = (file.total_row !== 0 && Math.round((file.amount_success / file.total_row) * 100)) || 0;

  const isFailed = file.status === 'failed';
  const isSomeFailed = file.status !== 'started' && file.amount_fail > 0;
  const isSuccess = file.status === 'successfully';

  return (
    <div className="pw-mt-4">
      <div className="pw-flex pw-pt-2 pw-gap-2 pw-text-neutral-600 pw-px-4 pw-mb-1 pw-pb-1 pw-rounded-md pw-border pw-border-neutral-100">
        <BsFileEarmarkText size={30} />
        <div className="pw-flex-1">
          <div className="pw-font-bold pw-text-sm">{file.file_name_origin}</div>
          <div className="!pw-text-sm">
            {isFailed || isSomeFailed ? (
              <div className="pw-flex pw-items-center">
                <span className="pw-text-red-700">{t(isFailed ? 'upload-fail' : 'upload-success-but-errors')}</span>
                <Button onClick={handleOpen} appearance="link" active color="blue" size={'xs'}>
                  {t('view-detail')}
                </Button>
              </div>
            ) : isSuccess ? (
              <span className="pw-text-green-600">{t('upload-success')}</span>
            ) : (
              <Progress.Line className="!pw-p-0" percent={percentComplete} status={'active'} strokeWidth={5} />
            )}
          </div>
        </div>
      </div>
      {open && <ModalDetails id={file.id} open={open} detailFailQuery={detailFailQuery} onClose={handleClose} />}
    </div>
  );
};

export default UploadFile;
