import ContactLabellist from './ContactLabellist';
import { ComponentType } from '~app/components/HookForm/utils';

type Props = {
  list: PendingContactLabel[];
  setPage(page: number): void;
};

export const contactLabelsFormSchema = ({ list, setPage }: Props) => {
  return {
    className: 'pw-grid pw-grid-cols-12 pw-gap-x-6',
    type: 'container',
    name: 'form',
    children: [
      {
        className: 'pw-col-span-12',
        name: 'first-col',
        type: 'block-container',
        children: [
          {
            type: ComponentType.Custom,
            name: 'name',
            list,
            setPage,
            component: ContactLabellist,
          },
        ],
      },
    ],
  };
};
