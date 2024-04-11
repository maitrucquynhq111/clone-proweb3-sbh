import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';
import { formatCurrency } from '~app/utils/helpers';
import { PaymentSources } from '~app/features/debt/components';

export const cancelPurchaseOrderYupSchema = () => {
  return yup.object().shape({
    refund_amount: yup.number(),
    save_to_cashbook: yup.boolean(),
    payment_source_id: yup.string(),
    payment_source_name: yup.string(),
  });
};

export const cancelPurchaseOrderDefault = ({
  refundAmount,
  paymentSource,
}: {
  refundAmount?: number;
  paymentSource?: Payment;
}) => ({
  refund_amount: refundAmount || 0,
  save_to_cashbook: true,
  payment_source_id: paymentSource?.id || '',
  payment_source_name: paymentSource?.name || '',
});

type FormSchemaProps = {
  paymentAmount: number;
  onPaymentSourceChange(data: Payment): void;
};

export const cancelPurchaseOrderFormSchema = ({ paymentAmount, onPaymentSourceChange }: FormSchemaProps) => {
  const { t } = useTranslation('purchase-order');
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
            className: `pw-col-span-12`,
            type: 'block',
            name: 'total-block',
            children: [
              {
                type: ComponentType.Label,
                className: 'pw-col-span-12 pw-font-bold !pw-text-2xl pw-text-secondary-main',
                labelClassName: 'pw-font-bold pw-text-2xl pw-text-secondary-main',
                label: formatCurrency(paymentAmount),
              },
            ],
          },
          {
            className: `pw-col-span-12 pw-mt-4`,
            type: 'block',
            name: 'currency-block',
            children: [
              {
                type: ComponentType.Currency,
                className: 'pw-col-span-12',
                labelClassName: 'pw-font-bold',
                label: t('refund'),
                name: 'refund_amount',
                placeholder: '0',
                max: paymentAmount,
              },
            ],
          },
          {
            className: `pw-col-span-12 pw-mt-4`,
            type: 'block',
            name: 'currency-block',
            children: [
              {
                type: ComponentType.Checkbox,
                name: 'save_to_cashbook',
                className: '-pw-ml-2',
                label: t('save_to_cashbook'),
              },
            ],
          },
          {
            className: `pw-col-span-12 pw-mt-4`,
            type: 'block',
            name: 'payment-source-block',
            children: [
              {
                type: ComponentType.Label,
                key: 'payment_source',
                label: t('payment_source'),
              },
              {
                type: ComponentType.Custom,
                name: 'payment_sources',
                className: 'pw-mt-2',
                paymentDefault: true,
                onChange: onPaymentSourceChange,
                component: PaymentSources,
              },
            ],
          },
        ],
      },
    ],
  };
};
