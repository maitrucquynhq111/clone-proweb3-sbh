import { initialTable } from '~app/features/table/utils';
import createFastContext from '~app/utils/hooks/createFastContext';

export const { Provider: SelectedTableProvider, useStore: useSelectedTableStore } = createFastContext<PendingTable>(
  initialTable(),
);
