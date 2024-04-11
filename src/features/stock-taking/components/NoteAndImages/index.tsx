import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FilePreview from '~app/components/FormControls/Upload/FilePreview';

const NoteAndImages = () => {
  const { t } = useTranslation('stocktaking-form');
  const { control } = useFormContext<PendingStockTaking>();

  const note = useWatch({
    control,
    name: 'note',
  });

  const media = useWatch({
    control,
    name: 'media',
  });

  return (
    <div>
      {note ? (
        <div className="pw-text-sm">
          <span className="pw-font-semibold pw-text-neutral-secondary">{t('note')}:</span>{' '}
          <span className="pw-text-neutral-primary">{note}</span>
        </div>
      ) : null}
      {media.length > 0 ? (
        <div className="pw-flex pw-mt-4">
          <FilePreview fileList={media} showCloseButton={false} canRemoveAll={false} />
        </div>
      ) : null}
    </div>
  );
};

export default NoteAndImages;
