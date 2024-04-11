import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { BsTrash } from 'react-icons/bs';
import { columnOptions, filterOptions, initFilterValues } from './config';
import { ModalPlacement, ModalSize, ModalTypes } from '~app/modals/types';
import { ConfirmModal, Filter, Table } from '~app/components';
import { LABEL_MESSAGE_KEY, useGetLabelMessageQuery } from '~app/services/queries';
import { ModalRendererInline } from '~app/modals';
import { useDeleteLabelMessageMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  detail: Label;
};

const LabelMessageList = (): JSX.Element => {
  const { t } = useTranslation('chat');
  const tableRef = useRef<ExpectedAny>();
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const { mutateAsync } = useDeleteLabelMessageMutation();

  const onRowClick = (rowData: ExpectedAny) => {
    setModalData({
      modal: ModalTypes.LabelMessageDetails,
      placement: ModalPlacement.Right,
      size: ModalSize.Xsmall,
      detail: rowData,
    });
  };

  const handleClick = (detail: Label, action: string) => {
    if (action === 'edit') onRowClick(detail);
    if (action === 'delete') setSelectedId(detail.id);
  };

  const handleFilter = useCallback((values: ExpectedAny) => {
    tableRef?.current?.setVariables(values);
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await mutateAsync(selectedId as ExpectedAny);
      queryClient.invalidateQueries([LABEL_MESSAGE_KEY], { exact: false });
      toast.success(t('success.delete_label'));
      setSelectedId('');
    } catch (error) {
      // TO DO
    }
  };

  return (
    <div className="pw-mt-4">
      <Table<ExpectedAny, ExpectedAny>
        ref={tableRef}
        columnOptions={columnOptions({ onClick: handleClick })}
        headerFilter={<Filter initValues={initFilterValues} onFilter={handleFilter} filterOptions={filterOptions()} />}
        variables={initFilterValues.primary}
        query={useGetLabelMessageQuery}
        onRowClick={onRowClick}
      />
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
      {selectedId && (
        <ConfirmModal
          open={true}
          title={t('modal.delete_label')}
          description={t('modal.delete_label_description')}
          isDelete
          iconTitle={<BsTrash size={24} />}
          onConfirm={handleConfirmDelete}
          onClose={() => setSelectedId('')}
        />
      )}
    </div>
  );
};
export default LabelMessageList;
