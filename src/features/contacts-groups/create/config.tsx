import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';
import { SettingConditions, ContactSelect } from '~app/features/contacts-groups/components';

const contactGroupConditionYupSchema = () => {
  const { t } = useTranslation('contact-group-form');
  return yup.object().shape({
    attribute: yup.string().required(t('common:required_info') || ''),
    condition: yup.string().required(t('common:required_info') || ''),
    value: yup.string().when('can_add_value', {
      is: true,
      then: (schema) => schema.required(t('common:required_info') || ''),
    }),
    sub_condition: yup.object().when('sub_conditions', {
      is: (val: ExpectedAny) => val && val.length > 0,
      then: (schema) =>
        schema.shape({
          condition: yup.string().required(t('common:required_info') || ''),
        }),
    }),
  });
};

export const contactGroupSettingYupSchema = () => {
  const { t } = useTranslation('contact-group-form');
  return yup.object().shape({
    name: yup
      .string()
      .required(t('common:required_info') || '')
      .max(30, t('error.max_name') || '')
      .trim(t('common:required_info') || ''),
    conditions: yup.array(contactGroupConditionYupSchema()).min(1, 'common:at_least_one'),
  });
};

export const contactGroupSettingFormSchema = () => {
  const { t } = useTranslation('contact-group-form');
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
            name: 'first-block',
            children: [
              {
                type: ComponentType.Text,
                isRequired: true,
                className: 'pw-col-span-12',
                labelClassName: 'pw-font-bold',
                label: t('contact_group_name'),
                name: 'name',
                placeholder: t('placeholder.name'),
              },
            ],
          },
          {
            className: `pw-col-span-12`,
            type: 'block',
            blockClassName: 'pw-mt-6',
            name: 'second-block',
            titleClassName: '!pw-pb-3',
            title: t('condition'),
            children: [
              {
                type: ComponentType.Custom,
                name: 'setting-conditions',
                component: SettingConditions,
              },
            ],
          },
        ],
      },
    ],
  };
};

export const contactGroupYupSchema = () => {
  const { t } = useTranslation('contact-group-form');
  return yup.object().shape({
    name: yup
      .string()
      .required(t('common:required_info') || '')
      .max(30, t('error.max_name') || '')
      .trim(t('common:required_info') || ''),
    code: yup.string(),
    contact_ids: yup.array(),
  });
};

type FormSchemaProps = {
  contact_ids: Contact[];
  setValue(name: string, value: ExpectedAny): void;
};

export const contactGroupFormSchema = ({ contact_ids = [], setValue }: FormSchemaProps) => {
  const { t } = useTranslation('contact-group-form');
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
            name: 'first-block',
            children: [
              {
                type: ComponentType.Text,
                isRequired: true,
                className: 'pw-col-span-12',
                labelClassName: 'pw-font-bold',
                label: t('contact_group_name'),
                name: 'name',
                placeholder: t('placeholder.name'),
              },
            ],
          },
          {
            className: `pw-col-span-12 pw-mt-4`,
            type: 'block',
            name: 'second-block',
            children: [
              {
                type: ComponentType.Custom,
                name: 'contacts',
                className: 'pw-col-span-12',
                contacts: contact_ids,
                onChange: (value: ExpectedAny) => {
                  setValue('contact_ids', value);
                },
                component: ContactSelect,
              },
            ],
          },
        ],
      },
    ],
  };
};
