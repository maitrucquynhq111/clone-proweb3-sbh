import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {
  item: { title: string; description: string; image: JSX.Element; link: string };
};

const FeatureItem = ({ item }: Props) => {
  const { t } = useTranslation('chat');
  const navigate = useNavigate();

  return (
    <div
      className="pw-col-span-1 pw-rounded pw-shadow-md pw-w-min pw-cursor-pointer"
      onClick={() => navigate(item.link)}
    >
      <div className="pw-rounded-t">{item.image}</div>
      <div className="pw-text-center pw-p-3 pw-pt-1.5">
        <div className="pw-font-bold pw-mb-1">{t(item.title)}</div>
        <div className="pw-text-xs pw-text-neutral-secondary">{t(item.description)}</div>
      </div>
    </div>
  );
};

export default FeatureItem;
