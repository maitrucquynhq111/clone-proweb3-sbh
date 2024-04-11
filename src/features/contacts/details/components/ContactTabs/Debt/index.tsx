import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { TableHeaderAction, DebtInfo, HeaderSelectAll } from './components';
import { initFilterValues, columnOptions, ModalData } from './config';
import { useContactTransactionsQuery } from '~app/services/queries';
import { Table } from '~app/components';
import { ModalTypes, ModalPlacement, ModalSize } from '~app/modals/types';
import { DebtType } from '~app/utils/constants';
import { ModalRendererInline } from '~app/modals';

const Debt = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const [modalData, setModalData] = useState<ModalData>(null);
  const contact_id = searchParams.get('id') as string;

  const onRowClick = (rowData: ExpectedAny) => {
    setModalData({
      modal: ModalTypes.DebtDetails,
      size: ModalSize.Xsmall,
      placement: ModalPlacement.Right,
      transaction_type: rowData.transaction_type as DebtType,
      id: rowData?.id || '',
    });
  };

  return (
    <>
      <Table<ExpectedAny, ExpectedAny>
        columnOptions={columnOptions({ setModalData })}
        variables={{ ...initFilterValues, contact_id }}
        query={useContactTransactionsQuery}
        onRowClick={onRowClick}
        dataKey="id"
        headerFilter={<DebtInfo />}
        headerSelectAll={({ selected }: { selected: string[] }) => {
          return <HeaderSelectAll selected={selected} />;
        }}
        selectable
        headerButton={<TableHeaderAction contactId={contact_id} />}
      />
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </>
  );
};
export default Debt;
