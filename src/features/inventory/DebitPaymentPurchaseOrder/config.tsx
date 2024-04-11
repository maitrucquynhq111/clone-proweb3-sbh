import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';
import { formatCurrency } from '~app/utils/helpers';
import { PaymentSources } from '~app/features/debt/components';

export const debitPaymentYupSchema = () => {
  const { t } = useTranslation('purchase-order');
  return yup.object().shape({
    amount: yup.number().min(1, t('error.min_payment_amount') || ''),
    payment_method: yup.string(),
    payment_source_id: yup.string(),
    payment_source_name: yup.string(),
  });
};

export const debitPaymentDefault = ({
  detail,
  amount,
  paymentSource,
}: {
  detail?: InventoryDetail;
  amount?: number;
  paymentSource?: Payment;
}) => ({
  amount: amount || 0,
  po_code: detail?.po_code || '',
  contact_id: detail?.contact_info?.id || '',
  payment_method: paymentSource?.name || '',
  payment_source_id: paymentSource?.id || '',
  payment_source_name: paymentSource?.name || '',
});

type FormSchemaProps = {
  debtAmount: number;
  onPaymentSourceChange(data: Payment): void;
};

export const DebitPaymentPurchaseOrderFormSchema = ({ debtAmount, onPaymentSourceChange }: FormSchemaProps) => {
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
                label: formatCurrency(debtAmount),
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
                label: t('debt_paid'),
                name: 'amount',
                placeholder: '0',
                isRequired: true,
                isForm: true,
                max: debtAmount,
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
