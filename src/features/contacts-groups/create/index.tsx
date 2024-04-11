import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { toast } from 'react-toastify';
import { contactGroupFormSchema, contactGroupYupSchema } from './config';
import { DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import { queryClient } from '~app/configs/client';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { CONTACTS_GROUPS_KEY } from '~app/services/queries';
import { useCreateContactGroupMutation, useGenerateContactGroupCodeMutation } from '~app/services/mutations';
import { defaultContactGroup, toPendingContactGroup } from '~app/features/contacts-groups/utils';

type Props = { onSuccess?: (data: ContactGroup) => void; onClose: () => void };

const ContactGroupCreate = ({ onSuccess, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('contact-group-form');
  const { mutateAsync: createGroup } = useCreateContactGroupMutation();
  const { mutateAsync: generateGroupCode } = useGenerateContactGroupCodeMutation();

  const methods = useForm<ReturnType<typeof defaultContactGroup>>({
    resolver: yupResolver(contactGroupYupSchema()),
    defaultValues: defaultContactGroup(),
  });
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: ReturnType<typeof defaultContactGroup>) => {
    try {
      const body = toPendingContactGroup(data);
      const code = await generateGroupCode(body.name);
      const response = await createGroup({ ...body, code });
      handleClose();
      onSuccess?.(response);
      queryClient.invalidateQueries([CONTACTS_GROUPS_KEY], { exact: false });
      toast.success(t('success.create'));
    } catch (_) {
      // TO DO
    }
  };

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t('modal-title:create-contact-group')} onClose={handleClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white">
          <FormLayout
            formSchema={contactGroupFormSchema({
              contact_ids: watch('contact_ids'),
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
      {isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-[2000]" /> : null}
    </div>
  );
};

export default ContactGroupCreate;
