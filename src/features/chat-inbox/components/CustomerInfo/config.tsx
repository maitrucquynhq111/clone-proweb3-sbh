import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { LocationSelect } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { phoneNumberRegex } from '~app/utils/helpers/regexHelper';

export const customerInfoYupSchema = ({ isRequiredPhoneNumber = true }: { isRequiredPhoneNumber?: boolean }) => {
  const { t } = useTranslation('products-form');
  return yup.object().shape({
    name: yup.string().required(t('common:required_info') || ''),
    phone_number: isRequiredPhoneNumber
      ? yup
          .string()
          .required(t('common:required_info') || '')
          .matches(phoneNumberRegex, t('common:error_phone') || '')
      : yup.string().test('phone_number', t('common:error_phone') || '' || '', function Validate(value) {
          if (!value) return true;
          return value.match(phoneNumberRegex) ? true : false;
        }),
  });
};

type FormSchemaProps = {
  address_info: ExpectedAny;
  isRequiredPhoneNumber?: boolean;
  setValue(name: string, value: ExpectedAny): void;
};

export const customerFormSchema = ({ address_info, isRequiredPhoneNumber = true, setValue }: FormSchemaProps) => {
  const { t } = useTranslation('contact-form');
  return {
    className: '',
    type: 'container',
    name: 'form',
    children: [
      {
        name: 'first-row',
        type: 'block-container',
        className: 'pw-grid pw-grid-cols-12 pw-gap-4',
        children: [
          {
            type: ComponentType.Text,
            className: 'pw-col-span-6',
            label: t('contact_name'),
            name: 'name',
            isRequired: true,
            placeholder: t('placeholder.contact_name'),
          },
          {
            type: ComponentType.Text,
            className: 'pw-col-span-6',
            label: t('phone_number'),
            name: 'phone_number',
            isRequired: isRequiredPhoneNumber,
            placeholder: t('placeholder.phone_number'),
          },
        ],
      },
      {
        name: 'second-row',
        type: 'block-container',
        className: 'pw-mt-4',
        children: [
          {
            type: ComponentType.Label,
            name: 'address_label',
            key: 'address_label',
            className: 'pw-mb-1',
            label: t('pos:address'),
          },
          {
            type: ComponentType.Custom,
            name: 'address_info',
            value: address_info,
            onChange: (value: PendingAddressLocation) => setValue('address_info', value),
            component: LocationSelect,
          },
        ],
      },
    ],
  };
};

export type CustomerInfo = {
  id?: string;
  name: string;
  phone_number: string;
  address_info?: AddressInfo | null;
};

export const defaultFormSchema: CustomerInfo = {
  name: '',
  phone_number: '',
  address_info: null,
};

export const defaultAddressInfo: AddressInfo = {
  address: '',
  district_id: '',
  district_name: '',
  province_id: '',
  province_name: '',
  ward_id: '',
  ward_name: '',
};
