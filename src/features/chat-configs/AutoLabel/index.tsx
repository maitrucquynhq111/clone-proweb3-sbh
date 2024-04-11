import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { defaultAutoLabel, autoLabelFormSchema, autoLabelYupSchema } from './config';
import { DrawerBody, DrawerFooter, DrawerHeader } from '~app/components';
import FormProvider from '~app/components/HookForm/FormProvider';
import FormLayout from '~app/components/HookForm/FormLayout';
import { useGetAutoLabelQuery } from '~app/services/queries';
import { useUpdateAutoLabelMutation } from '~app/services/mutations';

type Props = {
  onClose(): void;
};

const AutoLabel = ({ onClose }: Props) => {
  const { t } = useTranslation('chat');
  const { data, isError } = useGetAutoLabelQuery();
  const { mutateAsync } = useUpdateAutoLabelMutation();

  const methods = useForm<PendingAutoLabel>({
    resolver: yupResolver(autoLabelYupSchema()),
    defaultValues: defaultAutoLabel,
  });
  const { handleSubmit, watch, reset } = methods;

  const onSubmit = async (data: PendingAutoLabel) => {
    try {
      const auto_label_settings: {
        keyword: string;
        label_id: string;
      }[] =
        data?.keyword_label?.map((item) => ({
          keyword: item?.keywords.join(',') || '',
          label_id: item.label?.id || '',
        })) || [];
      const body: AutoLabelBody = {
        auto_label_keyword_enable: data.auto_label_keyword_enable,
        auto_label_phone_number_enable: data.auto_label_phone_enable,
        auto_label_phone_number_label_id: data?.label_phone_value?.id || '',
        auto_label_settings: auto_label_settings,
      };
      await mutateAsync(body);
      toast.success(t('notification:update-success'));
      handleClose();
    } catch (error) {
      // TO DO
    }
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (isError) return;
    const keywordLabel: KeywordLabel[] =
      data?.auto_label_setting.map((item) => ({
        id: item.id,
        label: item.data,
        keywords: item.keyword.split(','),
      })) || [];
    const newData: PendingAutoLabel = {
      auto_label_keyword_enable: data?.auto_label_chat_setting.auto_label_keyword_enable || false,
      auto_label_phone_enable: data?.auto_label_chat_setting.auto_label_phone_number_enable || false,
      keyword_label: keywordLabel,
      label_phone_value: data?.auto_label_chat_setting?.auto_label_phone_number_label || null,
    };
    reset(newData);
  }, [data, isError]);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t('modal-title:auto-label')} onClose={handleClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white -pw-mx-4">
          <FormLayout
            formSchema={autoLabelFormSchema({
              auto_label_phone_enable: watch('auto_label_phone_enable'),
              auto_label_keyword_enable: watch('auto_label_keyword_enable'),
            })}
          />
        </DrawerBody>
        <DrawerFooter className="!pw-border-none !pw-shadow-revert">
          <Button onClick={handleClose} className="pw-button-secondary !pw-py-3 !pw-px-6">
            <span className="pw-text-base pw-font-bold pw-text-neutral-primary">{t('common:cancel')}</span>
          </Button>
          <Button type="submit" className="pw-button-primary !pw-py-3 !pw-px-6">
            <span className="pw-text-base pw-font-bold pw-text-neutral-white">{t('common:modal-confirm')}</span>
          </Button>
        </DrawerFooter>
      </FormProvider>
    </div>
  );
};

export default AutoLabel;
