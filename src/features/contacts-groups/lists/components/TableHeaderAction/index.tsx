import { Button, IconButton } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import { useTranslation } from 'react-i18next';
import { BsDownload } from 'react-icons/bs';
// import { TableHeaderActionButton } from '~app/components';

type Props = {
  onClick(detail: ContactGroup | null, action: string): void;
};

const TableHeaderAction = ({ onClick }: Props) => {
  const { t } = useTranslation('header-button');
  return (
    <div className="pw-gap-4 pw-flex">
      <Button endIcon={<BsDownload size={20} />} size="lg" appearance="primary" onClick={() => onClick(null, 'export')}>
        <strong className="pw-mr-2">{t('contacts-groups-table.export_contact')}</strong>
      </Button>
      <IconButton icon={<PlusIcon />} size="lg" appearance="primary" onClick={() => onClick(null, 'create')}>
        <strong>{t('contacts-groups-table.create')}</strong>
      </IconButton>
    </div>
  );
};

export default TableHeaderAction;
