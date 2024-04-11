import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { Button } from 'rsuite';
import {
  AutoMessageFormSchema,
  defaultAutoMessage,
  AutoMessageYupSchema,
  toPendingAutoMessage,
  SEND_TYPE,
} from './config';
import { Loading } from '~app/components';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { queryClient } from '~app/configs/client';
import { AUTO_MESSAGE_KEY, CURRENT_LINK_PAGE_KEY } from '~app/services/queries';
import { useUpdateAutoMessageMutation } from '~app/services/mutations';

type Props = {
  activePage: Page;
  detail: AutoMessageShorten | null;
  setActivePage(value: Page | null): void;
};

const AutoMessageDetails = ({ activePage, detail, setActivePage }: Props): JSX.Element => {
  const { t } = useTranslation('chat');
  const { mutateAsync } = useUpdateAutoMessageMutation();

  const methods = useForm<ReturnType<typeof defaultAutoMessage>>({
    resolver: yupResolver(AutoMessageYupSchema()),
    defaultValues: defaultAutoMessage(),
  });
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    clearErrors,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data: ReturnType<typeof defaultAutoMessage>) => {
    try {
      const { send_type, ...body } = data;
      const response = await mutateAsync({
        ...body,
        send_after: send_type === SEND_TYPE.SEND_NOW ? 0 : +body.send_after,
      });
      toast.success(t('success.setting_auto_message'));
      queryClient.invalidateQueries([AUTO_MESSAGE_KEY], { exact: false });
      setActivePage(response.business_has_page_res);
      queryClient.invalidateQueries([CURRENT_LINK_PAGE_KEY], { exact: false });
    } catch (_) {
      // TO DO
    }
  };

  useEffect(() => {
    if (detail) {
      reset(toPendingAutoMessage({ activePage, detail }));
    }
  }, [activePage, detail]);

  useEffect(() => {
    if (
      watch('send_type') === SEND_TYPE.SEND_AFTER &&
      errors.send_after?.message &&
      watch('send_after') >= 1 &&
      watch('send_after') <= 5
    ) {
      clearErrors('send_after');
    }
  }, [watch('send_type')]);

  return (
    <div>
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormLayout
          formSchema={AutoMessageFormSchema({
            is_apply: watch('business_has_page_setting')?.auto_message_enable || false,
            send_type: watch('send_type'),
            send_after: watch('send_after'),
            errorSendAfter: errors.send_after?.message || '',
            setValue,
          })}
        />
        <div className="pw-flex pw-justify-end pw-border-t pw-border-neutral-divider pw-mt-6 pw-pt-6">
          <Button
            appearance="ghost"
            size="lg"
            className="!pw-text-neutral-primary !pw-border-neutral-border !pw-font-bold pw-mr-3"
            onClick={() => detail && reset(toPendingAutoMessage({ activePage, detail }))}
          >
            {t('common:cancel')}
          </Button>
          <Button type="submit" appearance="primary" size="lg" className="!pw-font-bold">
            {t('common:update')}
          </Button>
        </div>
      </FormProvider>
      {isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-2000" /> : null}
    </div>
  );
};

export default AutoMessageDetails;
