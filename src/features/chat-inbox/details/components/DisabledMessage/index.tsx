import { useTranslation } from 'react-i18next';
import { BsFillExclamationTriangleFill } from 'react-icons/bs';
import { FACEBOOK_TERM } from '~app/utils/constants';

const DisabledMessage = () => {
  const { t } = useTranslation('chat');

  return (
    <div className="pw-flex pw-items-center pw-bg-warning-background pw-p-4 pw-rounded pw-gap-x-3">
      <BsFillExclamationTriangleFill size={24} className="pw-text-warning-active" />
      <p className="pw-text-sm pw-text-red4">
        {t('disabled_message')}
        <a
          target="_blank"
          href={FACEBOOK_TERM}
          className="pw-text-secondary-main-blue pw-cursor-pointer hover:pw-text-secondary-main-blue"
        >
          {t('facebook_terms')}
        </a>
      </p>
    </div>
  );
};

export default DisabledMessage;
