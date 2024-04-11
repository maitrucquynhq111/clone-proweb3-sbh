import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { toast } from 'react-toastify';
import { BsTrash } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { contactGroupFormSchema, contactGroupYupSchema } from '~app/features/contacts-groups/create/config';
import { ConfirmModal, DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import { queryClient } from '~app/configs/client';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { CONTACTS_GROUPS_KEY, useContactGroupDetailQuery } from '~app/services/queries';
import {
  useUpdateContactGroupMutation,
  useDeleteContactGroupMutation,
  useGenerateContactGroupCodeMutation,
} from '~app/services/mutations';
import { defaultContactGroup, toDefaultContactGroup, toPendingContactGroup } from '~app/features/contacts-groups/utils';

type Props = { detail: ContactGroup; onSuccess?: (data: ContactGroup) => void; onClose: () => void };

const ContactGroupUpdate = ({ detail, onSuccess, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('contact-group-form');
  const { data: groupDetail } = useContactGroupDetailQuery(detail.id);
  const { mutateAsync: updateGroup } = useUpdateContactGroupMutation();
  const { mutateAsync: generateGroupCode } = useGenerateContactGroupCodeMutation();
  const { mutateAsync: deleteGroup } = useDeleteContactGroupMutation();
  const [openConfirm, setOpenConfirm] = useState(false);

  const methods = useForm<ReturnType<typeof defaultContactGroup>>({
    resolver: yupResolver(contactGroupYupSchema()),
    defaultValues: defaultContactGroup(),
  });
  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: ReturnType<typeof defaultContactGroup>) => {
    if (groupDetail) {
      try {
        const body = toPendingContactGroup(data);
        if (body.name !== groupDetail.name) {
          body.code = await generateGroupCode(body.name);
        }
        const response = await updateGroup({ id: groupDetail.id, contact: body });
        handleClose();
        onSuccess?.(response);
        queryClient.invalidateQueries([CONTACTS_GROUPS_KEY], { exact: false });
        toast.success(t('success.update'));
      } catch (_) {
        // TO DO
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (groupDetail) {
      try {
        await deleteGroup(groupDetail.id);
        queryClient.invalidateQueries([CONTACTS_GROUPS_KEY], { exact: false });
        toast.success(t('success.delete'));
        handleClose();
      } catch (error) {
        // TO DO
      }
    }
  };

  useEffect(() => {
    if (groupDetail) {
      reset(toDefaultContactGroup(groupDetail));
    }
  }, [groupDetail]);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t('modal-title:update-contact-group')} onClose={handleClose} />
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
        <DrawerFooter className="pw-justify-between">
          <Button
            appearance="subtle"
            className="!pw-text-error-active !pw-font-bold"
            startIcon={<BsTrash size={24} />}
            onClick={() => setOpenConfirm(true)}
          >
            <span>{t('common:delete')}</span>
          </Button>
          <div className="pw-flex">
            <Button
              appearance="ghost"
              className="!pw-text-neutral-primary !pw-border-neutral-border !pw-font-bold pw-mr-4"
              onClick={handleClose}
            >
              <span>{t('common:cancel')}</span>
            </Button>
            <Button appearance="primary" type="submit" className="!pw-font-bold">
              <span>{t('common:modal-confirm')}</span>
            </Button>
          </div>
        </DrawerFooter>
      </FormProvider>
      {isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-[2000]" /> : null}
      {openConfirm && (
        <ConfirmModal
          open={true}
          title={t('delete_contact_group')}
          description={t('delete_contact_group_description')}
          isDelete
          onConfirm={handleConfirmDelete}
          onClose={() => setOpenConfirm(false)}
        />
      )}
    </div>
  );
};

export default ContactGroupUpdate;
