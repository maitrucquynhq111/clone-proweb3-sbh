import createFastContext from '~app/utils/hooks/createFastContext';

export const { Provider: SelectedAddons, useStore: useSelectedAddons } = createFastContext<{
  can_select: boolean;
  selected_list: OrderItemAddOn[];
  required_groups: string[];
}>({
  can_select: false,
  selected_list: [],
  required_groups: [],
});
