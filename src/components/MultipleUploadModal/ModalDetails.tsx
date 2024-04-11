import { Modal } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { Table } from '~app/components';

type ModalDetailsProps = {
  id?: string;
  open: boolean;
  detailFailQuery?: ExpectedAny;
  onClose: () => void;
};

const ModalDetails = ({ id, detailFailQuery, open, onClose }: ModalDetailsProps) => {
  const { t } = useTranslation('common');
  const columnsOptions = {
    row: {
      label: t('row'),
      cell: ({ rowData }: { rowData: ExpectedAny }) => (
        <div className="pw-text-left pw-w-full pw-px-2">{rowData?.column || `${t('row')} ${rowData?.row}`}</div>
      ),
    },
    message: {
      flexGrow: 1,
      label: t('error-row-message'),
      className: 'pw-text-red-600',
    },
  };

  return (
    <Modal size="md" open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>
          <strong>{t('detail-uploaded')}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="!pw-max-h-none">
        <Table<ExpectedAny, ExpectedAny>
          columnOptions={columnsOptions}
          disableRefresh={true}
          query={detailFailQuery}
          variables={{
            id: id,
          }}
        />
      </Modal.Body>
    </Modal>
  );
};

export default ModalDetails;
