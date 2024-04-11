import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';
import { formatCurrency } from '~app/utils/helpers';
import { usePaymentSourcesQuery } from '~app/services/queries';
import { DebitToggle } from '~app/features/orders/lists/components';

const paymentSourceInitStateFunc = () => ({
  page: 1,
  page_size: 10,
  type: 'default',
  sort: 'priority asc',
});

export const yupSchema = () => {
  const { t } = useTranslation('common');
  return yup.object().shape({
    payment_source_id: yup.string(),
    debit: yup.object().shape({
      buyer_pay: yup.number().required(t('required_info') || ''),
    }),
  });
};

export const formSchema = ({ amount, isDebit }: { amount: number; isDebit: boolean }) => {
  const { t } = useTranslation('orders-form');
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
                label: formatCurrency(amount),
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
                label: t('amount_refunded'),
                name: 'debit.buyer_pay',
                isRequired: true,
                placeholder: '0',
                max: amount,
                ...{ additionalComponent: isDebit ? null : <DebitToggle /> },
              },
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
      },
    ],
  };
};
