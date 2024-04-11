import { useLayoutEffect, useSyncExternalStore, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { verifyPermission } from './utils';
import { permissionStore } from './store';
import { usePackage } from './usePackage';
import { ErrorRouteKeys } from '~app/routes/enums';
import { UpgradePackageModal } from '~app/components';

export const PermissionsWrapper = ({
  element,
  permissionNames,
  packages = [],
  addonKey = '',
}: {
  element: ExpectedAny;
  permissionNames: string[] | string;
  packages?: string[];
  addonKey?: string;
}) => {
  const navigate = useNavigate();
  const [canAccess, setCanAccess] = useState<boolean>(true);
  const [showUpgradePackage, setShowUpgradePackage] = useState<boolean>(false);
  const permissions = useSyncExternalStore(permissionStore.subscribe, permissionStore.getSnapshot);
  const { canAccess: canUseFeature, description } = usePackage(packages, addonKey);

  const handleAccess = (value: boolean) => {
    setCanAccess(value);
  };

  const handleConfirm = () => {
    setShowUpgradePackage(false);
  };

  const handleClose = () => {
    navigate(-1);
    setShowUpgradePackage(false);
  };

  useLayoutEffect(() => {
    verifyPermission(permissions, permissionNames, handleAccess);
  }, [permissions]);

  useLayoutEffect(() => {
    if (addonKey && !canUseFeature) {
      setShowUpgradePackage(true);
    }
  }, [addonKey]);

  if (showUpgradePackage) {
    return <UpgradePackageModal description={description} onConfirm={handleConfirm} onClose={handleClose} />;
  }

  return canAccess ? element : <Navigate to={ErrorRouteKeys.NotFound} replace />;
};
