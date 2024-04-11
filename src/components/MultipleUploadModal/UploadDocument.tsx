import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { Button } from 'rsuite';
import { BsUpload } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { useInterval } from 'react-use';
import UploadFile from './UploadFile';
import { isExcelValidate } from '~app/utils/helpers';
import { queryClient } from '~app/configs/client';

type Props = {
  query: ExpectedAny;
  mutation: ExpectedAny;
  queryKey: string;
  detailFailQuery?: ExpectedAny;
  onDone: (done: boolean) => void;
};

const UploadDocument = ({ query, mutation, queryKey, detailFailQuery, onDone }: Props) => {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const { isLoading, mutateAsync } = mutation();

  const { data, refetch } = query({
    page: 1,
    pageSize: 1,
    enabled: uploaded,
  });

  const getStatus = data?.[0]?.status;

  useInterval(
    () => {
      refetch();
    },
    getStatus === 'started' || getStatus === 'processing' ? 3000 : null,
  );

  useEffect(() => {
    if (!firstLoad) {
      if (getStatus === 'successfully') {
        queryClient.invalidateQueries([queryKey], { exact: false });
        onDone(true);
        setUploaded(false);
      } else if (getStatus === 'failed') {
        setUploaded(false);
      }
    }
  }, [getStatus]);

  const { t } = useTranslation(['notification', 'common']);

  const onDrop = useCallback((acceptedFiles: ExpectedAny) => {
    acceptedFiles.forEach((file: ExpectedAny) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('File reading was aborted');
      reader.onerror = () => console.log('File reading has failed');
      reader.onload = async () => {
        const binaryStr = reader.result;
        onDone(false);
        if (isExcelValidate(binaryStr)) {
          const dataFile = {
            name: file.name,
            mime_type: 'excel',
            content: await file.arrayBuffer(),
          };
          const result = await mutateAsync({
            file: dataFile,
          } as ExpectedAny);
          if (result) {
            setUploaded(true);
            setFirstLoad(false);
            refetch();
          }
        } else {
          toast.error(t('wrong-file-upload'));
        }
      };
      reader.readAsBinaryString(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    noDrag: true,
    noKeyboard: true,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
  });

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="pw-flex pw-justify-between pw-items-center">
          <div className="pw-text-base pw-flex-1 pw-mr-2">{t('common:system-generate')}</div>
          <Button
            disabled={isLoading}
            loading={isLoading}
            className="pw-flex-2 !pw-font-bold pw-max-w-fit"
            appearance="primary"
            startIcon={<BsUpload />}
          >
            {t('common:upload-file')}
          </Button>
        </div>
      </div>
      {!firstLoad &&
        data &&
        !isLoading &&
        data.map((item: MassUpload) => {
          return <UploadFile file={item} detailFailQuery={detailFailQuery} />;
        })}
    </>
  );
};

export default UploadDocument;
