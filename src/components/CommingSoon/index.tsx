import { useTranslation } from 'react-i18next';
import {
  DOWNLOAD_ANDROID_BUTTON,
  DOWNLOAD_IOS_BUTTON,
  LINK_DOWNLOAD_ANDROID,
  LINK_DOWNLOAD_IOS,
  QR_OPEN_APP,
} from '~app/configs';

const CommingSoonWrapper = () => {
  const { t } = useTranslation('common');
  return (
    <div className="pw-flex pw-items-center pw-justify-center pw-flex-col md:pw-mt-10">
      <p className="pw-text-lg pw-font-semibold pw-mb-10">{t('comming_soon_empty_state.subtitle')}</p>
      <img src={QR_OPEN_APP} alt="QR open app" width={300} height={300} className="pw-mb-10" />
      <h4 className="pw-text-2xl pw-mb-6">{t('comming_soon_empty_state.download_at')}</h4>
      <div className="pw-flex pw-mb-4">
        <img
          src={DOWNLOAD_IOS_BUTTON}
          alt="App Store"
          className="pw-w-44 pw-cursor-pointer pw-mr-4"
          onClick={() => window.open(LINK_DOWNLOAD_IOS)}
        />
        <img
          src={DOWNLOAD_ANDROID_BUTTON}
          alt="Google Play"
          className="pw-w-44 pw-cursor-pointer"
          onClick={() => window.open(LINK_DOWNLOAD_ANDROID)}
        />
      </div>
      <div className="pw-text-sm pw-text-neutral-secondary">
        <span>{t('comming_soon_empty_state.advertise_1')}</span>
        <span className="pw-text-base pw-font-bold pw-text-primary-main pw-mx-1">400.000</span>
        <span>{t('comming_soon_empty_state.advertise_2')}</span>
      </div>
    </div>
  );
};

export default CommingSoonWrapper;
