import { useTranslation } from 'react-i18next';

const SyncProgressItem = ({ name }: ExpectedAny) => {
  const { t } = useTranslation('pos');
  return (
    <div className="pw-flex !pw-text-xs pw-gap-2 pw-mb-1">
      <div className="pw-text-right pw-flex pw-gap-1">
        {t('sync.sync-progress')} {t(`sync.type.${name}`)}:
      </div>
      <div className="sync-progress checkCompleteSync pw-flex" id={`perSync-${name}`}>
        <div className="sync-progress-bar pw-hidden" id={`progress-sync-${name}__progress-bar`} />
        <div className="sync-progress-percentage pw-font-bold" id={`progress-sync-${name}__progress-percentage`}>
          0%
        </div>
      </div>
    </div>
  );
};

export default SyncProgressItem;
