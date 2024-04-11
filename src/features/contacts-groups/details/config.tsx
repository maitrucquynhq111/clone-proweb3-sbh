import { BsInfoCircleFill, BsPeopleFill } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { ContactListTabHeader, ContactTable } from './components';
import { ComponentType } from '~app/components/HookForm/utils';
import { SettingConditions } from '~app/features/contacts-groups/components';

export enum ContactDetailTabKey {
  CONTACT_LIST_TAB = 'contact_list_tab',
  INFO_TAB = 'info_tab',
}

export const CONTACT_GROUP_TABS = {
  [ContactDetailTabKey.CONTACT_LIST_TAB]: {
    name: ContactDetailTabKey.CONTACT_LIST_TAB,
    icon: <BsPeopleFill size={20} />,
  },
  [ContactDetailTabKey.INFO_TAB]: {
    name: ContactDetailTabKey.INFO_TAB,
    icon: <BsInfoCircleFill size={20} />,
  },
};

export function contactGroupDetailSchema({ activeTab }: { activeTab: string }) {
  const { t } = useTranslation('contact-group-form');
  const CONTACT_LIST_TAB_CONTENT = [
    {
      type: 'block-container',
      name: 'first-tab',
      children: [
        {
          type: ComponentType.Custom,
          name: 'contact-list-tab-header',
          component: ContactListTabHeader,
        },
        {
          type: 'block',
          name: 'contact-list-block',
          blockClassName: 'pw-mt-6 pw-p-6 pw-pb-2 pw-bg-neutral-white',
          children: [
            {
              type: ComponentType.Custom,
              name: 'contact-list-table',
              component: ContactTable,
            },
          ],
        },
      ],
    },
  ];
  const INFO_TAB_CONTENT = [
    {
      type: 'block-container',
      name: 'second-tab',
      children: [
        {
          type: 'block',
          name: 'contact-list-block',
          blockClassName: 'pw-p-6 pw-bg-neutral-white',
          children: [
            {
              className: `pw-col-span-12`,
              type: 'block',
              name: 'first-block',
              children: [
                {
                  type: ComponentType.Text,
                  isRequired: true,
                  className: 'pw-col-span-12',
                  labelClassName: 'pw-font-bold',
                  label: t('contact_group_name'),
                  name: 'name',
                  placeholder: t('placeholder.name'),
                },
              ],
            },
            {
              className: `pw-col-span-12`,
              type: 'block',
              blockClassName: 'pw-mt-6',
              name: 'second-block',
              titleClassName: '!pw-pb-3',
              title: t('condition'),
              children: [
                {
                  type: ComponentType.Custom,
                  name: 'setting-conditions',
                  component: SettingConditions,
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  return {
    className: 'pw-h-full',
    type: 'container',
    name: 'form',
    children: activeTab === ContactDetailTabKey.CONTACT_LIST_TAB ? CONTACT_LIST_TAB_CONTENT : INFO_TAB_CONTENT,
  };
}
