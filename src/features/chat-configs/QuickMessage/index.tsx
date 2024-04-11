import { useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import { useEffect, useState } from 'react';
import QuickMessageList from './lists';
import { EmptyStateMessage } from '~app/components/Icons';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { useQuickMessagesQuery } from '~app/services/queries';
import { EmptyState } from '~app/components';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  detail?: QuickMessageResponse;
};

const MAX_QUICK_MESSAGES = 20;

const QuickMessage = () => {
  const { t } = useTranslation('chat');
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [list, setList] = useState<QuickMessageResponse[]>([]);
  const [limit, setLimit] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');

  const { data } = useQuickMessagesQuery();

  useEffect(() => {
    const dataTable = (data?.data || []).filter((v, i) => {
      const start = limit * (page - 1);
      const end = start + limit;
      return i >= start && i < end;
    });
    setList(dataTable);
  }, [page, limit, data]);

  useEffect(() => {
    let dataTable = (data?.data || []).filter((v, i) => {
      const start = limit * (page - 1);
      const end = start + limit;
      return i >= start && i < end;
    });
    dataTable = dataTable.filter((message) => message.shortcut.toLowerCase().includes(search.toLowerCase()));
    setList(dataTable);
  }, [search]);

  const handleChangeLimit = (limitSize: number) => {
    setPage(1);
    setLimit(limitSize);
  };

  const handleClickCreate = () => {
    setModalData({
      modal: ModalTypes.QuickMessageCreate,
      placement: ModalPlacement.Right,
      size: ModalSize.Small,
    });
  };

  return (
    <div className="pw-border pw-rounded pw-border-neutral-divider">
      {data?.data?.length === 0 ? (
        <EmptyState
          className="pw-mt-3 pw-mb-8 pw-mx-auto pw-w-80"
          icon={<EmptyStateMessage />}
          description1={t('empty_state_quick_message')}
          textBtn={t('action.create_sample_message') || ''}
          onClick={handleClickCreate}
        />
      ) : (
        <div className="pw-p-6 pw-gap-4">
          <div className="pw-flex pw-items-center pw-justify-between pw-mb-5">
            <div className="pw-text-base pw-font-bold">
              {t('quick_message_list')} ({data?.data?.length}/{MAX_QUICK_MESSAGES})
            </div>
            <Button
              appearance="primary"
              className="!pw-text-base !pw-font-bold !pw-py-3 !pw-px-4"
              disabled={(data?.data?.length || 0) === MAX_QUICK_MESSAGES}
              onClick={handleClickCreate}
            >
              {t('action.create_message')}
            </Button>
          </div>
          <QuickMessageList
            list={list}
            page={page}
            limit={limit}
            total={data?.data.length || 0}
            search={search}
            onChangePage={setPage}
            onChangeLimit={handleChangeLimit}
            onChangeSearch={setSearch}
            setModalData={setModalData}
          />
        </div>
      )}
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </div>
  );
};

export default QuickMessage;
