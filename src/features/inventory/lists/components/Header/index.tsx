import { IconButton } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import { useTranslation } from 'react-i18next';
import { HeaderButton } from '~app/components';

const Header = () => {
  const { t } = useTranslation('header-button');

  return (
    <HeaderButton>
      <IconButton icon={<PlusIcon />} appearance="primary">
        <strong>{t('inventory-table.export-goods')}</strong>
      </IconButton>
      <IconButton icon={<PlusIcon />} appearance="primary">
        <strong>{t('inventory-table.import-goods')}</strong>
      </IconButton>
    </HeaderButton>
  );
};

export default Header;
