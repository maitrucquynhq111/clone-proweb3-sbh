import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { toast } from 'react-toastify';
import { contactFormSchema, contactYupSchema } from './config';
import { DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import { queryClient } from '~app/configs/client';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { CONTACTS_KEY, CONTACT_ANALYTIC_KEY } from '~app/services/queries';
import { defaultContact, toPendingContact } from '~app/features/contacts/utils';
import { useCreateContactMutation } from '~app/services/mutations/useCreateContactMutation';

type Props = { onSuccess?: (data: Contact) => void; onClose: () => void; contactNameDefault?: string };

const ContactCreate = ({ onSuccess, onClose, contactNameDefault }: Props): JSX.Element => {
  const { t } = useTranslation('contact-form');
  const { mutateAsync: createContactMutateAsync } = useCreateContactMutation();

  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<ReturnType<typeof defaultContact>>({
    resolver: yupResolver(contactYupSchema()),
    defaultValues: defaultContact({ contactNameDefault }),
  });
  const { handleSubmit, watch, setValue } = methods;

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: ReturnType<typeof defaultContact>) => {
    try {
      setIsLoading(true);
      const params = toPendingContact(data);
      const response = await createContactMutateAsync(params);
      setIsLoading(false);
      handleClose();
      onSuccess?.(response);
      queryClient.invalidateQueries([CONTACTS_KEY], { exact: false });
      queryClient.invalidateQueries([CONTACT_ANALYTIC_KEY], { exact: false });
      toast.success(t('success.create'));
    } catch (_) {
      // TO DO
      setIsLoading(false);
    }
  };

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t('modal-title:create-contact')} onClose={handleClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white">
          <FormLayout
            formSchema={contactFormSchema({
              address_info: watch('address_info'),
              selectedGroups: watch('group_of_contact_ids'),
              setValue,
            })}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button appearance="ghost" onClick={handleClose}>
            <span>{t('common:cancel')}</span>
          </Button>
          <Button appearance="primary" type="submit">
            <span>{t('common:modal-confirm')}</span>
          </Button>
        </DrawerFooter>
      </FormProvider>
      {isLoading ? <Loading backdrop={true} vertical={true} className="pw-z-[2000]" /> : null}
    </div>
  );
};

export default ContactCreate;
