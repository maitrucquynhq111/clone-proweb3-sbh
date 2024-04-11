let permissions: string[] = [];
let listeners: ExpectedAny = [];

export const permissionStore = {
  updatePermission(userPermissions: ExpectedAny) {
    const getAllPermission = Object.keys(userPermissions).filter((k: string) => userPermissions[k] === true);
    permissions = getAllPermission;
    // permissions = userPermissions;
    emitChange();
  },
  subscribe(listener: ExpectedAny) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l: ExpectedAny) => l !== listener);
    };
  },
  getSnapshot() {
    return permissions;
  },
};

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}
