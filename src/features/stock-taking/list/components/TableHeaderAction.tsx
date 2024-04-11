import { memo } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { ModalTypes } from '~app/modals';
import { ButtonActionData, ExportDataType, ExportType } from '~app/components/ButtonActionData';

const TableHeaderAction = ({ options }: { options: ExpectedAny }) => {
  const { t } = useTranslation('header-button');
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.CreateStockTaking,
      })}`,
    });
  };

  return (
    <div className="pw-gap-4 pw-flex">
      <Button appearance="primary" size="lg" onClick={handleClick}>
        <strong>{t('stocktaking-table.create')}</strong>
      </Button>
      <ButtonActionData<{ search?: string }>
        dataType={ExportDataType.STOCK_TAKING}
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
