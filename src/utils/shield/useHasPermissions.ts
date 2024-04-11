import { useSyncExternalStore } from 'react';
import { verifyPermission } from './utils';
import { permissionStore } from './store';

export const useHasPermissions = (permissionNames: string[] | string, isContainAll?: boolean) => {
  const permissions = useSyncExternalStore(permissionStore.subscribe, permissionStore.getSnapshot);
  return verifyPermission(permissions, permissionNames, undefined, isContainAll);
};
