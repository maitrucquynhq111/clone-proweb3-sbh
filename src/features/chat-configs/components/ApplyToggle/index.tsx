import { useTranslation } from 'react-i18next';
import { Toggle } from 'rsuite';

type Props = {
  title: string;
  checked: boolean;
  onChange(value: boolean): void;
};

const ApplyToggle = ({ title, checked, onChange }: Props) => {
  const { t } = useTranslation('chat');
  return (
    <div className="pw-flex pw-justify-between pw-pb-6 pw-border-b">
      <div className="pw-text-base pw-font-bold">{t(title)}</div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
};

export default ApplyToggle;
