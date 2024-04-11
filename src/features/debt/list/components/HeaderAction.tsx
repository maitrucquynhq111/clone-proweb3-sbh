import { MdExpandMore } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import { ButtonGroup, Button, Whisper, Popover, Dropdown, IconButton } from 'rsuite';
import { BsDashCircle, BsPlusCircle } from 'react-icons/bs';
import { ModalTypes, ModalPlacement, ModalSize } from '~app/modals/types';
import { HeaderButton } from '~app/components';
import { DebtType } from '~app/utils/constants';

const HeaderAction = () => {
  const { t } = useTranslation('header-button');

  return (
    <HeaderButton>
      <Whisper
        placement="bottomEnd"
        trigger="click"
        speaker={({ onClose, left, top, className }, ref) => {
          const location = useLocation();
          const navigate = useNavigate();
          const handleSelect = () => {
            onClose();
          };
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
          };
          return (
            <Popover ref={ref} className={className} style={{ left, top }} full>
              <Dropdown.Menu onSelect={handleSelect}>
                <Dropdown.Item
                  onClick={() => {
                    handleSelect();
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
                    handleSelect();
                    handleClick(ModalTypes.DebtCreate, DebtType.OUT);
                  }}
                  className="!pw-flex pw-items-center pw-gap-2"
                >
                  <BsPlusCircle size="18" color="#0E873F" />
                  <span>{t('cashbook-table.debt.create-received')}</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Popover>
          );
        }}
      >
        <ButtonGroup>
          <Button appearance="primary" size="lg">
            <span className="pw-font-bold">{t('cashbook-table.debt.create')}</span>
          </Button>

          <IconButton size="lg" color="green" appearance="primary" icon={<MdExpandMore size="22" />} />
        </ButtonGroup>
      </Whisper>
    </HeaderButton>
  );
};

export default HeaderAction;
