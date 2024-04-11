import createFastContext from '~app/utils/hooks/createFastContext';
import { ContactAnalyticFilter } from '~app/features/contacts/lists/config';

type ContactStore = {
  analytics_options: ContactAnalyticFilter[];
};

export const { Provider: ContactProvider, useStore: useContactStore } = createFastContext<ContactStore>({
  analytics_options: [],
});
