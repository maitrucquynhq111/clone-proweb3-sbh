import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { RHFToggle } from '~app/components';

const DebitToggle = () => {
  const { t } = useTranslation('cashbook-form');
  return (
    <div className="blue-toggle pw-z-10 pw-absolute pw-top-1/2 -pw-translate-y-1/2 pw-right-4">
      <RHFToggle name="debit.is_debit" checkedChildren={t('debit') || ''} unCheckedChildren={t('debit') || ''} />
    </div>
  );
};

export default memo(DebitToggle);
