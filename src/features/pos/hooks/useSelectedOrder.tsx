import { initialOrder } from '~app/features/pos/utils';
import createFastContext from '~app/utils/hooks/createFastContext';

export const { Provider: SelectedOrderProvider, useStore: useSelectedOrderStore } = createFastContext<PendingOrderForm>(
  initialOrder(),
);
