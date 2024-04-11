import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';

export const skuInventoryYupSchema = () => {
  const { t } = useTranslation('common');
  return yup.object().shape({
    po_details: yup.object().shape({
      pricing: yup.number(),
      quantity: yup
        .number()
        .required(t('common:required_info') || '')
        .min(0, t('warehouse-table:error.min_quantity') || '')
        .test('quantity', t('warehouse-table:error.min_quantity') || '', function Validate(value) {
          const { quantity } = this.parent;
          if (isNaN(+quantity)) return true;
          if (!value || value === 0) return false;
          return true;
        })
        .typeError(t('common:required_info') || ''),
      blocked_quantity: yup
        .number()
        .test('quantity', t('products-form:error.blocked_quantity') || '', function Validate(value) {
          const { quantity } = this.parent;
          const formatQuantity = quantity.toString().replace('.', '');
          if (isNaN(+formatQuantity)) return true;
          if (value || value === 0) {
            if (+value <= +formatQuantity) return true;
            return false;
          }
          return true;
        })
        .typeError(t('products-form:error.type_number') || ''),
      warning_value: yup
        .number()
        .test('quantity', t('products-form:error.warning_value') || '', function Validate(value) {
          const { quantity } = this.parent;
          const formatQuantity = quantity.toString().replace('.', '');
          if (isNaN(+formatQuantity)) return true;
          if (value || value === 0) {
            if (+value <= +formatQuantity) return true;
            return false;
          }
          return true;
        }),
    }),
  });
};

export const skuInventoryFormSchema = () => {
  const { t } = useTranslation('inventory-form');
  return {
    className: 'pw-grid pw-grid-cols-12 pw-gap-x-4',
    type: 'container',
    name: 'form',
    children: [
      {
        className: 'pw-col-span-12',
        name: 'first-col',
        type: 'block-container',
        children: [
          {
            className: `pw-grid pw-grid-cols-2 pw-gap-4 pw-relative pw-mb-4`,
            type: 'block',
            name: 'first-block',
            children: [
              {
                type: ComponentType.Currency,
                className: 'pw-col-span-1',
                labelClassName: 'pw-font-bold',
                label: t('historical_cost'),
                name: 'po_details.pricing',
                placeholder: '0',
              },
              {
                type: ComponentType.DemicalInput,
                className: 'pw-col-span-1',
                labelClassName: 'pw-font-bold',
                label: t('inventory'),
                name: 'po_details.quantity',
                isRequired: true,
                isForm: true,
                placeholder: '0',
              },
            ],
          },
        ],
      },
    ],
  };
};

export const defaultSkuInventory = () => ({
  po_details: {
    pricing: 0,
    quantity: 0,
    blocked_quantity: 0,
    warning_value: 0,
  },
});

export const toDefaultSkuInventory = (sku: SkuInventory) => ({
  ...sku,
  po_details: {
    pricing: sku.historical_cost,
    quantity: 0,
    blocked_quantity: 0,
    warning_value: sku.warning_value,
  },
});

export const toPendingSkuInventory = (sku: PendingSkuInventory) => ({
  ...sku,
  historical_cost: sku.po_details.pricing,
  sku_type: 'stock',
});
