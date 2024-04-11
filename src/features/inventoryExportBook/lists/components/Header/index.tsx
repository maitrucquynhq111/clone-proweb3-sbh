import { useTranslation } from 'react-i18next';
import { BsPlus } from 'react-icons/bs';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'rsuite';
import { HeaderButton } from '~app/components';
import { ModalTypes } from '~app/modals';

const Header = () => {
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
    <HeaderButton>
      <Button
        appearance="primary"
        size="md"
        startIcon={<BsPlus size={20} />}
        className="!pw-bg-secondary-main"
        onClick={handleClick}
      >
        <strong>{t('inventory-export-book-table.create')}</strong>
      </Button>
    </HeaderButton>
  );
};

export default Header;
