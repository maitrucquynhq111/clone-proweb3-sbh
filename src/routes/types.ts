import { ReactNode } from 'react';
import { ErrorRouteKeys, MainRouteKeys } from './enums';

export type RouteItem = {
  path: string;
  name?: string;
  title?: string;
  element?: ReactNode | null;
  permissions: string | string[];
  packages?: string[];
  hideHeader?: boolean;
  hideSideBar?: boolean;
  hideNavHeader?: boolean;
  hidePageHeader?: boolean;
  hidePageTitle?: boolean;
};

export type MainRouteObject = {
  [key in MainRouteKeys]: RouteItem;
};

export type ErrorRouteObject = {
  [key in ErrorRouteKeys]: RouteItem;
};
