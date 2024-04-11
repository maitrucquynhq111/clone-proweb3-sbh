import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';
import { ApplyToggle, MessageContentControl, SendTimeSelect } from '~app/features/chat-configs/components';

export enum SEND_TYPE {
  SEND_NOW = 'send_now',
  SEND_AFTER = 'send_after',
}

export const AutoMessageYupSchema = () => {
  const { t } = useTranslation('common');
  return yup.object().shape({
    message: yup
      .string()
      .required(t('required_info') || '')
      .max(1000, t('chat:max_auto_message_length') || ''),
    send_after: yup.number().when('send_type', {
      is: SEND_TYPE.SEND_AFTER,
      then: (schema) => schema.min(1, 'chat:error.max_send_time').max(5, 'chat:error.max_send_time'),
    }),
    send_type: yup.string(),
    business_has_page_setting: yup.object().shape({
      auto_message_enable: yup.boolean(),
      business_has_page_id: yup.string(),
    }),
  });
};

type Props = {
  is_apply: boolean;
  send_type: string;
  send_after: number;
  errorSendAfter: string;
  setValue(type: string, value: ExpectedAny): void;
};

export const AutoMessageFormSchema = ({ is_apply, send_type, send_after, errorSendAfter, setValue }: Props) => {
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
                type: ComponentType.Custom,
                className: 'pw-col-span-12',
                name: 'apply',
                title: t('apply_auto_message'),
                checked: is_apply,
                onChange: (value: boolean) => setValue('business_has_page_setting.auto_message_enable', value),
                component: ApplyToggle,
              },
            ],
          },
          {
            blockClassName: 'pw-col-span-12 pw-mt-4',
            type: 'block',
            name: 'second-block',
            children: [
              {
                type: ComponentType.Custom,
                className: 'pw-col-span-12 pw-mt-4',
                label: t('message_content'),
                labelClassName: 'pw-font-bold',
                name: 'message',
                placeholder: t('placeholder.message_content'),
                maxLength: 1000,
                component: MessageContentControl,
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
                name: 'send_after',
                send_type,
                send_after,
                error: errorSendAfter,
                onChangeTime: (value: string) => setValue('send_after', +value),
                onChangeType: (value: string) => setValue('send_type', value),
                component: SendTimeSelect,
              },
            ],
          },
        ],
      },
    ],
  };
};

export const defaultAutoMessage = () => ({
  message: '',
  send_after: 1,
  send_type: SEND_TYPE.SEND_AFTER,
  business_has_page_setting: {
    auto_message_enable: false,
    business_has_page_id: '',
  },
});

export const toPendingAutoMessage = ({ activePage, detail }: { activePage: Page; detail: AutoMessageShorten }) => ({
  message: detail.message,
  send_after: detail.send_after === 0 ? 1 : detail.send_after,
  send_type: detail.send_after === 0 ? SEND_TYPE.SEND_NOW : SEND_TYPE.SEND_AFTER,
  business_has_page_setting: {
    auto_message_enable: activePage.business_has_page_setting.auto_message_enable,
    business_has_page_id: activePage.id,
  },
});
