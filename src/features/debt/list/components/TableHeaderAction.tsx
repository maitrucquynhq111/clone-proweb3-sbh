import { memo, useRef } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import { ButtonGroup, Button, Whisper, Popover, Dropdown, IconButton } from 'rsuite';
import { OverlayTriggerHandle } from 'rsuite/esm/Overlay/OverlayTrigger';
import { BsDashCircle, BsPlusCircle } from 'react-icons/bs';
import { ModalTypes, ModalPlacement, ModalSize } from '~app/modals/types';
import { DebtType } from '~app/utils/constants';
import { ButtonActionData, ExportDataType, ExportType } from '~app/components/ButtonActionData';

const TableHeaderAction = ({ options, isBuffer }: ExpectedAny) => {
  const { t } = useTranslation('header-button');
  const whisperRef = useRef<OverlayTriggerHandle>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (name: string, type: DebtType) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: name,
        placement: ModalPlacement.Right,
        size: ModalSize.Xsmall,
        transaction_type: type,
      })}`,
    });
    whisperRef?.current?.close();
  };

  return (
    <div className="pw-gap-4 pw-flex">
      <Whisper
        ref={whisperRef}
        placement="bottomEnd"
        trigger="hover"
        enterable
        speaker={
          <Popover full>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  handleClick(ModalTypes.DebtCreate, DebtType.IN);
                }}
                className="!pw-flex pw-items-center pw-gap-2"
              >
                <BsDashCircle size="18" color="#CC4D23" />
                <span>{t('cashbook-table.debt.create-sent')}</span>
              </Dropdown.Item>
              <Dropdown.Item divider />
              <Dropdown.Item
                onClick={() => {
                  handleClick(ModalTypes.DebtCreate, DebtType.OUT);
                }}
                className="!pw-flex pw-items-center pw-gap-2"
              >
                <BsPlusCircle size="18" color="#0E873F" />
                <span>{t('cashbook-table.debt.create-received')}</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Popover>
        }
      >
        <ButtonGroup
          onClick={() => {
            handleClick(ModalTypes.DebtCreate, DebtType.IN);
          }}
        >
          <Button appearance="primary" size="lg">
            <span className="pw-font-bold">{t('cashbook-table.debt.create')}</span>
          </Button>
          <IconButton size="lg" color="green" appearance="primary" icon={<MdExpandMore size="22" />} />
        </ButtonGroup>
      </Whisper>
      {/* <ButtonActionData<{ search?: string }>
        dataType={ExportDataType.CONTACT}
        type={ExportType.VIEW}
        options={options}
        isBuffer={isBuffer}
      /> */}
      <ButtonActionData<{ search?: string }>
        dataType={ExportDataType.DEBT}
        type={ExportType.DOWNLOAD}
        options={options}
        isBuffer={isBuffer}
        title={t('export-data.download-excel') || ''}
        size="lg"
        appearance="primary"
        className="!pw-font-bold"
      />
    </div>
  );
};

export default memo(TableHeaderAction);
