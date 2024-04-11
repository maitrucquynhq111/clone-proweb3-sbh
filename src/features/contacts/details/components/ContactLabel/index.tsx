import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { toast } from 'react-toastify';
import { Tag } from 'rsuite';
import { useContactDetails } from '~app/features/contacts/hooks/useContactDetails';
import { ContactLabelSelect } from '~app/features/contacts/details/components';
import { toDefaultContact, toPendingContact } from '~app/features/contacts/utils';
import { queryClient } from '~app/configs/client';
import { CONTACT_DETAIL } from '~app/services/queries';
import { useUpdateContactMutation } from '~app/services/mutations';

const ContactLabel = () => {
  const { t } = useTranslation('contact-details');
  const { data } = useContactDetails();
  const { mutateAsync: updateContact } = useUpdateContactMutation();

  const handleChange = async ({
    selectedLabel,
    newLabels,
  }: {
    selectedLabel?: ContactLabel;
    newLabels?: ContactLabel[];
  }) => {
    if (!data) return;
    try {
      const pendingContact = toDefaultContact(data);
      const tags = selectedLabel ? data.contact_tag.filter((tag) => tag.id !== selectedLabel.id) : newLabels;
      Object.assign(pendingContact, { tags });
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
      className={cx('pw-border-b pw-border-b-neutral-border pw-pb-4', {
        '!pw-pb-6': !data?.contact_tag,
      })}
    >
      <div className="pw-flex pw-items-center pw-justify-between pw-mb-2">
        <h6 className="pw-text-lg pw-font-bold">{t('title.contact_label')}</h6>
        <ContactLabelSelect
          contactLabels={data?.contact_tag || []}
          onChange={(newLabels) => handleChange({ newLabels })}
        />
      </div>
      {!data?.contact_tag ? (
        <span className="pw-text-neutral-placeholder pw-text-sm">{t('empty_state.contact_label')}</span>
      ) : (
        (data?.contact_tag || []).map((tag) => (
          <Tag
            key={tag.id}
            closable
            className="tag-closable pw-mb-2 !pw-bg-neutral-divider !pw-text-base"
            onClose={(e) => {
              e.stopPropagation();
              handleChange({ selectedLabel: tag });
            }}
          >
            {tag.name}
          </Tag>
        ))
      )}
    </div>
  );
};

export default ContactLabel;
