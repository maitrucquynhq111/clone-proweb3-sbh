import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Button } from 'rsuite';
import { LabelMessageFormSchema, LabelMessageYupSchema } from './config';
import { DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { defaultLabelMessage } from '~app/features/chat-configs/LabelMessage/create/config';
import { LABEL_MESSAGE_KEY } from '~app/services/queries';
import { queryClient } from '~app/configs/client';
import { useCreateLabelMessageMutation } from '~app/services/mutations';

type Props = {
  onSuccess: (id: string) => void;
  onClose: () => void;
};

const LabelMessageCreate = ({ onSuccess, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('chat');
  const { mutateAsync } = useCreateLabelMessageMutation();

  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<ReturnType<typeof defaultLabelMessage>>({
    resolver: yupResolver(LabelMessageYupSchema()),
    defaultValues: defaultLabelMessage(),
  });
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: ReturnType<typeof defaultLabelMessage>) => {
    try {
      setIsLoading(true);
      const response = await mutateAsync(data);
      onSuccess?.(response.id);
      setIsLoading(false);
      queryClient.invalidateQueries([LABEL_MESSAGE_KEY], { exact: false });
      toast.success(t('success.create_label'));
      onClose();
    } catch (_) {
      // TO DO
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (watch('color') && errors.color?.message) {
      clearErrors('color');
    }
  }, [watch('color')]);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t('action.create_label_conversation')} onClose={onClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white">
          <FormLayout
            formSchema={LabelMessageFormSchema({
              color: watch('color'),
              colorError: errors?.color?.message || '',
              setValue,
            })}
          />
        </DrawerBody>
        <DrawerFooter className="!pw-border-none !pw-shadow-revert">
          <Button onClick={onClose} className="pw-button-secondary !pw-py-3 !pw-px-6">
            <span className="pw-text-base pw-font-bold pw-text-neutral-primary">{t('common:cancel')}</span>
          </Button>
          <Button type="submit" className="pw-button-primary !pw-py-3 !pw-px-6">
            <span className="pw-text-base pw-font-bold pw-text-neutral-white">{t('common:modal-confirm')}</span>
          </Button>
        </DrawerFooter>
      </FormProvider>
      {isLoading ? <Loading backdrop={true} vertical={true} className="pw-z-2000" /> : null}
    </div>
  );
};

export default LabelMessageCreate;
