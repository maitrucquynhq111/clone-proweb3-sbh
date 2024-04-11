import * as yup from 'yup';
import { isAfter } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';
import { LocationSelect } from '~app/components';
import { ContactGroupSelect } from '~app/features/contacts/components';
import { validatePhone } from '~app/utils/helpers';

export const contactYupSchema = () => {
  const { t } = useTranslation(['contact-form']);
  return yup.object().shape({
    name: yup.string().required(t('common:required_info') || ''),
    phone_number: yup
      .string()
      .matches(/^\+?\d*$/, `${t('common:error_phone')}`)
      .test('phone_number', t('common:error_phone') || '', function Validate(value) {
        if (value && (isNaN(+value) || !validatePhone(value))) return false;
        return true;
      }),
    email: yup.string().email(t('error.email') || ''),
    group_of_contact_ids: yup.array(),
  });
};

type FormSchemaProps = {
  address_info: ExpectedAny;
  selectedGroups: ExpectedAny;
  disabled?: boolean;
  setValue(name: string, value: ExpectedAny): void;
};
export const contactFormSchema = ({ address_info, selectedGroups, disabled, setValue }: FormSchemaProps) => {
  const { t } = useTranslation('contact-form');
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
                type: ComponentType.Text,
                className: 'pw-col-span-6',
                labelClassName: 'pw-font-bold',
                label: t('contact_name'),
                name: 'name',
                isRequired: true,
                disabled,
                placeholder: t('placeholder.contact_name'),
              },
              {
                type: ComponentType.Text,
                className: 'pw-col-span-6',
                labelClassName: 'pw-font-bold',
                label: t('phone_number'),
                name: 'phone_number',
                disabled,
                placeholder: t('placeholder.phone_number'),
              },
            ],
          },
          {
            className: `pw-col-span-12 pw-mt-4`,
            type: 'block',
            name: 'group-block',
            children: [
              {
                type: ComponentType.Custom,
                className: 'pw-col-span-12',
                component: ContactGroupSelect,
                selectedGroups,
                onChange: (selectedGroups: ContactGroup[]) => setValue('group_of_contact_ids', selectedGroups),
              },
            ],
          },
          {
            className: `pw-col-span-12 pw-mt-4`,
            type: 'block',
            name: 'email-block',
            children: [
              {
                type: ComponentType.Text,
                className: 'pw-col-span-12',
                labelClassName: 'pw-font-bold',
                label: t('email'),
                name: 'email',
                placeholder: t('placeholder.email'),
              },
            ],
          },
          {
            blockClassName: 'pw-col-span-12 pw-mt-4',
            className: `pw-grid pw-grid-cols-12 pw-gap-4 pw-relative`,
            type: 'block',
            name: 'third-block',
            children: [
              {
                type: ComponentType.Date,
                className: 'pw-col-span-6',
                label: t('birthday'),
                name: 'birthday',
                placeholder: t('placeholder.birthday'),
                isForm: true,
                cleanable: false,
                disabledDate: (date: Date) => isAfter(date, new Date()),
              },
              {
                type: ComponentType.SelectPicker,
                className: 'pw-col-span-6',
                labelClassName: 'pw-font-bold',
                label: t('gender'),
                name: 'gender',
                placeholder: t('placeholder.gender'),
                searchable: false,
                data: [
                  {
                    label: t('male'),
                    value: 'male',
                  },
                  {
                    label: t('female'),
                    value: 'female',
                  },
                ],
              },
            ],
          },
          {
            className: `pw-col-span-12 pw-mt-4`,
            type: 'block',
            name: 'label-block',
            children: [
              {
                type: ComponentType.Label,
                className: 'pw-col-span-12',
                label: t('pos:address'),
              },
            ],
          },
          {
            blockClassName: 'pw-col-span-12',
            className: `pw-grid pw-grid-cols-12 pw-gap-4 pw-relative`,
            type: 'block',
            name: 'fourth-block',
            children: [
              {
                type: ComponentType.Custom,
                className: 'pw-col-span-12',
                name: 'address_info',
                value: address_info,
                onChange: (value: PendingAddressLocation) => setValue('address_info', value),
                component: LocationSelect,
              },
            ],
          },
        ],
      },
    ],
  };
};
