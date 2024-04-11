import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsTrash } from 'react-icons/bs';
import { RiPencilFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { ModalConfirm, ModalRefObject } from '~app/components';
import { queryClient } from '~app/configs/client';
import { CustomerNoteDetail } from '~app/features/chat-inbox/components';
import { useDeleteContactNoteMutation } from '~app/services/mutations';
import { CONTACT_NOTES_KEY } from '~app/services/queries';
import { formatDateToString } from '~app/utils/helpers';

type Props = {
  className?: string;
  showForm?: boolean;
  data: Note;
  onClick?(value: string): void;
};

const EditableCustomerNote = ({ data, showForm = true, onClick, className }: Props) => {
  const { t } = useTranslation('contact-form');
  const [isEdit, setIsEdit] = useState(false);
  const confirmModalRef = useRef<ModalRefObject>(null);
  const { mutateAsync } = useDeleteContactNoteMutation();

  const handleDelete = async () => {
    try {
      await mutateAsync(data.id);
      queryClient.invalidateQueries([CONTACT_NOTES_KEY], { exact: false });
      toast.success(t('success.delete_contact_note'));
    } catch (error) {
      // TO DO
    }
  };

  const handleOpenConfirmDelete = () => {
    const confirmModalData = {
      title: '',
      modalTitle: t('common:modal-confirm-title'),
      modalContent: t('common:ensure_to_perform'),
      acceptText: t('common:modal-confirm-accept-btn'),
      cancelText: t('common:modal-confirm-refuse-btn'),
      action: () => {
        handleDelete();
      },
    };
    confirmModalRef.current?.handleOpen(confirmModalData);
  };

  return (
    <div className={className}>
      {isEdit && showForm ? null : (
        <>
          <div className="pw-flex pw-justify-between pw-items-center">
            <span className="pw-text-xs pw-text-neutral-secondary pw-font-semibold">
              {formatDateToString(data.day, 'HH:mm dd/MM/yyyy')}
            </span>
            <div className="pw-flex pw-items-center pw-gap-x-6">
              <button onClick={handleOpenConfirmDelete}>
                <BsTrash size={20} className="pw-text-neutral-secondary" />
              </button>
              <button
                onClick={() => {
                  setIsEdit((prevState) => !prevState);
                  onClick?.(data?.id || '');
                }}
              >
                <RiPencilFill size={20} className="pw-text-neutral-secondary" />
              </button>
            </div>
          </div>
          <div className="pw-mt-1 pw-text-sm pw-text-neutral-primary">{data.note}</div>
        </>
      )}
      {isEdit && showForm ? <CustomerNoteDetail defaultNote={data} onClose={() => setIsEdit(false)} /> : null}
      <ModalConfirm ref={confirmModalRef} />
    </div>
  );
};

export default EditableCustomerNote;
