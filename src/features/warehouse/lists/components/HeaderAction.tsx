import { BsArrowDown, BsArrowDownUp, BsArrowUp } from 'react-icons/bs';
import { MdExpandMore } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import { ButtonGroup, Button, Whisper, Popover, Dropdown, IconButton } from 'rsuite';
import { ModalTypes } from '~app/modals/types';
import { HeaderButton } from '~app/components';
import { useHasPermissions, InventoryPermission } from '~app/utils/shield';

const HeaderAction = () => {
  const { t } = useTranslation('header-button');
  const canCreateImportGoods = useHasPermissions([InventoryPermission.INVENTORY_PURCHASEORDER_CREATE]);
  const canCreateExportGoods = useHasPermissions([InventoryPermission.INVENTORY_OUTBOUND_CREATE]);
  const canCreateStockTaking = useHasPermissions([InventoryPermission.INVENTORY_ADJUSTMENT_CREATE]);

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
          const handleClick = (name: string) => {
            navigate({
              pathname: location.pathname,
              search: `?${createSearchParams({
                modal: name,
              })}`,
            });
          };
          return (
            <Popover ref={ref} className={className} style={{ left, top }} full>
              <Dropdown.Menu onSelect={handleSelect}>
                {canCreateImportGoods && (
                  <>
                    <Dropdown.Item
                      onClick={() => {
                        handleSelect();
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
                        handleSelect();
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
                      handleSelect();
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
          );
        }}
      >
        <ButtonGroup>
          <Button appearance="primary" size="lg">
            <span className="pw-font-bold">{t('inventory-table.create-transaction')}</span>
          </Button>

          <IconButton color="green" size="lg" appearance="primary" icon={<MdExpandMore size="22" />} />
        </ButtonGroup>
      </Whisper>
    </HeaderButton>
  );
};

export default HeaderAction;
