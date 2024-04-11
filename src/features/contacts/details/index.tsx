import { useTranslation } from 'react-i18next';
import { BsTrash } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { useState } from 'react';
import ContactDetails from './ContactDetails';
import { ConfirmModal, DrawerHeader } from '~app/components';
import { useDeleteContactMutation } from '~app/services/mutations';
import { CONTACTS_KEY } from '~app/services/queries';
import { queryClient } from '~app/configs/client';
import { useContactDetails } from '~app/features/contacts/hooks/useContactDetails';

const ContactDetailsPage = ({ onClose, id }: { onClose: () => void; id: string }): JSX.Element => {
  const { t } = useTranslation('contacts-table');
  const [openDelete, setOpenDelete] = useState(false);
  const { mutateAsync } = useDeleteContactMutation();
  const { data } = useContactDetails();

  const handleClose = () => {
    onClose();
    queryClient.invalidateQueries([CONTACTS_KEY], { exact: false });
  };

  const handleConfirmDelete = async () => {
    try {
      if (data) {
        await mutateAsync(data.id);
        queryClient.invalidateQueries([CONTACTS_KEY], { exact: false });
        toast.success(t('success.delete'));
        setOpenDelete(false);
        handleClose();
      }
    } catch (error) {
      // TO DO
    }
  };

  return (
    (id && (
      <>
        <DrawerHeader title={t('modal-title:detail-customer-debt')} onClose={handleClose} />
        <div className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden pw-bg-gray-100">
          <ContactDetails />
        </div>
        {openDelete && (
          <ConfirmModal
            open={true}
            title={t('delete_contact')}
            description={t(data?.debt_amount ? 'delete_contact_transaction_description' : 'delete_contact_description')}
            iconTitle={<BsTrash size={24} />}
            isDelete
            onConfirm={handleConfirmDelete}
            onClose={() => setOpenDelete(false)}
          />
        )}
      </>
    )) || <></>
  );
};
export default ContactDetailsPage;
