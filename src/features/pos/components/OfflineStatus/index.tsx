import { BsWifi, BsWifiOff } from 'react-icons/bs';
import { useNetworkState } from 'react-use';
import { useTranslation } from 'react-i18next';
import { Tooltip, Whisper } from 'rsuite';

function OfflineStatus() {
  const { online } = useNetworkState();
  const { t } = useTranslation('pos');

  return (
    <Whisper
      placement="autoVertical"
      trigger="hover"
      speaker={
        <Tooltip className="pw-absolute" arrow={false}>
          {online ? t('offline-mode.online-status') : t('offline-mode.offline-status')}
        </Tooltip>
      }
    >
      <div className="pw-text-white pw-text-3xl pw-cursor-pointer pw-relative">
        {online ? <BsWifi /> : <BsWifiOff />}
      </div>
    </Whisper>
  );
}

export default OfflineStatus;
