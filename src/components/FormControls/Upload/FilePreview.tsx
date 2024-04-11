import cx from 'classnames';
import { BsX } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { Button, IconButton } from 'rsuite';
import { UploadMultiFileProps } from './type';
import { isLocalImage, revokeObjectUrl } from '~app/utils/helpers/fileHelpers';
import { usePackage } from '~app/utils/shield/usePackage';

export default function FilePreview({
  fileList,
  onChange,
  showCloseButton = true,
  canRemoveAll = true,
  conditionOpacity,
}: UploadMultiFileProps) {
  const { t } = useTranslation(['products-form']);
  const { currentPackage } = usePackage([], '');

  const handleRemove = (index: number) => {
    const formatFiles = [...fileList];
    const file = formatFiles[index];
    if (file && isLocalImage(file)) {
      revokeObjectUrl(file.url);
    }
    formatFiles.splice(index, 1);
    onChange?.(formatFiles);
  };

  const handleRemoveAll = () => {
    fileList.forEach((file) => {
      if (isLocalImage(file)) {
        revokeObjectUrl(file.url);
      }
    });
    onChange?.([]);
  };

  return (
    <div className="pw-flex pw-flex-wrap pw-my-2 pw-gap-2">
      {fileList.map((file, index) => {
        const isLocalFile = isLocalImage(file);
        return (
          <div
            key={isLocalFile ? file.name : file}
            className={cx('pw-w-20 pw-h-20 pw-mb-3 pw-relative', {
              'pw-mr-0': index + 1 === fileList.length,
              'pw-opacity-50':
                conditionOpacity && index > conditionOpacity.index && conditionOpacity.package === currentPackage,
            })}
          >
            <img src={isLocalFile ? file?.url : file} width="100%" className="pw-h-full pw-object-cover pw-rounded" />
            {showCloseButton ? (
              <IconButton
                icon={<BsX className="pw-fill-white" />}
                circle
                size="xs"
                className="!pw-absolute pw-top-1 pw-right-1 !pw-p-1 !pw-bg-neutral-placeholder "
                onClick={() => handleRemove(index)}
              />
            ) : null}
          </div>
        );
      })}
      {canRemoveAll && (
        <Button className="!pw-mb-3" appearance="ghost" onClick={handleRemoveAll}>
          {t('action.remove_all')}
        </Button>
      )}
    </div>
  );
}
