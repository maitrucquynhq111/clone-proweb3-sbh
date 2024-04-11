import * as yup from 'yup';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { FormSchema } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import {
  OrderItemTable,
  OrderStatusAndStaff,
  OrderSummary,
  ProductSelection,
  ContactList,
  PaymentHistory,
  OrderNote,
  OrderTracking,
  RefundHistory,
  RefundOrderSummary,
  RefundOrderTable,
} from '~app/features/orders/components';
import { formatCurrency } from '~app/utils/helpers';
import { usePaymentSourcesQuery } from '~app/services/queries';
import { OrderStatusType } from '~app/utils/constants';

const paymentSourceInitStateFunc = () => ({
  page: 1,
  page_size: 75,
});

export const orderFormSchema = ({
  isEdit,
  state,
}: {
  isEdit: boolean;
  state: string;
  idSelected?: string;
}): FormSchema => {
  const { t } = useTranslation(['orders-form', 'common']);
  return {
    className: 'pw-flex pw-gap-y-6 pw-flex-wrap',
    type: 'container',
    name: 'form',
    children: [
      {
        className: 'pw-w-full pw-flex pw-justify-between',
        name: 'first-row',
        type: 'block-container',
        children: [
          {
            type: ComponentType.Custom,
            name: 'state',
            className: 'pw-w-full',
            component: OrderStatusAndStaff,
          },
        ],
      },
      {
        className: 'pw-w-full pw-flex pw-justify-between pw-gap-4',
        name: 'second-row',
        type: 'block-container',
        children: [
          {
            blockClassName: 'pw-w-8/12 pw-h-max pw-p-6 pw-bg-white pw-rounded',
            type: 'block',
            title: t('product_info'),
            name: 'first-block',
            children: [
              {
                type: ComponentType.Custom,
                name: 'add-product',
                visible: isEdit,
                className: 'pw-w-8/12 pw-mb-4',
                component: ProductSelection,
              },
              {
                type: ComponentType.Custom,
                name: 'list-order-item',
                component: OrderItemTable,
              },
              {
                type: ComponentType.Custom,
                name: 'summary',
                className: 'pw-w-8/12 pw-ml-auto pw-mt-4',
                component: state === OrderStatusType.REFUND ? RefundOrderSummary : OrderSummary,
              },
            ],
          },
          {
            blockClassName: 'pw-w-4/12',
            type: 'block',
            name: 'second-block',
            children: [
              {
                blockClassName: 'pw-w-full pw-p-6 pw-bg-white pw-rounded pw-h-fit',
                type: 'block',
                title: t('customer_info'),
                name: 'contact-block',
                children: [
                  {
                    type: ComponentType.Custom,
                    name: 'buyer_info',
                    component: ContactList,
                  },
                ],
              },
              {
                blockClassName: 'pw-w-full pw-p-6 pw-bg-white pw-rounded pw-h-fit pw-mt-4',
                type: 'block',
                visible: state === OrderStatusType.WAITING_CONFIRM || state === OrderStatusType.CANCEL ? false : true,
                name: state === OrderStatusType.REFUND ? 'refund-payment-block' : 'payment-block',
                children: [
                  {
                    type: ComponentType.Custom,
                    name: 'payment_history',
                    component: state === OrderStatusType.REFUND ? RefundHistory : PaymentHistory,
                  },
                ],
              },
              {
                type: ComponentType.Custom,
                name: 'order-note',
                component: OrderNote,
              },
              {
                blockClassName: 'pw-w-full pw-p-6 pw-pb-0 pw-bg-white pw-rounded pw-h-fit pw-mt-4',
                type: 'block',
                title: t('order_status'),
                name: 'tracking-block',
                visible: state === OrderStatusType.REFUND || state === OrderStatusType.CANCEL ? false : true,
                children: [
                  {
                    type: ComponentType.Custom,
                    name: 'order_tracking',
                    component: OrderTracking,
                  },
                ],
              },
              {
                type: ComponentType.Custom,
                name: 'refund-orders',
                component: RefundOrderTable,
              },
            ],
          },
        ],
      },
    ],
  };
};

type PaymentDebtFormProps = { debtAmount: number; setValue(name: string, value: ExpectedAny): void };

export const paymentDebtFormSchema = ({ debtAmount, setValue }: PaymentDebtFormProps): FormSchema => {
  const { t } = useTranslation('orders-form');
  return {
    className: 'pw-rounded pw-bg-neutral-background pw-p-3',
    type: 'container',
    name: 'form',
    children: [
      {
        blockClassName: 'pw-col-span-12',
        className: `pw-grid pw-grid-cols-12 pw-gap-4 pw-relative`,
        type: 'block',
        name: 'first-block',
        children: [
          {
            type: ComponentType.Currency,
            className: 'pw-col-span-12',
            labelClassName: 'pw-font-bold',
            label: t('paid_amount'),
            name: 'amount',
            isRequired: true,
            placeholder: '0.000',
            max: debtAmount,
          },
        ],
      },
      {
        className: `pw-col-span-12 pw-mt-4`,
        type: ComponentType.RadioPicker,
        name: 'payment_source_id',
        label: t('payment_source') || '',
        labelName: 'name',
        async: true,
        query: usePaymentSourcesQuery,
        labelKey: 'name',
        valueKey: 'id',
        initStateFunc: paymentSourceInitStateFunc,
        onChange: (value: ExpectedAny) => {
          setValue('name', value.name);
          setValue('payment_method', value.name);
          setValue('payment_source_id', value.id);
        },
      },
    ],
  };
};

export const customerPaidYupSchema = () => {
  const { t } = useTranslation(['orders-form']);
  return yup.object().shape({
    amount: yup.number().min(1, t('error.customer_paid_amount') || ''),
  });
};

export const toPendingCustomerPaidDetail = ({
  id,
  debtAmount,
  paymentSource,
}: {
  id: string;
  debtAmount: number;
  paymentSource: Payment | null;
}) => ({
  order_id: id || '',
  amount: debtAmount,
  name: paymentSource?.name || '',
  payment_source_id: paymentSource?.id || '',
  payment_method: paymentSource?.name || '',
});

export const defaultCustomerPaid = () => ({
  order_id: '',
  business_id: '',
  amount: 0,
  name: '',
  payment_source_id: '',
  payment_method: '',
});

export const paymentHistoryColumnsConfig = ({ t, canViewPrice }: { t: ExpectedAny; canViewPrice: boolean }) => {
  let price = null;
  if (canViewPrice) {
    price = {
      key: 'amount',
      name: 'amount',
      label: t('total_price'),
      align: 'right',
      flexGrow: 1,
      cell: (props: ExpectedAny) => {
        const { rowData } = props;
        return <div className="pw-px-3">{formatCurrency(rowData.amount)}</div>;
      },
    };
  }
  return [
    {
      key: 'created_at',
      name: 'created_at',
      label: t('created_at'),
      width: 120,
      cell: (props: ExpectedAny) => {
        const { rowData } = props;
        return <div className="pw-px-3">{format(new Date(rowData.created_at), 'dd/MM HH:mm')}</div>;
      },
    },
    {
      key: 'name',
      name: 'name',
      label: t('method'),
      flexGrow: 1,
    },
    price,
  ];
};
