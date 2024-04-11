import { memo, useRef } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import { ButtonGroup, Button, Whisper, Popover, Dropdown, IconButton } from 'rsuite';
import { OverlayTriggerHandle } from 'rsuite/esm/Overlay/OverlayTrigger';
import { BsArrowUp, BsArrowDown } from 'react-icons/bs';
import { ModalTypes, ModalPlacement, ModalSize } from '~app/modals/types';
import { CashBookType } from '~app/utils/constants';

const TableHeaderAction = () => {
  const { t } = useTranslation('header-button');
  const whisperRef = useRef<OverlayTriggerHandle>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (name: string, type: CashBookType) => {
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
                handleClick(ModalTypes.CashbookCreate, CashBookType.OUT);
              }}
              className="!pw-flex pw-items-center pw-gap-2"
            >
              <BsArrowUp color="#CC4D23" />
              <span>{t('cashbook-table.transaction.create-outcome')}</span>
            </Dropdown.Item>
            <Dropdown.Item divider />
            <Dropdown.Item
              onClick={() => {
                handleClick(ModalTypes.CashbookCreate, CashBookType.IN);
              }}
              className="!pw-flex pw-items-center pw-gap-2"
            >
              <BsArrowDown color="#0E873F" />
              <span>{t('cashbook-table.transaction.create-income')}</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Popover>
      }
    >
      <ButtonGroup
        onClick={() => {
          handleClick(ModalTypes.CashbookCreate, CashBookType.OUT);
        }}
      >
        <Button appearance="primary" size="lg">
          <span className="pw-font-bold">{t('cashbook-table.transaction.create')}</span>
        </Button>
        <IconButton color="green" size="lg" appearance="primary" icon={<MdExpandMore size="22" />} />
      </ButtonGroup>
    </Whisper>
  );
};

export default memo(TableHeaderAction);
