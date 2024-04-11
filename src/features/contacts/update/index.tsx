import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BsTrash } from 'react-icons/bs';
import { contactFormSchema, contactYupSchema } from '~app/features/contacts/create/config';
import { ConfirmModal, DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import { queryClient } from '~app/configs/client';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { CONTACTS_KEY, CONTACT_ANALYTIC_KEY, useContactDetailQuery } from '~app/services/queries';
import { defaultContact, isContactDefault, toDefaultContact, toPendingContact } from '~app/features/contacts/utils';
import { useDeleteContactMutation, useUpdateContactMutation } from '~app/services/mutations';

type Props = {
  contactNameDefault?: string;
  isRedirect?: boolean;
  hideDelete?: boolean;
  onSuccess?: (data: Contact) => void;
  onClose: () => void;
};

const ContactUpdate = ({ contactNameDefault, isRedirect, hideDelete, onSuccess, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('contact-form');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') as string;
  const { mutateAsync: updateContact } = useUpdateContactMutation();
  const { mutateAsync: deleteContact } = useDeleteContactMutation();
  const { data: contactDetail } = useContactDetailQuery(id);
  const [openConfirm, setOpenConfirm] = useState(false);
  const isDefault = useMemo(() => isContactDefault(contactDetail || null), [contactDetail]);

  const methods = useForm<ReturnType<typeof defaultContact>>({
    resolver: yupResolver(contactYupSchema()),
    defaultValues: defaultContact({ contactNameDefault }),
  });
  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: ReturnType<typeof defaultContact>) => {
    if (contactDetail) {
      try {
        const body = toPendingContact(data);
        const response = await updateContact({ id: contactDetail.id, contact: body });
        handleClose();
        onSuccess?.(response);
        queryClient.invalidateQueries([CONTACTS_KEY], { exact: false });
        toast.success(t('success.update'));
      } catch (_) {
        // TO DO
      }
    }
  };

  const handleDelete = async () => {
    try {
      if (contactDetail) {
        await deleteContact(contactDetail.id);
        queryClient.invalidateQueries([CONTACTS_KEY], { exact: false });
        queryClient.invalidateQueries([CONTACT_ANALYTIC_KEY], { exact: false });
        toast.success(t('contacts-table:success.delete'));
        isRedirect && navigate(-1);
        handleClose();
      }
    } catch (error) {
      // TO DO
    }
  };

  useEffect(() => {
    if (contactDetail) {
      reset(toDefaultContact(contactDetail));
    }
  }, [contactDetail]);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t('contact_details')} onClose={handleClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white">
          <FormLayout
            formSchema={contactFormSchema({
              address_info: watch('address_info'),
              selectedGroups: watch('group_of_contact_ids') || [],
              disabled: isDefault,
              setValue,
            })}
          />
        </DrawerBody>
        <DrawerFooter className="pw-justify-between">
          {!hideDelete ? (
            <Button
              appearance="subtle"
              className="!pw-text-error-active"
              startIcon={<BsTrash size={24} />}
              disabled={isDefault}
              onClick={() => setOpenConfirm(true)}
            >
              <span>{t('common:delete')}</span>
            </Button>
          ) : (
            <div />
          )}
          <div className="pw-flex">
            <Button appearance="ghost" className="pw-mr-4" onClick={handleClose}>
              <span>{t('common:cancel')}</span>
            </Button>
            <Button appearance="primary" type="submit">
              <span>{t('common:update')}</span>
            </Button>
          </div>
        </DrawerFooter>
      </FormProvider>
      {isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-[2000]" /> : null}
      {openConfirm && contactDetail && (
        <ConfirmModal
          open={true}
          title={t('contacts-table:delete_contact')}
          description={t(
            contactDetail.debt_amount
              ? 'contacts-table:delete_contact_transaction_description'
              : 'contacts-table:delete_contact_description',
          )}
          iconTitle={<BsTrash size={24} />}
          isDelete
          onConfirm={handleDelete}
          onClose={() => setOpenConfirm(false)}
        />
      )}
    </div>
  );
};

export default ContactUpdate;
