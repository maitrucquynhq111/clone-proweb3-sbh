import * as yup from 'yup';
import { v4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { LabelKeywords, LabelPicker, LabelToggle } from './components';
import { ComponentType } from '~app/components/HookForm/utils';

export function autoLabelYupSchema() {
  const { t } = useTranslation('chat');
  return yup.object().shape({
    label_phone_value: yup
      .object()
      .when('auto_label_phone_enable', {
        is: true,
        then: (schema) => schema.required(t('common:required_info') || ''),
      })
      .nullable()
      .default(null),
    keyword_label: yup.array().when('auto_label_keyword_enable', {
      is: true,
      then: (schema) =>
        schema.of(
          yup.object().shape({
            keywords: yup.array().min(1, t('common:required_info') || ''),
            label: yup
              .object()
              .shape({})
              .required(t('common:required_info') || ''),
          }),
        ),
    }),
  });
}

export function autoLabelFormSchema({
  auto_label_phone_enable,
  auto_label_keyword_enable,
}: {
  auto_label_phone_enable: boolean;
  auto_label_keyword_enable: boolean;
}) {
  const { t } = useTranslation('chat');
  return {
    className: 'pw-grid pw-grid-cols-12 pw-gap-x-6',
    type: 'container',
    name: 'form',
    children: [
      {
        className: 'pw-col-span-12 pw-p-6 pw-pt-2 pw-border-b pw-border-solid pw-border-neutral-divider',
        name: 'first-row',
        type: 'block-container',
        children: [
          {
            type: ComponentType.Custom,
            className: `pw-col-span-12 ${auto_label_phone_enable ? 'pw-mb-4' : ''}`,
            name: 'auto_label_phone_enable',
            key: 'auto_label_phone_enable_key',
            component: LabelToggle,
            title: t('auto_label_phone_enable'),
            subTitle: t('auto_label_phone_enable_desc'),
          },
          {
            type: ComponentType.Label,
            name: 'label_value',
            key: 'label_value',
            isRequired: true,
            label: t('attact_label'),
            visible: auto_label_phone_enable,
          },
          {
            type: ComponentType.Custom,
            className: 'pw-max-w-5/12',
            key: 'label_phone_value',
            name: 'label_phone_value',
            component: LabelPicker,
            visible: auto_label_phone_enable,
          },
        ],
      },
      {
        className: 'pw-col-span-12 pw-p-6',
        name: 'second-row',
        type: 'block-container',
        children: [
          {
            type: ComponentType.Custom,
            className: `pw-col-span-12 ${auto_label_keyword_enable ? 'pw-mb-6' : ''}`,
            name: 'auto_label_keyword_enable',
            key: 'auto_label_keyword_enable_key',
            component: LabelToggle,
            title: t('auto_label_keyword_enable'),
            subTitle: t('auto_label_keyword_enable_desc'),
          },
          {
            type: ComponentType.Custom,
            className: 'pw-col-span-12',
            name: 'keyword_label',
            key: 'keyword_label_key',
            component: LabelKeywords,
            visible: auto_label_keyword_enable,
          },
        ],
      },
    ],
  };
}

export const defaultAutoLabel: PendingAutoLabel = {
  auto_label_phone_enable: false,
  label_phone_value: null,
  auto_label_keyword_enable: false,
  keyword_label: [
    {
      id: v4(),
      keywords: [],
      label: null,
    },
  ],
};
