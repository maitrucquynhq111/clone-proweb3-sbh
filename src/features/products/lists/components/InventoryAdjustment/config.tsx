import * as yup from 'yup';
import AdvanceStockToggle from './AdvanceStockToggle';
import { SquareToggle } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import i18n from '~app/i18n/i18n';

export function yupSchema() {
  const { t } = i18n;
  return yup.object().shape({
    historical_cost: yup.number().when('sku_type', {
      is: 'stock',
      then: (schema) => schema.required(t('common:required_info') || ''),
    }),
  });
}

export function formSchema({
  sku_type,
  is_active,
  onStatusChange,
}: {
  sku_type: string;
  is_active: boolean;
  onStatusChange: (value: boolean) => void;
}) {
  const { t } = i18n;
  const isStock = sku_type === 'stock';

  const nonStockForm = [
    {
      type: 'block-container',
      name: 'first-col',
      className: 'pw-bg-neutral-white pw-p-4',
      children: [
        {
          type: 'block',
          name: 'first-block',
          className: 'pw-flex pw-justify-between',
          children: [
            {
              type: ComponentType.Label,
              key: 'is_active_label',
              name: 'is_active_label',
              isRequired: false,
              label: 'Tình trạng',
              className: '!pw-text-sm !pw-font-semibold !pw-text-neutral-primary !pw-mb-0 !pw-flex !pw-items-center',
            },
            {
              type: ComponentType.Custom,
              name: 'is_active',
              leftText: t('products-form:stocking_item'),
              rightText: t('products-form:out_of_stock_item'),
              leftTextActiveClassName: '!pw-bg-neutral-white !pw-text-primary-main',
              rightTextActiveClassName: '!pw-bg-neutral-white !pw-text-secondary-main',
              value: is_active,
              onClick: onStatusChange,
              component: SquareToggle,
            },
          ],
        },
        {
          type: 'block',
          name: 'second-block',
          className: 'pw-flex pw-justify-between pw-w-full pw-mt-6 ',
          children: [
            {
              type: ComponentType.Custom,
              key: 'track_inventory',
              name: 'track_inventory_label',
              className: 'pw-flex pw-justify-between pw-items-center pw-w-full',
              component: AdvanceStockToggle,
            },
          ],
        },
      ],
    },
  ];

  const stockForm = [
    {
      type: 'block-container',
      name: 'first-col',
      className: 'pw-bg-neutral-white pw-p-4',
      children: [
        {
          type: 'block',
          name: 'first-block',
          className: 'pw-flex pw-justify-between pw-w-full',
          children: [
            {
              type: ComponentType.Custom,
              key: 'track_inventory',
              name: 'track_inventory_label',
              className: 'pw-flex pw-justify-between pw-items-center pw-w-full',
              component: AdvanceStockToggle,
            },
          ],
        },
        {
          type: 'block',
          name: 'second-block',
          className: 'pw-grid pw-grid-cols-2 pw-mt-4 pw-gap-x-4',
          children: [
            {
              type: ComponentType.Currency,
              name: 'historical_cost',
              label: t('products-form:historical_cost'),
              className: 'pw-col-span-1',
              placeholder: '0',
              isRequired: true,
            },
            {
              type: ComponentType.DemicalInput,
              name: 'po_details.quantity',
              label: t('inventory-form:inventory'),
              className: 'pw-col-span-1',
              placeholder: '0',
            },
          ],
        },
      ],
    },
  ];

  return {
    className: '',
    type: 'container',
    name: 'form',
    children: isStock ? stockForm : nonStockForm,
  };
}
