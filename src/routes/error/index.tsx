import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { ErrorRouteKeys } from '../enums';
import { ErrorRoutes } from './config';

const routers: RouteObject = {
  path: ErrorRoutes[ErrorRouteKeys.Root].path,
  element: ErrorRoutes[ErrorRouteKeys.Root].element,
  children: [
    {
      path: ErrorRoutes[ErrorRouteKeys.Root].path,
      element: <Navigate to={ErrorRoutes[ErrorRouteKeys.NotFound].path} replace />,
    },
    {
      path: ErrorRoutes[ErrorRouteKeys.NotFound].path,
      element: ErrorRoutes[ErrorRouteKeys.NotFound].element,
    },
    {
      path: '*',
      element: <Navigate to="/error/404" replace />,
    },
  ],
};

export default routers;
