import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import { Button } from 'rsuite';

type Props = {
  onClickCreate(): void;
};
const TableHeaderAction = ({ onClickCreate }: Props) => {
  const { t } = useTranslation('header-button');

  return (
    <Button
      appearance="primary"
      size="lg"
      onClick={() => {
        onClickCreate();
      }}
    >
      <strong>{t('recipe-table.create')}</strong>
    </Button>
  );
};

export default memo(TableHeaderAction);
