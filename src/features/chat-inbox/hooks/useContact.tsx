import createFastContext from '~app/utils/hooks/createFastContext';

export const { Provider: ContactProvider, useStore: useContactStore } = createFastContext<{
  contact?: Contact;
  list_contact_delivering?: ContactDeliveringAddress[];
}>({
  contact: undefined,
  list_contact_delivering: undefined,
});
