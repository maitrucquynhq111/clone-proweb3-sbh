import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPlus } from 'react-icons/bs';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'rsuite';
import { ButtonActionData, ExportDataType, ExportType } from '~app/components/ButtonActionData';
import { ModalTypes } from '~app/modals';

const TableHeaderAction = ({ options }: { options: ExpectedAny }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('header-button');

  const handleClick = () => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.CreateExportGoods,
      })}`,
    });
  };

  return (
    <div className="pw-gap-4 pw-flex">
      <Button
        appearance="primary"
        size="lg"
        startIcon={<BsPlus size={20} />}
        className="!pw-bg-secondary-main"
        onClick={handleClick}
      >
        <strong>{t('inventory-export-book-table.create')}</strong>
      </Button>
      <ButtonActionData<{ search?: string }>
        dataType={ExportDataType.INVENTORY_IMPORT_BOOK}
        type={ExportType.DOWNLOAD}
        options={options}
        title={t('export-data.download-excel') || ''}
        appearance="primary"
        size="lg"
        className="!pw-font-bold"
      />
    </div>
  );
};

export default memo(TableHeaderAction);
