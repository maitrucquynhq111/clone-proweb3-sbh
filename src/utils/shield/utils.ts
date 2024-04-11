export function verifyPermission(
  permissions: string[],
  permissionNames: string[] | string,
  callback?: (value: boolean) => void,
  isContainAll?: boolean,
) {
  if (!permissions) {
    callback?.(false);
    return false;
  }

  if (typeof permissionNames === 'string') {
    if (permissionNames === '*') {
      callback?.(true);
      return true;
    }
    const canAccess = permissions.includes?.(permissionNames);
    callback?.(canAccess);
    return canAccess;
  } else if (Array.isArray(permissionNames)) {
    if (isContainAll) {
      return permissionNames.every((permissionName: string) => {
        const canAccess = Boolean(permissions.includes?.(permissionName));
        return canAccess;
      });
    }
    return permissions.some((permissionName: string) => {
      const canAccess = Boolean(permissionNames.includes?.(permissionName));
      callback?.(canAccess);
      return canAccess;
    });
  } else {
    callback?.(false);
    return false;
  }
}

export function verifyPackage({
  currentPackage,
  packages,
  callback,
}: {
  currentPackage: string;
  packages: string[];
  callback?: (value: boolean) => void;
}) {
  if (packages.length === 0) return true;
  const canAccess = packages.includes(currentPackage);
  callback?.(canAccess);
  return canAccess;
}
