import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';
import { ShortCutInput } from '~app/features/chat-configs/QuickMessage/components';
import { MessageContentControl } from '~app/features/chat-configs/components';
import { Dropzone } from '~app/components';

const MAX_SHORTCUT_LENGTH = 20;

export const quickMessageYupSchema = () => {
  const { t } = useTranslation(['common', 'chat']);
  return yup.object().shape({
    shortcut: yup
      .string()
      .required(t('required_info') || '')
      .matches(/^[a-zA-Z0-9]*$/g, t('chat:error.no_special_character') || '')
      .max(MAX_SHORTCUT_LENGTH, t('chat:max_shorcut_length') || ''),
    message: yup.string().required(t('required_info') || ''),
  });
};

export const quickMessageFormSchema = ({
  images = [],
  setValue,
}: {
  images: ExpectedAny[];
  setValue(name: string, value: ExpectedAny): void;
}) => {
  const { t } = useTranslation('chat');
  return {
    className: '',
    type: 'container',
    name: 'form',
    children: [
      {
        type: ComponentType.Custom,
        className: 'pw-col-span-12',
        label: t('shortcut_key'),
        name: 'shortcut',
        isRequired: true,
        maxLength: MAX_SHORTCUT_LENGTH,
        showMaxLength: true,
        placeholder: t('placeholder.shortcut'),
        component: ShortCutInput,
      },
      {
        type: ComponentType.Custom,
        className: 'pw-col-span-12 pw-mt-4',
        label: t('content'),
        name: 'message',
        isRequired: true,
        placeholder: t('placeholder.message_content'),
        maxLength: 1000,
        component: MessageContentControl,
      },
      {
        type: ComponentType.Label,
        key: 'label_images',
        name: 'images',
        className: 'pw-mt-4 pw-mb-1',
        isRequired: false,
        label: `${t('image')} (${images.length}/1)`,
      },
      {
        type: ComponentType.Custom,
        name: 'images',
        errorMessage: t('error.max_image_length_quick_message'),
        component: Dropzone,
        fileList: images,
        maxFiles: 1,
        canRemoveAll: false,
        onChange: (files: ExpectedAny) => {
          setValue('images', files);
        },
      },
    ],
  };
};

export const defaultQuickMessage = () => ({
  images: null,
  message: '',
  shortcut: '',
});
