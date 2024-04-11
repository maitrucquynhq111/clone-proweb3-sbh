import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';
import {
  LinkedProductsTable,
  ProductAddOnGroupConfig,
  ProductAddOnTable,
} from '~app/features/products-addon/components';

export const productAddOnGroupFormSchema = ({ setOpen }: { setOpen(value: boolean): void }) => {
  const { t } = useTranslation(['product-addon-form', 'common']);
  return {
    className: 'pw-grid pw-grid-cols-12 pw-gap-x-4',
    type: 'container',
    name: 'form',
    children: [
      {
        className: 'pw-col-span-8',
        name: 'first-col',
        type: 'block-container',
        children: [
          {
            blockClassName: 'pw-p-6 pw-bg-white pw-rounded',
            className: 'pw-grid pw-grid-cols-9',
            type: 'block',
            name: 'first-block',
            children: [
              {
                type: ComponentType.Text,
                className: 'pw-col-span-4',
                label: t('addon_group_name') || '',
                name: 'name',
                isRequired: true,
                placeholder: t('placeholder.addon_group_name') || '',
              },
              {
                type: ComponentType.Custom,
                name: 'list_product_add_on',
                className: 'pw-col-span-9',
                component: ProductAddOnTable,
              },
            ],
          },
          {
            blockClassName: 'pw-p-6 pw-bg-white pw-rounded pw-mt-4',
            title: t('product_link'),
            type: 'block',
            name: 'second-block',
            children: [
              {
                type: ComponentType.Custom,
                name: 'linked-product-table',
                component: LinkedProductsTable,
                setOpen,
              },
            ],
          },
        ],
      },
      {
        className: 'pw-col-span-4',
        name: 'second-col',
        type: 'block-container',
        children: [
          {
            blockClassName: 'pw-bg-white pw-rounded',
            type: 'block',
            name: 'product-addon-group-config',
            className: 'pw-divide-neutral-100 pw-divide-y',
            children: [
              {
                type: ComponentType.Custom,
                name: 'is_required',
                title: t('is_required'),
                component: ProductAddOnGroupConfig,
              },
              {
                type: ComponentType.Custom,
                name: 'is_multiple_options',
                title: t('is_multiple_options'),
                component: ProductAddOnGroupConfig,
              },
              {
                type: ComponentType.Custom,
                name: 'is_multiple_items',
                title: t('is_multiple_items'),
                component: ProductAddOnGroupConfig,
              },
            ],
          },
        ],
      },
    ],
  };
};
