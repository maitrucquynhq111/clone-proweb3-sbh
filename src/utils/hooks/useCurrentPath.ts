import { matchRoutes, useLocation } from 'react-router-dom';
import { routes } from '../../routes';
import { MainRoutes } from '../../routes/main/config';
import { MainRouteKeys } from '../../routes/enums';

export const useCurrentPath = () => {
  const location = useLocation();
  const matchedRoutes = matchRoutes(routes, location.pathname);
  const currrentRouter =
    matchedRoutes && matchedRoutes?.length > 0
      ? matchedRoutes[matchedRoutes.length - 1]
      : matchedRoutes
      ? matchedRoutes[0]
      : null;
  const currentPage =
    MainRoutes?.[currrentRouter?.route?.path as MainRouteKeys] ||
    MainRoutes?.[currrentRouter?.route?.path as MainRouteKeys] ||
    null;

  return {
    paths: matchedRoutes || [],
    currentPage,
  };
};
