import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { Button } from 'rsuite';
import NoteItem from './NoteItem';
import { useContactDetails } from '~app/features/contacts/hooks/useContactDetails';
import { ConfirmModal, TextInput } from '~app/components';
import { CONTACT_NOTES_KEY, useGetContactNotesQuery } from '~app/services/queries';
import {
  useCreateContactNoteMutation,
  useDeleteContactNoteMutation,
  useUpdateContactNoteMutation,
} from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';

const ContactNote = () => {
  const { t } = useTranslation('contact-details');
  const { data } = useContactDetails();
  const [page, setPage] = useState(1);
  const [value, setValue] = useState('');
  const [updateValue, setUpdateValue] = useState('');
  const [listNote, setListNote] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<{ data: Note; action: string } | null>(null);
  const { data: notes } = useGetContactNotesQuery({ page, page_size: 3, contact_id: data?.id || '' });
  const { mutateAsync: createNote } = useCreateContactNoteMutation();
  const { mutateAsync: updateNote } = useUpdateContactNoteMutation();
  const { mutateAsync: deleteNote } = useDeleteContactNoteMutation();

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleSubmit = async (e: React.SyntheticEvent, action: string) => {
    e.preventDefault();
    if (!data) return;
    try {
      if (action === 'create') {
        await createNote({ note: value, contact_id: data.id, day: new Date().toISOString() });
        toast.success(t('success.create_note') || '');
        setValue('');
      }
      if (action === 'update' && selectedNote) {
        await updateNote({
          id: selectedNote?.data.id,
          body: { note: updateValue, contact_id: data.id, day: new Date().toISOString() },
        });
        toast.success(t('success.update_note') || '');
        setUpdateValue('');
        setSelectedNote(null);
      }
      queryClient.invalidateQueries([CONTACT_NOTES_KEY], { exact: false });
    } catch (error) {
      //
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedNote) {
      try {
        await deleteNote(selectedNote.data.id);
        toast.success(t('success.delete_note'));
        queryClient.invalidateQueries([CONTACT_NOTES_KEY], { exact: false });
        setListNote((prevState) => prevState.filter((note) => note.id !== selectedNote.data.id));
        setSelectedNote(null);
      } catch (error) {
        //
      }
    }
  };

  useEffect(() => {
    if (!notes?.data) return;
    if (page > 1) {
      setListNote((prevState) => removeDuplicates([...prevState, ...notes.data], 'id'));
    } else {
      setListNote(notes.data);
    }
  }, [notes, page]);

  return (
    <div className="pw-mt-6">
      <h6 className="pw-text-lg pw-font-bold pw-mb-3">{`${t('title.note')} ${
        notes?.meta && notes?.meta.total_rows > 0 ? `(${notes.meta.total_rows})` : ''
      }`}</h6>
      <form onSubmit={(e) => handleSubmit(e, 'create')}>
        <TextInput
          name=""
          isForm={false}
          value={value}
          onChange={handleChange}
          placeholder={t('placeholder.contact_note') || ''}
        />
      </form>
      {data &&
        listNote.map((note) => (
          <NoteItem note={note} contactId={data.id} selected={selectedNote} onClick={setSelectedNote} />
        ))}
      {notes?.data && notes.data.length > 0 && page < notes?.meta.total_pages && (
        <Button
          appearance="subtle"
          className="!pw-text-blue-primary !pw-font-bold pw-mt-3.5"
          endIcon={<BsChevronDown size={20} />}
          onClick={() => setPage(page + 1)}
        >
          {t('common:view_more')}
        </Button>
      )}
      {selectedNote?.action === 'delete' && (
        <ConfirmModal
          open={true}
          title={t('delete_note')}
          description={t('delete_note_description')}
          isDelete
          onConfirm={handleConfirmDelete}
          onClose={() => setSelectedNote(null)}
        />
      )}
    </div>
  );
};

export default ContactNote;
