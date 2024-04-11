import { Suspense, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import { useTranslation } from 'react-i18next';
import { MainRouteKeys } from '~app/routes/enums';
import { menusRenderer } from '~app/configs/menu';

const RouterSuspense = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation('routes');
  const menus = menusRenderer(t);
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname } = location;

  const currentRoute = menus.find((item: ExpectedAny) => item.path === pathname);

  useEffect(() => {
    const childs = currentRoute?.childs;
    if (Array.isArray(childs) && childs.length > 0) {
      navigate(childs?.[0]?.path || MainRouteKeys.Root, { replace: true });
    }
  }, [currentRoute?.path]);

  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export default RouterSuspense;
