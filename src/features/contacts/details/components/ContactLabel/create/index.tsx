import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { toast } from 'react-toastify';
import { contactLabelFormSchema, contactLabelYupSchema } from './config';
import { queryClient } from '~app/configs/client';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { CONTACTS_LABELS_KEY } from '~app/services/queries';
import { useCreateContactLabelMutation } from '~app/services/mutations';
import { defaultContactLabel } from '~app/features/contacts/utils';

type Props = {
  defaultName?: string;
  className?: string;
  onSuccess?: (data: ContactLabel) => void;
  onClose: () => void;
};

const ContactLabelCreate = ({ defaultName, className, onSuccess, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('contact-form');
  const { mutateAsync: createLabel } = useCreateContactLabelMutation();

  const methods = useForm<PendingContactLabel>({
    resolver: yupResolver(contactLabelYupSchema()),
    defaultValues: defaultContactLabel(defaultName),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: PendingContactLabel) => {
    try {
      const response = await createLabel(data);
      handleClose();
      onSuccess?.(response);
      queryClient.invalidateQueries([CONTACTS_LABELS_KEY], { exact: false });
      toast.success(t('success.create_contact_label'));
    } catch (_) {
      // TO DO
    }
  };

  return (
    <div className={className}>
      <p className="pw-text-base pw-font-bold pw-mb-4">{t('create_label')}</p>
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormLayout formSchema={contactLabelFormSchema()} />
        <div className="pw-flex pw-justify-end pw-mt-4 pw-mb-0.5">
          <Button
            appearance="ghost"
            className="!pw-border-neutral-divider !pw-text-neutral-primary pw-mr-4"
            onClick={handleClose}
          >
            <span>{t('common:cancel')}</span>
          </Button>
          <Button appearance="primary" type="submit" loading={isSubmitting}>
            <span>{t('common:modal-confirm')}</span>
          </Button>
        </div>
      </FormProvider>
    </div>
  );
};

export default ContactLabelCreate;
