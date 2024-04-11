import * as yup from 'yup';
import { isBefore } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { CashBookType, MAX_PRICE } from '~app/utils/constants';
import {
  CreateCashbookCategory,
  CreatePaymentSource,
  DebitToggle,
  ContactList,
} from '~app/features/cashbook/components';
import { Dropzone } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { useCashbookCategoriesQuery, useContactsQuery, usePaymentSourcesQuery } from '~app/services/queries';
import { useHasPermissions, OtherPermision, MoneyPermission } from '~app/utils/shield';

const paymentSourceInitStateFunc = () => ({
  page: 1,
  page_size: 75,
});

const cashbookCategoriesInitStateFunc = ({ type }: { type: string }) => ({
  page: 1,
  page_size: 75,
  type,
});

const contactsInitStateFunc = () => ({
  page: 1,
  page_size: 75,
});

export const cashbookYupSchema = () => {
  const { t } = useTranslation(['cashbook-form']);
  return yup.object().shape({
    contact_id: yup.string().when('is_debit', {
      is: true,
      then: (schema) => schema.required(t('common:required_info') || ''),
    }),
    amount: yup
      .number()
      .min(1, t('error.min_amount') || '')
      .max(MAX_PRICE, t('products-form:error.max_length') || '')
      .typeError(t('products-form:error.type_number') || ''),
  });
};

export const cashbookFormSchema = ({
  is_debit = false,
  images = [],
  transaction_type,
  setValue,
}: {
  is_debit: boolean;
  images: ExpectedAny;
  transaction_type?: string;
  setValue(name: string, value: ExpectedAny): void;
}) => {
  const { t } = useTranslation('cashbook-form');
  const canCreateDebt = useHasPermissions([OtherPermision.DEBT_LIST_ALL_VIEW]);
  const canCreateMoneySource = useHasPermissions([MoneyPermission.MONEY_SOURCE_CREATE]);
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
            blockClassName: 'pw-col-span-12',
            className: `pw-grid pw-grid-cols-12 pw-gap-4 pw-relative`,
            type: 'block',
            name: 'first-block',
            children: [
              {
                type: ComponentType.Currency,
                className: 'pw-col-span-12',
                labelClassName: 'pw-font-bold',
                label: is_debit ? (transaction_type === CashBookType.IN ? t('received') : t('gave')) : t('amount'),
                name: 'amount',
                isRequired: true,
                placeholder: '0.000',
                ...(canCreateDebt ? { additionalComponent: <DebitToggle /> } : {}),
              },
            ],
          },
          {
            blockClassName: 'pw-col-span-12 pw-p-3 pw-mt-4 pw-bg-blue-50 pw-rounded',
            type: 'block',
            name: 'customer-block',
            visible: is_debit ? true : false,
            children: [
              {
                type: ComponentType.Custom,
                name: 'contact_id',
                valueName: 'contact_id',
                labelName: 'contact_name',
                valueKey: 'id',
                labelKey: 'name',
                isRequired: true,
                searchKey: 'search',
                label: t('contact'),
                placeholder: t('placeholder.contact'),
                initStateFunc: contactsInitStateFunc,
                query: useContactsQuery,
                component: ContactList,
              },
              {
                className: 'pw-mt-4',
                type: ComponentType.Date,
                label: t('reminder_day'),
                name: 'reminder_day',
                isForm: true,
                cleanable: false,
                disabledDate: (date: Date) => isBefore(date, new Date()),
              },
            ],
          },
          {
            className: `pw-col-span-12 pw-mt-4`,
            type: ComponentType.RadioPicker,
            name: 'payment_source_id',
            label: t('payment_source') || '',
            labelName: 'payment_source_name',
            placeholder: t('placeholder.payment_source') || '',
            async: true,
            query: usePaymentSourcesQuery,
            labelKey: 'name',
            valueKey: 'id',
            visible: is_debit ? false : true,
            ...(canCreateMoneySource
              ? {
                  creatable: true,
                  createComponent: CreatePaymentSource,
                  createText: t('action.create_payment'),
                }
              : {}),
            initStateFunc: paymentSourceInitStateFunc,
          },
          {
            blockClassName: 'pw-col-span-12',
            className: `pw-grid pw-grid-cols-12 pw-gap-4 pw-mt-4`,
            type: 'block',
            name: 'second-block',
            children: [
              {
                type: ComponentType.Date,
                className: is_debit ? 'pw-col-span-12' : 'pw-col-span-6',
                label: t('placeholder.transaction_time'),
                name: 'day',
                isForm: true,
                cleanable: false,
              },
              {
                className: `pw-col-span-6`,
                type: ComponentType.RadioPicker,
                label: t('category') || '',
                name: 'category_id',
                labelName: 'category_name',
                placeholder: t('placeholder.category') || '',
                async: true,
                labelKey: 'name',
                valueKey: 'id',
                creatable: true,
                createText: t('action.create_category'),
                visible: is_debit ? false : true,
                query: useCashbookCategoriesQuery,
                createComponent: CreateCashbookCategory,
                initStateFunc: () =>
                  cashbookCategoriesInitStateFunc({
                    type: transaction_type || 'in',
                  }),
              },
              {
                type: ComponentType.Text,
                as: 'textarea',
                rows: 3,
                className: 'pw-col-span-12',
                label: t('description'),
                name: 'description',
                placeholder: t('placeholder.description'),
              },
            ],
          },
          {
            blockClassName: 'pw-col-span-12 pw-mt-4',
            type: 'block',
            name: t('trasaction_images'),
            subTitle: '',
            children: [
              {
                type: ComponentType.Label,
                key: 'label_images',
                name: 'images',
                isRequired: false,
                label: `${t('transaction_images')} (${images.length}/4)`,
              },
              {
                type: ComponentType.Custom,
                name: 'images',
                errorMessage: t('error.max_image_length'),
                component: Dropzone,
                maxFiles: 4,
                fileList: images,
                onChange: (files: ExpectedAny) => {
                  setValue('images', files);
                },
              },
            ],
          },
        ],
      },
    ],
  };
};
