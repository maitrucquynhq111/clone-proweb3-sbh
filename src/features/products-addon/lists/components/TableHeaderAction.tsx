import { useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import { ModalTypes } from '~app/modals/types';

const TableHeaderAction = () => {
  const { t } = useTranslation('header-button');
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.ProductAddonCreate,
      })}`,
    });
  };

  return (
    <Button size="lg" onClick={handleClick} appearance="primary">
      <strong>{t('products-addon-table.create')}</strong>
    </Button>
  );
};

export default TableHeaderAction;
