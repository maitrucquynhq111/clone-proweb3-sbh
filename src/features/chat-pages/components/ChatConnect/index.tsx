import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Tag } from 'rsuite';
import { BsChevronLeft } from 'react-icons/bs';
import { Provider } from '../../utils';
import ZaloBtn from './ZaloBtn';
import FacebookBtn from './FacebookBtn';
import { IconFacebook, IconShopee, IconTiktok, IconZalo } from '~app/components/Icons';

const channels = [
  {
    icon: <IconFacebook size="64" />,
    title: 'facebook_page',
    key: Provider.Meta,
    description: 'facebook_description',
    is_comming_soon: false,
    component: FacebookBtn,
  },
  {
    icon: <IconZalo size="62" />,
    title: 'zalo_page',
    key: Provider.Zalo,
    description: 'zalo_description',
    is_comming_soon: false,
    component: ZaloBtn,
  },
  {
    icon: <IconShopee />,
    title: 'shopee_page',
    key: Provider.Shopee,
    description: 'shopee_description',
    is_comming_soon: true,
    component: Fragment,
  },
  {
    icon: <IconTiktok />,
    title: 'tiktok_page',
    key: Provider.Tiktok,
    description: 'tiktok_description',
    is_comming_soon: true,
    component: Fragment,
  },
];

type Props = {
  isHaveConnected: boolean;
  canEdit: boolean;
  onOpenChannel: () => void;
  isFacebookReady: boolean;
  isZaloReady: boolean;
  linkedPages: ExpectedAny;
};

const ChatConnect = ({ isHaveConnected, canEdit, onOpenChannel, isFacebookReady, isZaloReady, linkedPages }: Props) => {
  const { t } = useTranslation('chat');

  return (
    <div className="pw-p-4 pw-pt-0">
      {isHaveConnected && (
        <div className="pw-mb-4">
          <Button
            appearance="subtle"
            className="!pw-text-blue-primary !pw-font-bold"
            startIcon={<BsChevronLeft size={22} />}
            onClick={onOpenChannel}
          >
            {t('action.back_page_management')}
          </Button>
        </div>
      )}
      {channels.map((page) => {
        const Component = page.component;
        const isReady = page.key === Provider.Meta ? isFacebookReady : page.key === Provider.Zalo ? isZaloReady : false;
        return (
          <div key={page.title} className="pw-flex pw-mb-8">
            {page.icon}
            <div className="pw-ml-4">
              <div className="pw-flex pw-items-center pw-mb-1">
                <div className="pw-text-base pw-font-bold">{t(page.title)}</div>
                {page.is_comming_soon && (
                  <Tag color="orange" size="sm" className="pw-ml-2 pw-font-semibold">
                    {t('common:comming_soon')}
                  </Tag>
                )}
              </div>
              <div className="pw-text-base pw-mb-4">{t(page.description)}</div>
              {canEdit && (
                <Component
                  onOpenChannel={onOpenChannel}
                  isReady={isReady}
                  isCommingSoon={page.is_comming_soon}
                  linkedPages={linkedPages}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatConnect;
