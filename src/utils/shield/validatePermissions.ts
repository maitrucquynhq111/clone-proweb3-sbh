import { useSyncExternalStore } from 'react';
import { verifyPermission } from './utils';
import { permissionStore } from './store';
import { MenuItemType } from '~app/features/chat-configs/components/MenuConfigs/types';

export function getPermissions() {
  return useSyncExternalStore(permissionStore.subscribe, permissionStore.getSnapshot);
}

export const validatePermissions = (value: ExpectedAny, permissionNames: string[] | string) => {
  const permissions = getPermissions();
  const canAccess = verifyPermission(permissions, permissionNames);
  return canAccess ? value : null;
};

export const checkHasAllPermissions = (childs: MenuItemType[]) => {
  const permissions = getPermissions();
  const allValid = childs.every((item) => validatePermissions(permissions, item.permissions));
  return allValid;
};
