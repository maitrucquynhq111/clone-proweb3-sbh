import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { Tag } from 'rsuite';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useContactDetails } from '~app/features/contacts/hooks/useContactDetails';
import { queryClient } from '~app/configs/client';
import { CONTACT_DETAIL } from '~app/services/queries';
import { useUpdateContactMutation } from '~app/services/mutations';
import { toDefaultContact, toPendingContact } from '~app/features/contacts/utils';
import { ContactUpdateInline, ContactGroupSelect } from '~app/features/contacts/details/components';

const ContactGroup = () => {
  const { t } = useTranslation('contact-details');
  const [openUpdate, setOpenUpdate] = useState(false);
  const { data } = useContactDetails();
  const { mutateAsync: updateContact } = useUpdateContactMutation();

  const handleChange = async ({
    selectedGroup,
    newGroups,
  }: {
    selectedGroup?: GroupInContact;
    newGroups?: ContactGroup[];
  }) => {
    if (!data) return;
    try {
      const pendingContact = toDefaultContact(data);
      const group = selectedGroup ? data.contact_groups.filter((group) => group.id !== selectedGroup.id) : newGroups;
      Object.assign(pendingContact, {
        group_of_contact_ids: group,
      });
      const body = toPendingContact(pendingContact);
      await updateContact({ id: data.id, contact: body });
      queryClient.invalidateQueries([CONTACT_DETAIL], { exact: false });
      toast.success(t('contact-form:success.update'));
    } catch (error) {
      //
    }
  };

  return (
    <div
      className={cx('pw-border-b pw-border-b-neutral-border pw-mt-6 pw-pb-4', {
        '!pw-pb-6': !data?.contact_groups,
      })}
    >
      <div className="pw-flex pw-items-center pw-justify-between pw-mb-6">
        <h6 className="pw-text-lg pw-font-bold">{t('title.contact_group')}</h6>
        <ContactGroupSelect
          contactId={data?.id || ''}
          contactGroups={(data?.contact_groups as ExpectedAny) || []}
          onChange={(newGroups) => handleChange({ newGroups })}
        />
      </div>
      {!data?.contact_groups ? (
        <span className="pw-text-neutral-placeholder pw-text-sm">{t('empty_state.contact_group')}</span>
      ) : (
        (data?.contact_groups || []).map((group) => (
          <Tag
            key={group.id}
            closable
            className="tag-closable pw-mb-2 !pw-bg-neutral-divider !pw-text-base"
            onClose={(e) => {
              e.stopPropagation();
              handleChange({ selectedGroup: group });
            }}
          >
            {group.name}
          </Tag>
        ))
      )}
      {openUpdate && <ContactUpdateInline onClose={() => setOpenUpdate(false)} />}
    </div>
  );
};

export default ContactGroup;
