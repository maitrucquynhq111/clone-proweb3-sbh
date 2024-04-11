import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';
import { MessageContentControl } from '~app/features/chat-configs/components';
import { QUICK_MESSAGE_TYPE_CODE } from '~app/utils/constants';

export type CommentConfigType = {
  auto_hide_comment: boolean;
  auto_like_comment: boolean;
  auto_reply_comment: boolean;
  is_contain_number: boolean;
  is_contain_keyword: boolean;
  keywords: string[];
  comment_content: string;
};

export const defaultCommentConfig: CommentConfigType = {
  auto_hide_comment: false,
  auto_like_comment: false,
  auto_reply_comment: false,
  is_contain_number: false,
  is_contain_keyword: false,
  keywords: [],
  comment_content: '',
};

export const commentConfigYupSchema = () => {
  const { t } = useTranslation(['chat', 'common']);
  return yup.object().shape({
    comment_content: yup.string().when('auto_reply_comment', {
      is: true,
      then: (schema) => schema.required(t('common:required_info') || ''),
    }),
    keywords: yup.array().when('is_contain_keyword', {
      is: true,
      then: (schema) => schema.min(1, t('error.at_least_one_keyword') || ''),
    }),
  });
};

type FormSchemaProps = {
  autoHideComment: boolean;
  isContainKeyword: boolean;
  autoReplyComment: boolean;
};

export const commentConfigFormSchema = ({ autoHideComment, isContainKeyword, autoReplyComment }: FormSchemaProps) => {
  const { t } = useTranslation('chat');
  return {
    className: 'pw-p-6 pw-bg-neutral-white',
    type: 'container',
    name: 'form',
    children: [
      {
        className: 'pw-flex pw-gap-x-6',
        type: 'block-container',
        name: 'auto_hide_comment_block',
        children: [
          {
            type: ComponentType.Toggle,
            name: 'auto_hide_comment',
            className: 'blue-toggle',
          },
          {
            type: ComponentType.Label,
            name: 'auto_hide_comment_label',
            key: 'label_images',
            className: '!pw-text-base pw-text-neutral-primary pw-font-bold',
            label: `${t('auto_hide_comment')}`,
          },
        ],
      },
      {
        type: ComponentType.Checkbox,
        name: 'is_contain_number',
        className: 'pw-mt-1.5 -pw-ml-2',
        label: t('is_contain_number'),
        visible: autoHideComment,
      },
      {
        type: ComponentType.Checkbox,
        name: 'is_contain_keyword',
        className: 'pw-mt-1.5 pw-mb-1.5 -pw-ml-2',
        label: t('is_contain_keyword'),
        visible: autoHideComment,
      },
      {
        type: ComponentType.TagInput,
        name: 'keywords',
        placeholder: t('placeholder.keywords'),
        visible: autoHideComment && isContainKeyword,
      },
      {
        className: 'pw-flex pw-gap-x-6 pw-my-4',
        type: 'block-container',
        name: 'auto_like_comment_block',
        children: [
          {
            type: ComponentType.Toggle,
            name: 'auto_like_comment',
            className: 'blue-toggle',
          },
          {
            type: ComponentType.Label,
            name: 'auto_hide_comment_label',
            key: 'label_images',
            className: '!pw-text-base pw-text-neutral-primary pw-font-bold',
            label: `${t('auto_like_comment')}`,
          },
        ],
      },
      {
        className: 'pw-flex pw-gap-x-6 pw-mb-4',
        type: 'block-container',
        name: 'auto_reply_comment_block',
        children: [
          {
            type: ComponentType.Toggle,
            name: 'auto_reply_comment',
            className: 'blue-toggle',
          },
          {
            type: ComponentType.Label,
            name: 'auto_hide_comment_label',
            key: 'label_images',
            className: '!pw-text-base pw-text-neutral-primary pw-font-bold',
            label: `${t('auto_reply_comment')}`,
          },
        ],
      },
      {
        type: ComponentType.Custom,
        label: t('comment_content'),
        name: 'comment_content',
        placeholder: t('placeholder.comment_content'),
        maxLength: 1000,
        excludeTypes: [QUICK_MESSAGE_TYPE_CODE.CUSTOMER_PHONE, QUICK_MESSAGE_TYPE_CODE.SHOP_NAME],
        component: MessageContentControl,
        visible: autoReplyComment,
      },
    ],
  };
};
