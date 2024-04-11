import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';
import { formatCurrency } from '~app/utils/helpers';
import { DebitToggle } from '~app/features/orders/lists/components';
import { usePaymentSourcesQuery } from '~app/services/queries';

const paymentSourceInitStateFunc = () => ({
  page: 1,
  page_size: 10,
  type: 'default',
  sort: 'priority asc',
});

export const updateOrderYupSchema = () => {
  const { t } = useTranslation('common');
  return yup.object().shape({
    debit: yup.object().shape({
      buyer_pay: yup.number().required(t('required_info') || ''),
    }),
  });
};

type FormSchemaProps = {
  buyerPay: number;
  isDebit: boolean;
  paymentAmount: number;
};
export const updateOrderFormSchema = ({ buyerPay, isDebit, paymentAmount }: FormSchemaProps) => {
  const { t } = useTranslation('orders-form');
  let subTitle = {};
  if (isDebit) {
    subTitle = {
      className: `pw-col-span-12`,
      type: 'block',
      name: 'debt-block',
      children: [
        {
          type: ComponentType.Label,
          className: 'pw-col-span-12 pw-mt-1 pw-font-semibold pw-text-sm pw-text-amber-600',
          label: `${t('debt_amount')}: ${formatCurrency(paymentAmount - buyerPay)}`,
        },
      ],
    };
  }
  if (buyerPay > paymentAmount) {
    subTitle = {
      className: `pw-col-span-12`,
      type: 'block',
      name: 'debt-block',
      children: [
        {
          type: ComponentType.Label,
          className: 'pw-col-span-12 pw-mt-1 pw-font-semibold pw-text-sm pw-text-amber-600',
          label: `${t('change_money')}: ${formatCurrency(buyerPay - paymentAmount)}`,
        },
      ],
    };
  }
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
                label: t('amount_paid'),
                name: 'debit.buyer_pay',
                isRequired: true,
                placeholder: '0',
                ...{ additionalComponent: <DebitToggle /> },
              },
            ],
          },
          subTitle,
          {
            className: `pw-col-span-12 pw-mt-4`,
            type: 'block',
            name: 'payment-source-block',
            children: [
              {
                className: `pw-col-span-12 pw-mt-4`,
                type: ComponentType.RadioPicker,
                name: 'payment_source_id',
                label: t('payment_source') || '',
                labelName: 'payment_source_name',
                async: true,
                query: usePaymentSourcesQuery,
                labelKey: 'name',
                valueKey: 'id',
                initStateFunc: paymentSourceInitStateFunc,
              },
            ],
          },
        ],
      },
    ],
  };
};
