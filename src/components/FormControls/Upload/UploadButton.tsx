import { memo } from 'react';
import { Button, InputProps } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import FilePreview from './FilePreview';
import { handleChangeFiles } from '~app/utils/helpers/fileHelpers';

type Props = {
  fileList?: (string | PendingUploadImage)[];
  accept?: string;
  description?: string;
  multiple?: boolean;
  maxFiles?: number;
  errorMessage?: string;
  onChange(fileList: (string | PendingUploadImage)[]): void;
} & Omit<InputProps, 'onChange'>;

const UploadButton = ({
  fileList = [],
  accept = 'image/png, image/jpeg, image/jpg',
  description,
  multiple = true,
  maxFiles = 10,
  errorMessage,
  onChange,
}: Props) => {
  const { t } = useTranslation(['products-form']);

  const handleChange = async (files: FileList | null) => {
    if (fileList.length === maxFiles) {
      return toast.error(errorMessage);
    }
    if (files && files.length > 0) {
      const formatFiles = await handleChangeFiles({
        files: files as ExpectedAny,
        maxFiles: maxFiles - fileList.length,
      });
      onChange(formatFiles);
    }
  };

  return (
    <>
      <Button appearance="ghost" block as="label">
        {description || t('upload_button')}
        <input accept={accept} multiple={multiple} type="file" hidden onChange={(e) => handleChange(e.target.files)} />
      </Button>
      {fileList.length > 0 && <FilePreview fileList={fileList} onChange={onChange} />}
    </>
  );
};

export default memo(UploadButton);
