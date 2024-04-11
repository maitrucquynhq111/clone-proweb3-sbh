import { useRef } from 'react';
import { BsArrowDown, BsArrowDownUp, BsArrowUp } from 'react-icons/bs';
import { OverlayTriggerHandle } from 'rsuite/esm/Overlay/OverlayTrigger';
import { MdExpandMore } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import { ButtonGroup, Button, Whisper, Popover, Dropdown, IconButton } from 'rsuite';
import { ModalTypes } from '~app/modals/types';
import { useHasPermissions, InventoryPermission } from '~app/utils/shield';

const TableHeaderAction = () => {
  const { t } = useTranslation('header-button');
  const whisperRef = useRef<OverlayTriggerHandle>(null);
  const canCreateImportGoods = useHasPermissions([InventoryPermission.INVENTORY_PURCHASEORDER_CREATE]);
  const canCreateExportGoods = useHasPermissions([InventoryPermission.INVENTORY_OUTBOUND_CREATE]);
  const canCreateStockTaking = useHasPermissions([InventoryPermission.INVENTORY_ADJUSTMENT_CREATE]);

  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (name: string) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: name,
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
            {canCreateImportGoods && (
              <>
                <Dropdown.Item
                  onClick={() => {
                    handleClick(ModalTypes.CreateImportGoods);
                  }}
                  className="!pw-flex pw-items-center pw-gap-2"
                >
                  <BsArrowUp size={28} className="pw-text-primary-main" />
                  <span>{t('inventory-table.import-goods')}</span>
                </Dropdown.Item>
                <Dropdown.Item divider />
              </>
            )}
            {canCreateExportGoods && (
              <>
                <Dropdown.Item
                  onClick={() => {
                    handleClick(ModalTypes.CreateExportGoods);
                  }}
                  className="!pw-flex pw-items-center pw-gap-2"
                >
                  <BsArrowDown size={28} className="pw-text-secondary-main" />
                  <span>{t('inventory-table.export-goods')}</span>
                </Dropdown.Item>
                <Dropdown.Item divider />
              </>
            )}
            {canCreateStockTaking && (
              <Dropdown.Item
                onClick={() => {
                  handleClick(ModalTypes.CreateStockTaking);
                }}
                className="!pw-flex pw-items-center pw-gap-2"
              >
                <BsArrowDownUp size={28} className="pw-text-primary-main" />
                <span>{t('inventory-table.stocktaking')}</span>
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Popover>
      }
    >
      <ButtonGroup
        onClick={() => {
          if (canCreateImportGoods) return handleClick(ModalTypes.CreateImportGoods);
          if (canCreateExportGoods) return handleClick(ModalTypes.CreateExportGoods);
          if (canCreateStockTaking) return handleClick(ModalTypes.CreateStockTaking);
        }}
      >
        <Button appearance="primary" size="lg">
          <span className="pw-font-bold">{t('inventory-table.create-transaction')}</span>
        </Button>
        <IconButton color="green" size="lg" appearance="primary" icon={<MdExpandMore size="22" />} />
      </ButtonGroup>
    </Whisper>
  );
};

export default TableHeaderAction;
