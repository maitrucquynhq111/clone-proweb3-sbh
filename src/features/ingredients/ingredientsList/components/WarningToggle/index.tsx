import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { RHFToggle } from '~app/components';

type Props = {
  disabled: boolean;
};

const WarningToggle = ({ disabled }: Props) => {
  const { t } = useTranslation('ingredients-form');
  return (
    <RHFToggle name="is_warning" checkedChildren={t('warning_inventory') || ''} isTextOutSide disabled={disabled} />
  );
};

export default memo(WarningToggle);
