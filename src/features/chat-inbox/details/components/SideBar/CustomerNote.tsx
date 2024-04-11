import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill } from 'react-icons/bs';
import { CreateCustomerNote, CustomerNoteList } from '~app/features/chat-inbox/components';
import { useContactStore } from '~app/features/chat-inbox/hooks';
import { useGetContactNotesQuery } from '~app/services/queries';

const CustomerNote = () => {
  const { t } = useTranslation('chat');
  const [contact] = useContactStore((store) => store.contact);
  const [isCreate, setIsCreate] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const { data } = useGetContactNotesQuery({
    page: 1,
    page_size: 10,
    contact_id: contact?.id || '',
  });

  const totalRows = useMemo(() => {
    if (data?.meta) return data.meta.total_rows as number;
    return 0;
  }, [data]);

  return (
    <div className="pw-py-6 pw-px-5 pw-bg-neutral-white">
      <div className="pw-flex pw-items-center pw-justify-between ">
        <span className="pw-text-base pw-font-bold pw-text-neutral-primary">
          {t('count_customer_note', { count: totalRows })}
        </span>
        <button
          className="pw-flex pw-items-center pw-justify-center pw-gap-x-2 "
          type="button"
          onClick={() => {
            setIsCreate(true);
            setSelectedId('');
          }}
        >
          <BsPlusCircleFill className="pw-fill-secondary-main-blue" size={20} />
        </button>
      </div>
      {isCreate && contact ? (
        <div className="pw-mt-4">
          <CreateCustomerNote onClose={() => setIsCreate(false)} contactId={contact.id} />
        </div>
      ) : null}
      <div className="pw-max-h-82 pw-overflow-y-scroll scrollbar-none">
        <CustomerNoteList
          selectedId={selectedId}
          onClick={(value: string) => {
            setSelectedId(value);
            setIsCreate(false);
          }}
        />
      </div>
    </div>
  );
};

export default CustomerNote;
