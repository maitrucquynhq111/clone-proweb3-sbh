import { Steps, Button } from 'rsuite';
import { BsDownload } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import UploadDocument from './UploadDocument';

type Props = {
  sampleFile: string;
  query: ExpectedAny;
  mutation: ExpectedAny;
  queryKey: string;
  detailFailQuery?: string;
};

const StepUpload = ({ sampleFile, query, mutation, queryKey, detailFailQuery }: Props) => {
  const [done, setDone] = useState<boolean>(false);
  const { t } = useTranslation('common');

  return (
    <div className="pw-p-4">
      <Steps vertical>
        <Steps.Item
          status={'process'}
          title={<div className="pw-font-bold pw-text-base">{t('download-template-file')}</div>}
          description={
            <div className="pw-flex pw-justify-between pw-items-center">
              <div className="pw-text-base">{t('download-fill-info')}</div>
              <Button appearance="ghost" color="blue" href={sampleFile} as="a">
                <div className="pw-flex pw-items-center pw-gap-2 pw-font-bold">
                  <BsDownload />
                  {t('download-template-file')}
                </div>
              </Button>
            </div>
          }
        />
        <Steps.Item
          status={'process'}
          title={<div className="pw-font-bold pw-text-base">{t('upload-your-file')}</div>}
          description={
            <UploadDocument
              query={query}
              mutation={mutation}
              queryKey={queryKey}
              detailFailQuery={detailFailQuery}
              onDone={setDone}
            />
          }
        />
        <Steps.Item
          status={done ? 'process' : 'wait'}
          title={<div className="pw-font-bold pw-text-base">{t('done')}</div>}
          description={<div className="pw-text-base">{t('view-result-upload')}</div>}
        />
      </Steps>
    </div>
  );
};

export default StepUpload;
