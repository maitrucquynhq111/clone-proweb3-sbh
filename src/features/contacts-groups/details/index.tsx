import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { BsTrash } from 'react-icons/bs';
import { ContactGroupTabs } from './components';
import { ContactDetailTabKey, contactGroupDetailSchema } from './config';
import {
  ConfirmModal,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  FormLayout,
  FormProvider,
  Loading,
} from '~app/components';
import {
  CONTACTS_GROUPS_KEY,
  useContactGroupDetailQuery,
  useGetOrCreateGroupOfContactSetting,
} from '~app/services/queries';
import { contactGroupSettingYupSchema } from '~app/features/contacts-groups/create/config';
import { defaultContactGroupSetting, toPendingContactGroupSetting } from '~app/features/contacts-groups/utils';
import { isDeepEqual } from '~app/utils/helpers';
import {
  useDeleteContactGroupMutation,
  useGenerateContactGroupCodeMutation,
  useUpdateContactGroupMutation,
  useUpdateContactGroupSetting,
} from '~app/services/mutations';
import { queryClient } from '~app/configs/client';

type Props = { detail: ContactGroup; onClose: () => void };

const ContactGroupDetails = ({ detail, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('contact-group-form');
  const { data: contactGroupDetail } = useContactGroupDetailQuery(detail.id);
  const { data: contactGroupSetting, queryKey: contactGroupSettingQueryKey } = useGetOrCreateGroupOfContactSetting(
    detail.id,
  );
  const [activeTab, setActiveTab] = useState<ContactDetailTabKey>(ContactDetailTabKey.CONTACT_LIST_TAB);
  const [openExitModal, setOpenExitModal] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);

  const { mutateAsync: generateContactGroupCode } = useGenerateContactGroupCodeMutation();
  const { mutateAsync: updateContactGroup } = useUpdateContactGroupMutation();
  const { mutateAsync: updateContactGroupSetting } = useUpdateContactGroupSetting();
  const { mutateAsync: deleteContactGroup } = useDeleteContactGroupMutation();

  const methods = useForm<PendingContactGroupSetting>({
    resolver: yupResolver(contactGroupSettingYupSchema()),
    defaultValues: defaultContactGroupSetting,
  });

  const {
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    onClose();
  };

  const handleOpenExitModal = () => {
    if (!contactGroupDetail) return;
    const data = getValues();
    if (isDeepEqual(data, toPendingContactGroupSetting(contactGroupDetail, contactGroupSetting)) === false)
      return setOpenExitModal(true);
    handleClose();
  };

  const onSubmit = async (data: PendingContactGroupSetting) => {
    try {
      if (!contactGroupDetail) return;
      const body: PendingContactGroup = {
        name: data.name,
        code: contactGroupDetail?.code || '',
        contact_ids: data?.contact ? data.contact.map((contact: Contact) => contact.id) : [],
      };
      if (body.name !== contactGroupDetail.name) {
        body.code = await generateContactGroupCode(body.name);
      }
      const response = await updateContactGroup({ id: contactGroupDetail.id, contact: body });
      const conditions: ContactGroupSettingCondition[] = data.conditions.map((item) => {
        const condition: ContactGroupSettingCondition = {
          attribute: item.attribute,
          operator: item.operator,
          value: item.value || '',
          value_type: item.value_type || '',
        };
        if (item.sub_condition) {
          const sub_condition: ContactGroupSettingCondition = {
            attribute: item.attribute,
            operator: item.sub_condition.operator,
            value: item.sub_condition.value || '',
            value_type: item.sub_condition.value_type || '',
          };
          return { ...condition, sub_condition };
        }
        return condition;
      });
      const updateContactGroupSettingBody: UpdateContactGroupSettingBody = {
        group_of_contact_id: response.id,
        conditions: conditions,
      };
      await updateContactGroupSetting(updateContactGroupSettingBody);
      handleClose();
      queryClient.invalidateQueries([CONTACTS_GROUPS_KEY], { exact: false });
      queryClient.invalidateQueries(contactGroupSettingQueryKey, { exact: true });
      toast.success(t('success.update'));
    } catch (error) {
      // TO DO
    }
  };

  useEffect(() => {
    if (!contactGroupDetail) return;
    const data = toPendingContactGroupSetting(contactGroupDetail, contactGroupSetting);
    reset(data);
  }, [contactGroupDetail, contactGroupSetting]);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t('modal-title:contact-group-details')} onClose={() => handleOpenExitModal()} />
      <FormProvider className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden" methods={methods}>
        <ContactGroupTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <DrawerBody className="pw-bg-neutral-background">
          <FormLayout formSchema={contactGroupDetailSchema({ activeTab })} />
        </DrawerBody>
        <DrawerFooter className="pw-justify-between">
          <Button
            appearance="subtle"
            type="button"
            className="!pw-flex pw-gap-x-2"
            onClick={() => setOpenConfirmDeleteModal(true)}
          >
            <BsTrash className="pw-w-6 pw-h-6 pw-fill-red-600" />
            <span className="pw-text-red-600 pw-text-base pw-font-bold">{t('common:delete')}</span>
          </Button>
          <div className="pw-flex pw-items-center pw-gap-x-4">
            <Button type="button" className="pw-button-secondary !pw-py-2 !pw-px-6" onClick={handleOpenExitModal}>
              <span className="pw-text-sm pw-font-bold pw-text-neutral-primary">{t('common:cancel')}</span>
            </Button>
            <Button className="pw-button-primary !pw-py-2 !pw-px-6" onClick={() => handleSubmit(onSubmit)()}>
              <span className="pw-text-sm pw-font-bold pw-text-neutral-white">{t('common:modal-confirm')}</span>
            </Button>
          </div>
        </DrawerFooter>
      </FormProvider>
      <ConfirmModal
        open={openExitModal}
        title={t('modal.exit_without_save_title')}
        description={t('modal.exit_without_save_desc')}
        confirmText={t('common:modal-confirm-accept-btn') || ''}
        cancelText={t('common:modal-confirm-refuse-btn') || ''}
        backdropClassName="!pw-z-[1050]"
        size="sm"
        className="!pw-flex !pw-absolute !-pw-translate-x-1/2 xl:-pw-translate-y-1/2 xl:pw-top-1/2 pw-left-1/2
            pw-items-center pw-justify-center xl:!pw-my-0 center-modal !pw-z-2000"
        onConfirm={() => handleClose()}
        onClose={() => setOpenExitModal(false)}
      />
      <ConfirmModal
        open={openConfirmDeleteModal}
        isDelete
        title={t('modal.delete_group_title')}
        iconTitle={<BsTrash size={24} />}
        description={t('modal.delete_group_desc')}
        confirmText={t('common:delete') || ''}
        cancelText={t('common:back') || ''}
        backdropClassName="!pw-z-[1050]"
        size="xs"
        className="!pw-flex !pw-absolute !-pw-translate-x-1/2 xl:-pw-translate-y-1/2 xl:pw-top-1/2 pw-left-1/2
          pw-items-center pw-justify-center xl:!pw-my-0 center-modal !pw-z-2000"
        onConfirm={async () => {
          if (!contactGroupDetail) return;
          await deleteContactGroup(contactGroupDetail.id);
          queryClient.invalidateQueries([CONTACTS_GROUPS_KEY], { exact: false });
          toast.success(t('success.delete'));
          handleClose();
        }}
        onClose={() => setOpenConfirmDeleteModal(false)}
      />
      {isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-2000" /> : null}
    </div>
  );
};

export default ContactGroupDetails;
