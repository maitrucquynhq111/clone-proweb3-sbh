import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useEffect, useMemo } from 'react';
import { Button } from 'rsuite';
import {
  AbsenceMessageFormSchema,
  defaultAbsenceMessage,
  AbsenceMessageYupSchema,
  toDefaultAbsenceMessage,
} from './config';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { queryClient } from '~app/configs/client';
import { CURRENT_LINK_PAGE_KEY } from '~app/services/queries';
import { useUpdateAbsenceMessageMutation } from '~app/services/mutations';
import { SEND_TYPE } from '~app/features/chat-configs/AutoMessage/config';

type Props = {
  linkedPages: Page[];
  detail: AbsenceMessageShorten | null;
};

const AbsenceMessageDetails = ({ linkedPages, detail }: Props): JSX.Element => {
  const { t } = useTranslation('chat');
  const { mutateAsync } = useUpdateAbsenceMessageMutation();

  const methods = useForm<ReturnType<typeof defaultAbsenceMessage>>({
    resolver: yupResolver(AbsenceMessageYupSchema()),
    defaultValues: defaultAbsenceMessage(),
  });

  const activePage = useMemo(() => {
    if (!detail) return null;
    return linkedPages.find((item) => item.id === detail.absent_message.business_has_page_id);
  }, [linkedPages, detail]);

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data: ReturnType<typeof defaultAbsenceMessage>) => {
    try {
      const { send_type, day_range, ...body } = data;
      await mutateAsync({
        ...body,
        send_after: send_type === SEND_TYPE.SEND_NOW ? 0 : +body.send_after,
      });
      queryClient.invalidateQueries([CURRENT_LINK_PAGE_KEY], { exact: false });
      toast.success(t('success.setting_absence_message'));
    } catch (_) {
      // TO DO
    }
  };

  useEffect(() => {
    if (detail && activePage) {
      reset(toDefaultAbsenceMessage({ activePage, detail }));
    }
  }, [activePage, detail]);

  return (
    <div>
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormLayout
          formSchema={AbsenceMessageFormSchema({
            dataForm: watch(),
            errorSendAfter: errors.send_after?.message || '',
            setValue,
          })}
        />
        <div className="pw-flex pw-justify-end pw-border-t pw-border-neutral-divider pw-mt-6 pw-pt-6">
          <Button
            appearance="ghost"
            size="lg"
            className="!pw-text-neutral-primary !pw-border-neutral-border !pw-font-bold pw-mr-3"
            // onClick={() => detail && reset(toDefaultAbsenceMessage({ activePage, autoMessage: detail }))}
          >
            {t('common:cancel')}
          </Button>
          <Button type="submit" appearance="primary" size="lg" className="!pw-font-bold" loading={isSubmitting}>
            {t('common:update')}
          </Button>
        </div>
      </FormProvider>
    </div>
  );
};

export default AbsenceMessageDetails;
