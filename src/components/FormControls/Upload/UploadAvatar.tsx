import { memo } from 'react';
import { InputProps } from 'rsuite';
import cx from 'classnames';
import { handleChangeFiles } from '~app/utils/helpers/fileHelpers';
import { DefaultImage } from '~app/components/Icons';

type Props = {
  fileList?: ExpectedAny[];
  accept?: string;
  size?: number;
  disabled?: boolean;
  icon?: JSX.Element;
  onChange(fileList: ExpectedAny[]): void;
} & Omit<InputProps, 'onChange'>;

const UploadAvatar = ({
  fileList = [],
  accept = 'image/png, image/jpeg, image/jpg',
  size,
  disabled = false,
  icon = <DefaultImage />,
  onChange,
}: Props) => {
  const handleChange = async (files: FileList | null) => {
    if (files && files.length > 0) {
      const formatFiles = await handleChangeFiles({
        files: files.length > 1 ? (files as ExpectedAny).splice(1, 1) : files, // If files has more than 1, then select new file
        maxFiles: 1,
      });
      onChange(formatFiles);
    }
  };

  return (
    <label
      className={cx(
        'pw-h-full pw-flex pw-items-center pw-justify-center pw-mt-0 pw-border pw-rounded pw-border-solid pw-cursor-pointer pw-bg-slate-100',
        {
          ['!pw-bg-white']: fileList?.length > 0,
        },
      )}
      style={{ width: size || 48, height: size || 48 }}
    >
      <>
        {fileList?.length === 0 ? (
          icon
        ) : (
          <img
            src={fileList?.[0]?.url || fileList?.[0]}
            width="100%"
            height="100%"
            className="pw-h-full pw-object-cover"
          />
        )}
        <input accept={accept} type="file" hidden disabled={disabled} onChange={(e) => handleChange(e.target.files)} />
      </>
    </label>
  );
};

export default memo(UploadAvatar);
