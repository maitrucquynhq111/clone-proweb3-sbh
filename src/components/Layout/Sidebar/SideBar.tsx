import cx from 'classnames';
import { useState } from 'react';
import { useWindowSize } from 'react-use';
import { Sidebar, Sidenav } from 'rsuite';
import { RiSettings4Fill } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import Menu from './Menu';
import Header from './Header';
import Item from './Item';
import { useCurrentPath } from '~app/utils/hooks';
import { MainRouteKeys } from '~app/routes/enums';
import { DOWNLOAD_ANDROID_BUTTON, DOWNLOAD_IOS_BUTTON, LINK_DOWNLOAD_ANDROID, LINK_DOWNLOAD_IOS } from '~app/configs';
import { MainRoutes } from '~app/routes/main/config';
import { OtherPermision, useHasPermissions } from '~app/utils/shield';

const SideBarComponent = (): JSX.Element => {
  const { t } = useTranslation('route');
  const { width } = useWindowSize();
  const [open, setOpen] = useState<boolean>(width > 1075 ? true : false);
  const canViewSetting = useHasPermissions([OtherPermision.STORE_SETTINGS_ALL_VIEW]);

  const { currentPage } = useCurrentPath();

  return (
    <>
      <Sidebar
        className={cx('!pw-bg-nav-background pw-sticky pw-top-0 pw-h-screen pw-z-50 pw-p-3 pw-pt-8 pw-duration-300', {
          'min-md:pw-hidden': currentPage?.path === MainRouteKeys.Commission,
        })}
        width={open ? 280 : 72}
        collapsible
      >
        <Sidenav className="!pw-w-auto !pw-bg-nav-background" expanded={open}>
          <Header open={open} setOpen={setOpen} />
          <Menu open={open} setOpen={setOpen} />
          {canViewSetting ? (
            <Item
              open={open}
              data={{
                title: t(MainRoutes[MainRouteKeys.Setting].name as string),
                path: MainRoutes[MainRouteKeys.Setting].path,
                icon: <RiSettings4Fill size={24} />,
              }}
            />
          ) : (
            <div className="pw-h-12" />
          )}
          <div
            className={cx('pw-w-full pw-flex pw-justify-between pw-overflow-hidden pw-duration-300 pw-mt-2', {
              'pw-w-0 pw-hidden': !open,
            })}
          >
            <img
              src={DOWNLOAD_IOS_BUTTON}
              alt="App Store"
              className="pw-w-[48%] pw-cursor-pointer"
              onClick={() => window.open(LINK_DOWNLOAD_IOS)}
            />
            <img
              src={DOWNLOAD_ANDROID_BUTTON}
              alt="Google Play"
              className="pw-w-[48%] pw-cursor-pointer"
              onClick={() => window.open(LINK_DOWNLOAD_ANDROID)}
            />
          </div>
        </Sidenav>
      </Sidebar>
    </>
  );
};
export default SideBarComponent;
