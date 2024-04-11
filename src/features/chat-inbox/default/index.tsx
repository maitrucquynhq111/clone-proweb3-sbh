import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import FeatureItem from './FeatureItem';
import {
  BannerConnectSocial,
  AbsenceMessImage,
  AutoMessImage,
  LabelMessImage,
  QuickMessImage,
} from '~app/components/Icons';
import { MainRouteKeys } from '~app/routes/enums';
import { useCurrentPage } from '~app/features/chat-configs/hooks';

const DATA = [
  {
    title: 'auto_message',
    description: 'auto_message_description',
    image: <AutoMessImage />,
    link: MainRouteKeys.ChatConfigsAutoMessage,
  },
  {
    title: 'absence_message',
    description: 'absence_message_description',
    image: <AbsenceMessImage />,
    link: MainRouteKeys.ChatConfigsAbsenceMessage,
  },
  {
    title: 'quick_message',
    description: 'quick_message_description',
    image: <QuickMessImage />,
    link: MainRouteKeys.ChatConfigsQuickMessage,
  },
  {
    title: 'apply_label_message',
    description: 'label_message_description',
    image: <LabelMessImage />,
    link: MainRouteKeys.ChatConfigsLabel,
  },
];

const Default = () => {
  const { t } = useTranslation('chat');
  const { linkedPages } = useCurrentPage();

  return (
    <div className="pw-flex pw-items-center pw-justify-start pw-flex-col pw-mx-auto pw-h-full pw-pt-20">
      {linkedPages.length === 0 ? (
        <>
          <p className="pw-text-neutral-primary pw-max-w-md pw-text-xl pw-font-bold">{t('welcome_chat_title')}</p>
          <p className="pw-text-neutral-primary pw-max-w-md pw-text-sm pw-mb-8">{t('upgrade_conversation_social')}</p>
          <NavLink to={MainRouteKeys.ChatConfigsPages}>
            <BannerConnectSocial />
          </NavLink>
        </>
      ) : (
        <>
          <div className="pw-w-1/2 ">
            <h5 className="pw-mb-2 pw-text-xl pw-text-center">{t('welcome_chat_title')}</h5>
            <div className="pw-text-center pw-text-sm">{t('welcome_chat_description')}</div>
          </div>
          <div className="pw-grid pw-grid-cols-2 pw-gap-6 pw-mt-8">
            {DATA.map((item) => (
              <FeatureItem key={item.title} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Default;
