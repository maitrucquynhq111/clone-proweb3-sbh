import cx from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import EditableCustomerNote from './EditableCustomerNote';
import { InfiniteScroll } from '~app/components';
import { useContactStore } from '~app/features/chat-inbox/hooks';
import { useGetContactNotesQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';

type Props = {
  selectedId?: string;
  onClick?(value: string): void;
};

const CustomerNoteList = ({ onClick, selectedId }: Props) => {
  const [contact] = useContactStore((store) => store.contact);
  const [page, setPage] = useState(1);
  const [list, setList] = useState<Note[]>([]);

  const { data } = useGetContactNotesQuery({
    page,
    page_size: 10,
    contact_id: contact?.id || '',
  });

  const total_page = useMemo(() => {
    if (data?.meta) return data.meta.total_pages as number;
    return 0;
  }, [data]);

  const isLastPage = useMemo(() => {
    return page >= total_page;
  }, [total_page, page]);

  const next = useCallback(() => {
    setPage((prevState) => prevState + 1);
  }, []);

  useEffect(() => {
    if (!data?.data) return;
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...data.data], 'id'));
    } else {
      setList(data.data);
    }
  }, [data?.data, page]);

  return (
    <div className="pw-max-h-82 pw-overflow-y-scroll scrollbar-none">
      <InfiniteScroll next={next} hasMore={!isLastPage}>
        {list.map((note, index) => {
          return (
            <EditableCustomerNote
              key={note.id}
              showForm={selectedId === note.id}
              data={note}
              className={cx('pw-py-3', {
                'pw-border-solid pw-border-t pw-border-neutral-divider': index !== 0,
              })}
              onClick={onClick}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default CustomerNoteList;
