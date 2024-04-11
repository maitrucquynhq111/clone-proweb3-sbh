import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsTrash } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { Pagination } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import { columnsOptions } from './config';
import { ModalPlacement, ModalSize, ModalTypes } from '~app/modals/types';
import { ConfirmModal, StaticTable, TextInput, EmptyState } from '~app/components';
import { QUICK_MESSAGES_KEY } from '~app/services/queries';
import { useDeleteQuickMessageMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import { PageSizeDropdown } from '~app/components/Table/components';
import { NoDataImage } from '~app/components/Icons';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  detail: QuickMessageResponse;
};

type Props = {
  list: QuickMessageResponse[];
  page: number;
  limit: number;
  total: number;
  search: string;
  onChangePage(value: number): void;
  onChangeLimit(value: number): void;
  onChangeSearch(value: string): void;
  setModalData: (value: ModalData | null) => void;
};

const QuickMessageList = ({
  list,
  page,
  limit,
  total,
  search,
  onChangePage,
  onChangeLimit,
  onChangeSearch,
  setModalData,
}: Props): JSX.Element => {
  const { t } = useTranslation('chat');
  const { mutateAsync } = useDeleteQuickMessageMutation();
  const [selectedId, setSelectedId] = useState('');

  const onRowClick = (rowData: ExpectedAny) => {
    setModalData({
      modal: ModalTypes.QuickMessageDetails,
      placement: ModalPlacement.Right,
      size: ModalSize.Small,
      detail: rowData,
    });
  };

  const handleClick = (detail: Label, action: string) => {
    if (action === 'edit') onRowClick(detail);
    if (action === 'delete') setSelectedId(detail.id);
  };

  const handleConfirmDelete = async () => {
    try {
      await mutateAsync(selectedId as ExpectedAny);
      queryClient.invalidateQueries([QUICK_MESSAGES_KEY], { exact: false });
      toast.success(t('success.delete_label'));
      setSelectedId('');
    } catch (error) {
      // TO DO
    }
  };

  return (
    <div className="pw-mt-4">
      <div className="pw-mt-3 pw-w-1/2">
        <TextInput
          name="search"
          value={search}
          startIcon={<SearchIcon />}
          isForm={false}
          onChange={(value) => {
            if (page > 1) onChangePage(1);
            onChangeSearch(value);
          }}
          placeholder={t('placeholder.quick_message') || ''}
        />
      </div>
      {list.length === 0 ? (
        <EmptyState hiddenButton={true} icon={<NoDataImage />} description1={t('common:no-data')} />
      ) : (
        <>
          <StaticTable
            className="pw-mt-4"
            columnConfig={columnsOptions({ onClick: handleClick, t })}
            data={list}
            rowKey="id"
          />
          <div className="pw-flex pw-py-4 pw-justify-between pw-items-center">
            <PageSizeDropdown value={limit} onChange={(value: number | null) => onChangeLimit(value || 10)} />
            <Pagination total={total} limit={limit} onChangePage={onChangePage} activePage={page} />
          </div>
        </>
      )}
      {selectedId && (
        <ConfirmModal
          open={true}
          title={t('modal.delete_quick_message')}
          description={t('modal.delete_quick_message_description')}
          isDelete
          iconTitle={<BsTrash size={24} />}
          onConfirm={handleConfirmDelete}
          onClose={() => setSelectedId('')}
        />
      )}
    </div>
  );
};
export default QuickMessageList;
