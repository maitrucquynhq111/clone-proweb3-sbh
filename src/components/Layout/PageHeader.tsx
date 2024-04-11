import { memo } from 'react';
// import { Link } from 'react-router-dom';
// import { Breadcrumbs } from './Breacrumb';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { HeaderButtonOutlet } from './HeaderButton';
import HeaderNav from './HeaderNav';
import { MainRoutes } from '~app/routes/main/config';
import { MainRouteKeys } from '~app/routes/enums';
import { menusRenderer } from '~app/configs/menu';
import { useCurrentPath } from '~app/utils/hooks';

type Props = {
  hidePageHeader?: boolean;
  hideNavHeader?: boolean;
  hidePageTitle?: boolean;
};

const PageHeader = ({ hidePageHeader = true, hideNavHeader, hidePageTitle = true }: Props): JSX.Element => {
  const { t } = useTranslation();
  // const { paths, currentPage } = useCurrentPath();
  const { paths } = useCurrentPath();

  const menus = menusRenderer(t);

  // const pathsToMenu = paths.map((item) => {
  //   const getRouteOptions = MainRoutes?.[item.pathname as MainRouteKeys];

  //   return getRouteOptions?.name ? (
  //     <Link key={item.pathname} to={item.pathname} className="hover:underline">
  //       {t(getRouteOptions.name)}
  //     </Link>
  //   ) : null;
  // });

  const pathsToMenu = paths.map((item) => {
    const getRouteOptions = MainRoutes?.[item.pathname as MainRouteKeys];
    const splitPathName = getRouteOptions?.path?.split('/');
    const routeOption = MainRoutes?.[`/${splitPathName?.[1]}` as MainRouteKeys];
    return {
      name: routeOption?.name ? t(routeOption.name) : null,
      options: getRouteOptions,
    };
  });

  const isShowPageTitle = pathsToMenu?.length >= 3;
  const parentMenu = (isShowPageTitle && pathsToMenu[1]?.options) || null;

  const menuNav = parentMenu && menus.find((item) => item.path === parentMenu?.path)?.childs;
  return (
    <>
      {isShowPageTitle && !hidePageTitle && (
        <div className="pw-p-4 md:pw-p-5 pw-pb-0 md:pw-pb-0">
          {/* <div className="pw-font-bold pw-text-2xl">{pathsToMenu[1]?.name}</div> */}
        </div>
      )}
      {!hideNavHeader && <div>{menuNav && <HeaderNav data={menuNav} />}</div>}
      {!hidePageHeader && (
        <div className="pw-p-4 md:pw-p-5 pw-pb-0 md:pw-pb-0">
          <div className="pw-flex pw-justify-between pw-items-center">
            <div
              className={cx('pw-font-bold pw-text-2xl', {
                '!pw-text-xl': isShowPageTitle,
              })}
            >
              {/* {currentPage?.title && t(currentPage.title)} */}
            </div>
            <HeaderButtonOutlet />
          </div>
        </div>
      )}
    </>
  );
};

export default memo(PageHeader);
