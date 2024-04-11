import { useTranslation } from 'react-i18next';

const Maintainence = (): JSX.Element => {
  const { t } = useTranslation('common');

  return (
    <div className="pw-h-96 pw-w-full pw-flex-col pw-items-center pw-justify-center pw-flex">
      <p className="pw-text-3xl pw-font-bold">{t('maintainence-title')}</p>
      <p className="pw-text-base">{t('maintainence-description')}</p>
    </div>
  );
};

export default Maintainence;
