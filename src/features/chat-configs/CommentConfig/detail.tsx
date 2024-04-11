import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import { CommentConfigType, commentConfigFormSchema, commentConfigYupSchema, defaultCommentConfig } from './config';
import FormProvider from '~app/components/HookForm/FormProvider';
import FormLayout from '~app/components/HookForm/FormLayout';
import { useUpdateCommentSettingMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import { CURRENT_LINK_PAGE_KEY } from '~app/services/queries';

type Props = {
  activePage: Page | null;
};

const CommentConfigDetail = ({ activePage }: Props) => {
  const { t } = useTranslation('');
  const { mutateAsync } = useUpdateCommentSettingMutation();

  const methods = useForm<CommentConfigType>({
    resolver: yupResolver(commentConfigYupSchema()),
    defaultValues: defaultCommentConfig,
  });

  const { handleSubmit, watch, reset } = methods;

  const onSubmit = async (data: CommentConfigType) => {
    try {
      let keywords = '';
      if (data.is_contain_number) {
        keywords = '[phone_number]';
      }
      if (data.is_contain_keyword) {
        keywords = `${keywords ? keywords + ',' : ''}${data.keywords.join(',')}`;
      }
      const body: CommentSettingBody = {
        auto_hide_comment_enable: data.auto_hide_comment,
        auto_reply_comment_enable: data.auto_reply_comment,
        auto_like_comment_enable: data.auto_like_comment,
        auto_reply_content: data.comment_content,
        business_has_page_id: activePage?.id || '',
        hide_comment_keyword: data.auto_hide_comment ? keywords : '',
      };
      await mutateAsync(body);
      queryClient.invalidateQueries([CURRENT_LINK_PAGE_KEY], { exact: false });
      toast.success(t('notification:update-success'));
    } catch (_) {
      // TO DO
    }
  };

  const handleCancel = () => {
    const setting = activePage?.business_has_page_setting;
    if (setting) {
      const is_contain_number = setting?.hide_comment_keyword.includes('[phone_number]');
      const isMultipleKeywords = setting?.hide_comment_keyword.includes('[phone_number],');
      const defaultValue: CommentConfigType = {
        is_contain_number,
        auto_hide_comment: setting?.auto_hide_comment_enable,
        auto_like_comment: setting?.auto_like_comment_enable,
        auto_reply_comment: setting?.auto_reply_comment_enable,
        is_contain_keyword: setting?.hide_comment_keyword.replace('[phone_number]', '') ? true : false,
        keywords: setting?.hide_comment_keyword
          ? setting?.hide_comment_keyword
              .replace(isMultipleKeywords ? '[phone_number],' : '[phone_number]', '')
              .split(',')
              .filter((s) => s)
          : [],
        comment_content: setting?.auto_reply_content,
      };
      reset(defaultValue);
    }
  };

  useEffect(() => {
    const setting = activePage?.business_has_page_setting;
    if (setting) {
      const is_contain_number = setting?.hide_comment_keyword.includes('[phone_number]');
      const isMultipleKeywords = setting?.hide_comment_keyword.includes('[phone_number],');
      const defaultValue: CommentConfigType = {
        is_contain_number,
        auto_hide_comment: setting?.auto_hide_comment_enable,
        auto_like_comment: setting?.auto_like_comment_enable,
        auto_reply_comment: setting?.auto_reply_comment_enable,
        is_contain_keyword: setting?.hide_comment_keyword.replace('[phone_number]', '') ? true : false,
        keywords: setting?.hide_comment_keyword
          ? setting?.hide_comment_keyword
              .replace(isMultipleKeywords ? '[phone_number],' : '[phone_number]', '')
              .split(',')
              .filter((s) => s)
          : [],
        comment_content: setting?.auto_reply_content,
      };
      reset(defaultValue);
    } else {
      reset(defaultCommentConfig);
    }
  }, [activePage]);

  return (
    <div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          formSchema={commentConfigFormSchema({
            autoHideComment: watch('auto_hide_comment'),
            autoReplyComment: watch('auto_reply_comment'),
            isContainKeyword: watch('is_contain_keyword'),
          })}
        />
        <div className="pw-flex pw-justify-end pw-px-6 pw-py-4 pw-shadow-revert">
          <Button
            appearance="ghost"
            size="lg"
            className="!pw-text-neutral-primary !pw-border-neutral-border !pw-font-bold pw-mr-3"
            onClick={handleCancel}
          >
            {t('common:cancel')}
          </Button>
          <Button type="submit" appearance="primary" size="lg" className="!pw-font-bold">
            {t('common:update')}
          </Button>
        </div>
      </FormProvider>
    </div>
  );
};

export default CommentConfigDetail;
