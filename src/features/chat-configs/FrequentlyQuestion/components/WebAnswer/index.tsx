import { useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import { TextInput } from '~app/components';
import { AuthService } from '~app/services/api';

type Props = { answer: string; error: string; onChange(value: string): void };

const WebAnswer = ({ answer, error, onChange }: Props): JSX.Element => {
  const { t } = useTranslation('chat');
  const domain = AuthService.getBusinessDomain();

  return (
    <>
      <div className="pw-flex pw-items-center pw-justify-between">
        <label className="!pw-text-left pw-block pw-mb-1 pw-text-sm" htmlFor={t('web_link') || ''}>
          {t('web_link')} <span className="pw-text-xs pw-text-red-500">*</span>
        </label>
        <Button
          appearance="subtle"
          className="!pw-text-blue-primary !pw-font-bold"
          onClick={() => onChange(`https://${domain}`)}
        >
          {t('action.insert_store_link')}
        </Button>
      </div>
      <div>
        <TextInput
          name=""
          isForm={false}
          value={answer}
          onChange={onChange}
          error={!!error}
          placeholder={t('placeholder.web_link') || ''}
        />
        {error && <p className="pw-text-red-500 pw-pt-1">{error}</p>}
      </div>
    </>
  );
};

export default WebAnswer;
