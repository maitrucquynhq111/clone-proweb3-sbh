import { useTranslation } from 'react-i18next';
import { BsPlus } from 'react-icons/bs';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'rsuite';
import { HeaderButton } from '~app/components';
import { ModalTypes } from '~app/modals';
import { InventoryPermission, withPermissions } from '~app/utils/shield';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('header-button');

  const handleClick = () => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.CreateImportGoods,
      })}`,
    });
  };

  return (
    <HeaderButton>
      <Button appearance="primary" size="md" startIcon={<BsPlus size={20} />} onClick={handleClick}>
        <strong>{t('inventory-import-book-table.create')}</strong>
      </Button>
    </HeaderButton>
  );
};

export default withPermissions(Header, [InventoryPermission.INVENTORY_PURCHASEORDER_CREATE]);
