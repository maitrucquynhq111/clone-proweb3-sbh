import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { ExportContactModal, TableHeaderAction } from './components';
import { initFilterValues, columnOptions, filterOptions } from './config';
import { CONTACTS_GROUPS_KEY, useContactsGroupsQuery } from '~app/services/queries';
import { Table, Filter, ConfirmModal } from '~app/components';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { useDeleteContactGroupMutation } from '~app/services/mutations';
// import { ContactGroupSuggest } from '~app/features/contacts-groups/components';
import { queryClient } from '~app/configs/client';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  detail?: ContactGroup;
  suggestedContactGroup?: PendingContactGroupSetting;
};

const ContactsGroupList = (): JSX.Element => {
  const { t } = useTranslation('contact-group-form');
  const tableRef = useRef<ExpectedAny>();
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const [openExport, setOpenExport] = useState(false);
  const { mutateAsync } = useDeleteContactGroupMutation();

  const handleFilter = useCallback((values: ExpectedAny) => {
    tableRef?.current?.setVariables(values);
  }, []);

  const handleRowClick = (rowData?: ContactGroup) => {
    setModalData({
      modal: ModalTypes.ContactGroupUpdate,
      size: ModalSize.Xsmall,
      placement: ModalPlacement.Right,
      detail: rowData,
    });
  };

  // const handleRowClick = (rowData?: ContactGroup, action?: string) => {
  //   setModalData({
  //     modal: action === 'edit' ? ModalTypes.ContactGroupUpdate : ModalTypes.ContactGroupDetails,
  //     size: action === 'edit' ? ModalSize.Xsmall : ModalSize.Full,
  //     placement: action === 'edit' ? ModalPlacement.Right : ModalPlacement.Top,
  //     detail: rowData,
  //   });
  // };

  // const handleCreateSuggestedContactGroup = useCallback((data: PendingContactGroupSetting) => {
  //   const newData: PendingContactGroupSetting = { ...data, name: t(data.name) };
  //   setModalData({
  //     modal: ModalTypes.ContactGroupCreate,
  //     size: ModalSize.Full,
  //     placement: ModalPlacement.Right,
  //     suggestedContactGroup: newData,
  //   });
  // }, []);

  const handleClick = (detail: ContactGroup | null, action: string) => {
    if (detail) {
      if (action === 'edit') handleRowClick(detail);
      if (action === 'delete') setSelectedId(detail.id);
    } else {
      if (action === 'export') return setOpenExport(true);
      setModalData({
        modal: ModalTypes.ContactGroupCreate,
        size: ModalSize.Full,
        placement: ModalPlacement.Right,
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await mutateAsync(selectedId);
      queryClient.invalidateQueries([CONTACTS_GROUPS_KEY], { exact: false });
      toast.success(t('success.delete'));
      setSelectedId('');
    } catch (error) {
      // TO DO
    }
  };

  return (
    <div>
      {/* <ContactGroupSuggest onCreateSuggestedContactGroup={handleCreateSuggestedContactGroup} /> */}
      <Table<ExpectedAny, ExpectedAny>
        ref={tableRef}
        columnOptions={columnOptions({ onClick: handleClick })}
        variables={initFilterValues}
        query={useContactsGroupsQuery}
        onRowClick={handleRowClick}
        dataKey="id"
        headerFilter={<Filter initValues={initFilterValues} onFilter={handleFilter} filterOptions={filterOptions()} />}
        headerButton={<TableHeaderAction onClick={handleClick} />}
      />
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
      {selectedId && (
        <ConfirmModal
          open={true}
          title={t('delete_contact_group')}
          description={t('delete_contact_group_description')}
          isDelete
          onConfirm={handleConfirmDelete}
          onClose={() => setSelectedId('')}
        />
      )}
      {openExport && <ExportContactModal onClose={() => setOpenExport(false)} />}
    </div>
  );
};
export default ContactsGroupList;
