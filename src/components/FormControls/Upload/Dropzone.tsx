import { memo } from 'react';
import cx from 'classnames';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { UploadMultiFileProps } from './type';
import BlockContent from './BlockContent';
import RejectionFiles from './RejectionFiles';
import FilePreview from './FilePreview';
import { handleChangeFiles } from '~app/utils/helpers/fileHelpers';

const Dropzone = ({
  fileList = [],
  accept = { image: ['.jpeg', '.jpg', '.png'] },
  description,
  multiple = true,
  maxFiles = 10,
  canRemoveAll = true,
  icon,
  errorForm,
  errorMessage,
  conditionOpacity,
  onChange,
  ...other
}: UploadMultiFileProps) => {
  const handleChange = async (files: ExpectedAny[]) => {
    if (fileList.length > maxFiles || fileList.length + files.length > maxFiles) {
      toast.error(errorMessage);
    }
    if (files.length > 0) {
      const formatFiles = await handleChangeFiles({
        files,
        maxFiles: maxFiles - fileList.length,
      });
      onChange?.([...fileList, ...formatFiles]);
    }
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    ...other,
    accept,
    multiple,
    onDrop: handleChange,
  });

  return (
    <>
      {fileList.length < maxFiles && (
        <div
          className={cx(
            'pw-outline-none pw-py-2 pw-px-1 pw-rounded pw-border pw-border-dashed pw-border-slate-300 pw-cursor-pointer hover:pw-bg-slate-50',
            { ['pw-opacity-75']: isDragActive },
            { '!pw-border-red-500': errorForm },
          )}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <BlockContent icon={icon} description={description} />
        </div>
      )}
      {errorForm && <p className="pw-text-red-500 pw-pt-1">{errorForm}</p>}
      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} accept={accept} />}

      {fileList.length > 0 && (
        <FilePreview
          fileList={fileList}
          conditionOpacity={conditionOpacity}
          canRemoveAll={canRemoveAll}
          onChange={onChange}
        />
      )}
    </>
  );
};

export default memo(Dropzone);
