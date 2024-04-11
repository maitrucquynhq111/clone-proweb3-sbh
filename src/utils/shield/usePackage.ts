import { useSyncExternalStore } from 'react';
import { verifyPackage } from './utils';
import { subscriptionPlanStore } from './store';
import { useUserInfo } from '~app/utils/hooks';

export const usePackage = (packages: string[], addonKey: string) => {
  const subscriptionPlan = useSyncExternalStore(subscriptionPlanStore.subscribe, subscriptionPlanStore.getSnapshot);
  const { getCurrentPackage } = useUserInfo();
  return {
    currentPackage: getCurrentPackage(),
    canAccess: verifyPackage({ currentPackage: getCurrentPackage(), packages }),
    description: subscriptionPlan?.addons.find((addon) => addon.key === addonKey)?.description || '',
  };
};
