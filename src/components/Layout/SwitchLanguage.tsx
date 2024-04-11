import { useTranslation } from 'react-i18next';
import { ButtonGroup, Button } from 'rsuite';
import { Language } from '~app/i18n/enums';
import { changeLanguage } from '~app/i18n';

const SwitchLanguage = (): JSX.Element => {
  const { i18n: languageProvider } = useTranslation();

  return (
    <ButtonGroup>
      <Button
        {...(languageProvider.language === Language.EN
          ? { color: 'green', appearance: 'primary' }
          : { appearance: 'default' })}
        onClick={() => changeLanguage(Language.EN)}
        size="xs"
      >
        {Language.EN.toUpperCase()}
      </Button>
      <Button
        size="xs"
        {...(languageProvider.language === Language.VI
          ? { color: 'green', appearance: 'primary' }
          : { appearance: 'default' })}
        onClick={() => changeLanguage(Language.VI)}
      >
        {Language.VI.toUpperCase()}
      </Button>
    </ButtonGroup>
  );
};

export default SwitchLanguage;
