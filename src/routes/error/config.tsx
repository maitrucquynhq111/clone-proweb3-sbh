import { lazy } from 'react';
import { ErrorRouteObject } from '../types';
import { ErrorRouteKeys } from '../enums';
import { ErrorLayout } from '~app/layouts';

const NotFoundError = lazy(() => import('~app/pages/Error/Error404'));
const InternalError = lazy(() => import('~app/pages/Error/Error500'));

export const ErrorRoutes: ErrorRouteObject = {
  [ErrorRouteKeys.Root]: {
    path: ErrorRouteKeys.Root,
    element: <ErrorLayout />,
    permissions: '*',
  },
  [ErrorRouteKeys.NotFound]: {
    path: ErrorRouteKeys.NotFound,
    element: <NotFoundError />,
    permissions: '*',
  },
  [ErrorRouteKeys.Internal]: {
    path: ErrorRouteKeys.Internal,
    element: <InternalError />,
    permissions: '*',
  },
};
