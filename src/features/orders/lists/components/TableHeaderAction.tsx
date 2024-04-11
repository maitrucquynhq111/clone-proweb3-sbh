import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { MdExpandMore } from 'react-icons/md';
import { BsDownload } from 'react-icons/bs';
import { Button, Whisper, Popover, Dropdown } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import { ButtonActionData, ExportDataType, ExportType } from '~app/components/ButtonActionData';
import { MainRouteKeys } from '~app/routes/enums';

type Props = {
  options: ExpectedAny;
  canCreateOrder: boolean;
};

const TableHeaderAction = ({ options, canCreateOrder }: Props) => {
  const { t } = useTranslation('header-button');
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(MainRouteKeys.Pos);
  };
  return (
    <div className="pw-gap-4 pw-flex">
      {canCreateOrder && (
        <Button appearance="primary" size="lg" onClick={handleClick}>
          <strong>{t('orders-table.create')}</strong>
        </Button>
      )}
      <Whisper
        placement="bottomEnd"
        trigger="hover"
        enterable
        speaker={
          <Popover full>
            <Dropdown.Menu>
              <Dropdown.Item className="!pw-flex pw-items-center pw-gap-2">
                <ButtonActionData<Props>
                  options={options}
                  dataType={ExportDataType.ORDER}
                  type={ExportType.VIEW}
                  title={t('export-data.view-online') || ''}
                  className="!pw-bg-transparent"
                />
              </Dropdown.Item>
              <Dropdown.Item divider />
              <Dropdown.Item className="!pw-flex pw-items-center pw-gap-2">
                <ButtonActionData<Props>
                  options={options}
                  dataType={ExportDataType.ORDER}
                  type={ExportType.DOWNLOAD}
                  title={t('export-data.download-excel') || ''}
                  className="!pw-bg-transparent"
                />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Popover>
        }
      >
        <Button
          appearance="primary"
          size="lg"
          startIcon={<BsDownload size="20" />}
          endIcon={<MdExpandMore size="20" />}
        >
          <span className="pw-font-bold">{t('export-data.export-file')}</span>
        </Button>
      </Whisper>
    </div>
  );
};

export default memo(TableHeaderAction);
