import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';
import { ColorPicker } from '~app/features/chat-configs/LabelMessage/components';

export const LabelMessageYupSchema = () => {
  const { t } = useTranslation('common');
  return yup.object().shape({
    name: yup
      .string()
      .required(t('required_info') || '')
      .max(50, t('chat:max_label_length') || ''),
    color: yup.string().required(t('required_info') || ''),
  });
};

type Props = {
  color: string;
  colorError: string;
  setValue(type: string, value: ExpectedAny): void;
};

export const LabelMessageFormSchema = ({ color, colorError, setValue }: Props) => {
  const { t } = useTranslation('chat');
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
                className: 'pw-col-span-12',
                label: t('label_name'),
                name: 'name',
                isRequired: true,
                placeholder: t('placeholder.create_label'),
              },
            ],
          },
          {
            blockClassName: 'pw-col-span-12 pw-mt-4',
            type: 'block',
            name: 'second-block',
            children: [
              {
                type: ComponentType.Label,
                key: 'label_color',
                name: 'label_color',
                isRequired: true,
                label: t('select_label_color'),
              },
            ],
          },
          {
            blockClassName: 'pw-col-span-12 pw-mt-4',
            type: 'block',
            name: 'third-block',
            children: [
              {
                type: ComponentType.Custom,
                key: 'label_color',
                name: 'label_color',
                isRequired: true,
                defaultValue: color,
                colorError,
                onClick: (color: string) => setValue('color', color),
                component: ColorPicker,
              },
            ],
          },
        ],
      },
    ],
  };
};

export const defaultLabelMessage = () => ({
  name: '',
  color: '',
});
