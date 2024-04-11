import { useLayoutEffect, useSyncExternalStore, useState } from 'react';
import { verifyPermission } from './utils';
import { permissionStore } from './store';

export const withPermissions = (WrappedComponent: ExpectedAny, permissionNames: string[] | string) => {
  const ReturnedComponent = () => {
    const [canAccess, setCanAccess] = useState<boolean>(true);

    const permissions = useSyncExternalStore(permissionStore.subscribe, permissionStore.getSnapshot);

    const handleAccess = (value: boolean) => {
      setCanAccess(value);
    };

    useLayoutEffect(() => {
      verifyPermission(permissions, permissionNames, handleAccess);
    }, [permissions]);

    return canAccess ? <WrappedComponent /> : null;
  };
  return ReturnedComponent;
};
