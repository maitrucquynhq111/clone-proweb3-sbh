import { BsEnvelope } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import { FEEDBACK_FORM } from '~app/configs';

export default function Feedback() {
  const { t } = useTranslation('common');
  return (
    <div className="!pw-ml-0 !pw-mr-4" onClick={() => window.open(FEEDBACK_FORM, '_blank')}>
      <Button
        startIcon={<BsEnvelope size={20} />}
        size="md"
        className="!pw-bg-transparent hover:!pw-bg-neutral-background"
      >
        <span className="pw-cursor-pointer pw-text-sm">{t('feedback')}</span>
      </Button>
    </div>
  );
}
