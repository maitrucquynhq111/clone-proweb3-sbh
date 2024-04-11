import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { PaymentSources } from '../components';
import { ContactInfo } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { formatPhoneWithZero } from '~app/utils/helpers';
import { MAX_PRICE } from '~app/utils/constants';

export const paymentYubSchema = () => {
  const { t } = useTranslation(['debtbook-form', 'common']);
  return yup.object().shape({
    amount: yup
      .number()
      .min(1, t('error.min_amount') || '')
      .max(MAX_PRICE, t('debtbook-form:error.max_length') || '')
      .test('max_amount', t('debtbook-form:error.max_amount') || '', function Validate(value) {
        const { max_amount } = this.parent;
        if (isNaN(+max_amount)) return true;
        if (value || value === 0) {
          if (+value <= +max_amount) return true;
          return false;
        }
        return true;
      })
      .typeError(t('products-form:error.type_number') || ''),
  });
};

export const paymentFormSchema = ({
  contact,
  isCashbook = false,
  isContactPayment = false,
  showContactInfo = true,
  onPaymentSourceChange,
}: {
  isCashbook: boolean;
  contact?: Contact;
  isContactPayment?: boolean;
  showContactInfo: boolean;
  onPaymentSourceChange(data: Payment): void;
}) => {
  const { t } = useTranslation(['cashbook-form', 'debtbook-form', 'common']);
  return {
    type: 'container',
    name: 'form',
    children: [
      {
        blockClassName: 'pw-pt-2 pw-pb-6 pw-px-4 pw-border-b-gray-100 pw-border-b pw-border-solid -pw-mx-4',
        type: 'block',
        name: 'first-block',
        visible: showContactInfo,
        children: [
          {
            type: ComponentType.Custom,
            key: 'contact-info',
            avatar: contact?.avatar,
            title: contact?.name,
            subTitle: formatPhoneWithZero(contact?.phone_number || ''),
            className: 'pw-gap-x-4 pw-items-center',
            titleClassName: 'pw-text-base pw-font-normal pw-text-black',
            subTitleClassName: 'pw-text-sm pw-font-normal pw-mt-1',
            component: ContactInfo,
          },
        ],
      },
      {
        blockClassName: `${showContactInfo ? 'pw-pt-6' : ''}`,
        type: 'block',
        name: 'second-block',
        children: [
          {
            type: ComponentType.Currency,
            labelClassName: 'pw-font-bold',
            label: t('amount').toUpperCase(),
            name: 'amount',
            isRequired: true,
            placeholder: '0.000',
          },
          {
            type: ComponentType.Checkbox,
            name: 'is_cashbook',
            className: 'pw-mt-1.5 -pw-ml-2',
            label: t('debtbook-form:cashbook_record'),
          },
          {
            type: ComponentType.Label,
            key: 'payment_source',
            className: 'pw-mt-1',
            visible: isCashbook ? true : false,
            label: t('debtbook-form:payment_source'),
          },
          {
            type: ComponentType.Custom,
            name: 'payment_sources',
            className: 'pw-mt-2',
            visible: isCashbook ? true : false,
            isContactPayment: isContactPayment,
            onChange: onPaymentSourceChange,
            component: PaymentSources,
          },
        ],
      },
    ],
  };
};
