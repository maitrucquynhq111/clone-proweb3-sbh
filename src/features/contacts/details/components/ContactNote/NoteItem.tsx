import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useState } from 'react';
import { BsPencilFill, BsTrash } from 'react-icons/bs';
import { TextInput } from '~app/components';
import { CONTACT_NOTES_KEY } from '~app/services/queries';
import { useUpdateContactNoteMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';

type Props = {
  note: Note;
  contactId: string;
  selected: { data: Note; action: string } | null;
  onClick(value: ExpectedAny): void;
};

const NoteItem = ({ note, contactId, selected, onClick }: Props) => {
  const { t } = useTranslation('contact-details');
  const [value, setValue] = useState('');
  const { mutateAsync: updateNote } = useUpdateContactNoteMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!selected) return;
    try {
      await updateNote({
        id: selected.data.id,
        body: { note: value, contact_id: contactId, day: new Date().toISOString() },
      });
      toast.success(t('success.update_note') || '');
      setValue('');
      onClick(null);
      queryClient.invalidateQueries([CONTACT_NOTES_KEY], { exact: false });
    } catch (error) {
      //
    }
  };

  return (
    <div className="pw-border-b pw-border-b-neutral-divider pw-py-3">
      <div className="pw-flex pw-items-center pw-justify-between pw-mb-1">
        <span className="pw-text-neutral-secondary pw-text-xs pw-font-semibold">
          {format(new Date(note.day), 'HH:mm dd/MM/yyyy')}
        </span>
        <div className="pw-flex pw-items-center">
          <span
            className="pw-cursor-pointer pw-mr-6"
            onClick={() => {
              if (note.id === selected?.data.id) return onClick(null);
              onClick({ data: note, action: 'update' });
              setValue(note.note);
            }}
          >
            <BsPencilFill size={20} className="pw-text-blue-primary" />
          </span>
          <span className="pw-cursor-pointer" onClick={() => onClick({ data: note, action: 'delete' })}>
            <BsTrash size={20} />
          </span>
        </div>
      </div>
      {!selected || selected.action === 'delete' ? (
        <p className="pw-text-sm">{note.note}</p>
      ) : (
        <>
          {selected.action === 'update' && selected.data.id === note.id && (
            <form onSubmit={handleSubmit}>
              <div className="pw-mt-2">
                <TextInput
                  name=""
                  isForm={false}
                  value={value}
                  autoFocus
                  onChange={(newValue) => setValue(newValue)}
                  onBlur={() => onClick(null)}
                  placeholder={t('placeholder.contact_note') || ''}
                />
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default NoteItem;
