let subscriptionPlan: SubscriptionPlan | null = null;
let listeners: ExpectedAny = [];

export const subscriptionPlanStore = {
  setSubscriptionPlan(newData: SubscriptionPlan) {
    subscriptionPlan = newData;
    emitChange();
  },
  subscribe(listener: ExpectedAny) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l: ExpectedAny) => l !== listener);
    };
  },
  getSnapshot() {
    return subscriptionPlan;
  },
};

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}
