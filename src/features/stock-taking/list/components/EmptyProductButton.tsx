import { useTranslation } from 'react-i18next';
import { IconButton } from 'rsuite';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import { ModalTypes } from '~app/modals';

const EmptyProductButton = () => {
  const { t } = useTranslation('header-button');
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.ProductCreate,
      })}`,
    });
  };

  return (
    <IconButton icon={<ArrowDownLineIcon />} placement="right" appearance="primary" onClick={handleClick}>
      <strong>{t('products-table.create')}</strong>
    </IconButton>
  );
};

export default EmptyProductButton;
