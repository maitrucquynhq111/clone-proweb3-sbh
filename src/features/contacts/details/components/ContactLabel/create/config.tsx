import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';

export const contactLabelYupSchema = () => {
  const { t } = useTranslation('contact-form');
  return yup.object().shape({
    name: yup
      .string()
      .required(t('common:required_info') || '')
      .max(30, t('error.max_label_name') || '')
      .trim(t('common:required_info') || ''),
  });
};

export const contactLabelFormSchema = () => {
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
            className: `pw-col-span-12`,
            type: 'block',
            name: 'first-block',
            children: [
              {
                type: ComponentType.Text,
                isRequired: true,
                className: 'pw-col-span-12',
                labelClassName: 'pw-font-bold',
                label: t('label_name'),
                name: 'name',
                placeholder: t('placeholder.create_contact_label'),
              },
            ],
          },
        ],
      },
    ],
  };
};
