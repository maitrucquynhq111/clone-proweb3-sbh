import { Button } from 'rsuite';
import { BsGearFill } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import HeaderNav from './HeaderNav';
import { CustomerPermission, useHasPermissions } from '~app/utils/shield';
import {
  IconFacebook,
  IconZalo,
  // IconShopee, IconTiktok
} from '~app/components/Icons';

const Header = ({
  onAddMoreConnectPage,
  onSetActiveChannel,
  activeTab,
}: {
  onAddMoreConnectPage: () => void;
  onSetActiveChannel: (value: string) => void;
  activeTab: string;
}) => {
  const { t } = useTranslation('chat');
  const canEditFanpage = useHasPermissions([CustomerPermission.CUSTOMER_CONNECT_FANPAGE_VIEW]);

  const channels = useMemo(() => {
    return [
      {
        icon: '',
        title: t('common:all'),
        key: 'all',
      },
      {
        icon: <IconFacebook size="24" />,
        title: 'Facebook',
        key: 'meta',
      },
      {
        icon: <IconZalo size="24" />,
        title: 'ZaloOA',
        key: 'zalo',
      },
      // { icon: <IconShopee size="24" />, title: 'Shopee' },
      // { icon: <IconTiktok size="24" />, title: 'Tiktok' },
    ];
  }, []);

  return (
    <div className="pw-mb-6 pw-relative">
      {/* <ButtonToolbar>
        <ButtonGroup>
          <Button className="!pw-py-3 !pw-px-4 !pw-text-base">{t('common:all')}</Button>
          {DATA.map((type) => (
            <Button key={type.title} startIcon={type.icon} className="!pw-text-base !pw-py-3 !pw-px-4">
              {type.title}
            </Button>
          ))}
        </ButtonGroup>
      </ButtonToolbar> */}
      <HeaderNav activeTab={activeTab} onChange={onSetActiveChannel} data={channels} />
      {canEditFanpage && (
        <Button
          onClick={onAddMoreConnectPage}
          className="!pw-text-blue-primary !pw-absolute pw-top-1 pw-right-5 !pw-bg-transparent hover:!pw-bg-neutral-background !pw-font-bold"
          startIcon={<BsGearFill size={24} />}
        >
          {t('action.add_connect_page')}
        </Button>
      )}
    </div>
  );
};

export default Header;
