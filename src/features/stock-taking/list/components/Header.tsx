import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { HeaderButton } from '~app/components';
import { ModalTypes } from '~app/modals';

const Header = () => {
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
    <HeaderButton>
      <Button appearance="primary" size="lg" onClick={handleClick}>
        <strong>{t('stocktaking-table.create')}</strong>
      </Button>
    </HeaderButton>
  );
};

export default Header;
