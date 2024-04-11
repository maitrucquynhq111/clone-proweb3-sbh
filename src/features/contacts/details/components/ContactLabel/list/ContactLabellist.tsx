import { IconButton } from 'rsuite';
import { BsTrash } from 'react-icons/bs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { AutoResizeInput, ConfirmModal } from '~app/components';
import { useDeleteContactLabelMutation, useUpdateContactLabelMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import { CONTACTS_LABELS_KEY, CONTACT_DETAIL } from '~app/services/queries';

type Props = {
  list: PendingContactLabel[];
  setPage(page: number): void;
};

const MAX_NAME = 30;

const ContactLabellist = ({ list, setPage }: Props): JSX.Element => {
  const { t } = useTranslation('contact-form');
  const [selectedDelete, setSelectedDelete] = useState('');
  const [error, setError] = useState<{ message: string; index: number } | null>(null);
  const { mutateAsync: deleteLabel } = useDeleteContactLabelMutation();
  const { mutateAsync: updateLabel } = useUpdateContactLabelMutation();

  const handleBlur = async (newValue: string, label: PendingContactLabel, index: number) => {
    try {
      if (!newValue) return setError({ message: t('error.required_label_name') || '', index });
      if (newValue.length >= MAX_NAME) return setError({ message: t('error.max_label_name') || '', index });
      if (newValue !== label.name) {
        await updateLabel({ id: label.id, name: newValue });
        queryClient.invalidateQueries([CONTACTS_LABELS_KEY], { exact: false });
        toast.success(t('success.update_contact_label'));
        error && setError(null);
      }
    } catch (_) {
      // TO DO
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedDelete) {
      try {
        await deleteLabel(selectedDelete);
        queryClient.invalidateQueries([CONTACTS_LABELS_KEY], { exact: false });
        queryClient.invalidateQueries([CONTACT_DETAIL], { exact: false });
        toast.success(t('success.delete_contact_label'));
        setPage(1);
        setSelectedDelete('');
      } catch (error) {
        //
      }
    }
  };

  return (
    <>
      {list.map((label, index) => (
        <div key={label.id}>
          <div className="pw-flex pw-items-center pw-justify-between pw-border-b pw-border-b-neutral-divider pw-mb-1">
            <div className="pw-w-10/12">
              <AutoResizeInput
                name="name"
                placeholder=""
                defaultValue={label.name}
                onBlur={(newValue) => handleBlur(newValue, label, index)}
              />
            </div>
            <IconButton
              appearance="subtle"
              icon={<BsTrash size={24} className="pw-fill-neutral-secondary" />}
              onClick={() => setSelectedDelete(label?.id || '')}
            />
          </div>
          {error?.index === index && (
            <p className="pw-text-xs pw-font-semibold pw-text-error-active">{error.message}</p>
          )}
        </div>
      ))}
      {selectedDelete && (
        <ConfirmModal
          open={true}
          title={t('delete_contact_label')}
          description={t('delete_contact_label_description')}
          isDelete
          onConfirm={handleConfirmDelete}
          onClose={() => setSelectedDelete('')}
        />
      )}
    </>
  );
};

export default ContactLabellist;
