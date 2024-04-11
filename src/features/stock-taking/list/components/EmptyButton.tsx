import { useTranslation } from 'react-i18next';
import { IconButton } from 'rsuite';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import PlusIcon from '@rsuite/icons/Plus';
import { ModalTypes } from '~app/modals';

const EmptyButton = () => {
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
    <IconButton icon={<PlusIcon />} appearance="primary" onClick={handleClick}>
      <strong>{t('stocktaking-table.create')}</strong>
    </IconButton>
  );
};

export default EmptyButton;
