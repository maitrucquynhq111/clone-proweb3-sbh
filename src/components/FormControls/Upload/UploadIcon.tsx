import { memo } from 'react';
import { InputProps } from 'rsuite';
import { handleChangeFiles } from '~app/utils/helpers/fileHelpers';
import { DefaultImage } from '~app/components/Icons';

type Props = {
  accept?: string;
  disabled?: boolean;
  icon?: JSX.Element;
  maxFiles?: number;
  multiple?: boolean;
  onChange(fileList: ExpectedAny[]): void;
} & Omit<InputProps, 'onChange'>;

const UploadIcon = ({
  accept = 'image/png, image/jpeg, image/jpg',
  disabled = false,
  multiple = false,
  maxFiles = 10,
  icon = <DefaultImage />,
  onChange,
}: Props) => {
  const handleChange = async (files: FileList | null) => {
    if (files && files.length > 0) {
      const formatFiles = await handleChangeFiles({
        files: files as ExpectedAny,
        maxFiles: maxFiles,
      });
      onChange(formatFiles);
    }
  };

  return (
    <label className="pw-cursor-pointer">
      {icon}
      <input
        accept={accept}
        type="file"
        multiple={multiple}
        hidden
        disabled={disabled}
        onChange={(e) => handleChange(e.target.files)}
      />
    </label>
  );
};

export default memo(UploadIcon);
