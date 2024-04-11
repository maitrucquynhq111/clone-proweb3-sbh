import { useNavigate } from 'react-router-dom';
import { Button } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { HeaderButton } from '~app/components';
import { MainRouteKeys } from '~app/routes/enums';

const Header = () => {
  const { t } = useTranslation('header-button');
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(MainRouteKeys.Pos);
  };

  return (
    <HeaderButton>
      <Button appearance="primary" size="lg" onClick={handleClick}>
        <strong>{t('orders-table.create')}</strong>
      </Button>
    </HeaderButton>
  );
};

export default Header;
