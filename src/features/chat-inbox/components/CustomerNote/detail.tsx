import { toast } from 'react-toastify';
import { memo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import { customerNoteFormSchema, customerNoteYupSchema, defaultPendingNote } from './config';
import FormProvider from '~app/components/HookForm/FormProvider';
import FormLayout from '~app/components/HookForm/FormLayout';
import { queryClient } from '~app/configs/client';
import { CONTACT_NOTES_KEY } from '~app/services/queries';
import { useUpdateContactNoteMutation } from '~app/services/mutations';

type Props = {
  defaultNote: Note | null;
  onClose(): void;
};

const CustomerNoteDetail = ({ defaultNote, onClose }: Props) => {
  const { t } = useTranslation('contact-form');
  const { mutateAsync } = useUpdateContactNoteMutation();

  const methods = useForm<PendingNote>({
    resolver: yupResolver(customerNoteYupSchema()),
    defaultValues: defaultPendingNote,
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: PendingNote) => {
    try {
      await mutateAsync({
        id: defaultNote?.id || '',
        body: { ...data, contact_id: data?.contact_id || '' },
      });
      queryClient.invalidateQueries([CONTACT_NOTES_KEY], { exact: false });
      toast.success(t('success.update_contact_note'));
      onClose();
    } catch (error) {
      // TO DO
    }
  };

  useEffect(() => {
    if (!defaultNote) return;
    reset({
      contact_id: defaultNote?.contact_id || '',
      day: defaultNote?.day || '',
      note: defaultNote?.note || '',
    });
  }, [defaultNote]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <FormLayout formSchema={customerNoteFormSchema()} />
      <div className="pw-flex pw-gap-x-4 pw-mt-4 pw-justify-end">
        <Button onClick={onClose} className="pw-button-secondary !pw-py-1.5 !pw-px-6">
          <span className="pw-text-sm pw-font-bold pw-text-neutral-primary">{t('common:cancel')}</span>
        </Button>
        <Button type="submit" className="pw-button-primary !pw-py-1.5 !pw-px-6" loading={isSubmitting}>
          <span className="pw-text-sm pw-font-bold pw-text-neutral-white">{t('common:modal-confirm')}</span>
        </Button>
      </div>
    </FormProvider>
  );
};

export default memo(CustomerNoteDetail);
