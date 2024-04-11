import { useTranslation } from 'react-i18next';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Button } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import { BsGear } from 'react-icons/bs';
import LabelMessageList from './lists';
import { ModalPlacement, ModalSize, ModalTypes } from '~app/modals';

const LabelMessage = () => {
  const { t } = useTranslation('chat');
  const navigate = useNavigate();

  const handleClickCreate = () => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.LabelMessageCreate,
        placement: ModalPlacement.Right,
        size: ModalSize.Xsmall,
      })}`,
    });
  };

  const handleOpenAutoLabel = () => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.AutoLabels,
        placement: ModalPlacement.Right,
        size: ModalSize.Medium,
      })}`,
    });
  };
  return (
    <div>
      <div className="pw-flex pw-items-center pw-justify-between">
        <h5 className="pw-font-bold">{t('title.label_management')}</h5>
        <div>
          <Button
            appearance="ghost"
            startIcon={<BsGear size={22} />}
            className="!pw-border-neutral-border !pw-text-neutral-primary !pw-font-bold pw-mr-2 !pw-py-3"
            onClick={handleOpenAutoLabel}
          >
            {t('action.auto_apply_label')}
          </Button>
          <Button
            appearance="primary"
            startIcon={<PlusIcon />}
            className="!pw-font-bold !pw-py-3"
            onClick={handleClickCreate}
          >
            {t('action.create_label_conversation')}
          </Button>
        </div>
      </div>
      <LabelMessageList />
    </div>
  );
};

export default LabelMessage;
