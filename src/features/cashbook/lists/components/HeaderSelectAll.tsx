import { memo, useRef, useCallback } from 'react';
import { IconButton } from 'rsuite';
import { toast } from 'react-toastify';
import TrashIcon from '@rsuite/icons/Trash';
import { useTranslation } from 'react-i18next';
import { useDeleteMultipleTransactionMutation } from '~app/services/mutations';
import { ModalConfirm, ModalRefObject } from '~app/components/ActionMenu';
import { queryClient } from '~app/configs/client';
import { CASHBOOK_KEY } from '~app/services/queries';

type Props = {
  selected: string[];
};

const HeaderSelectAll = ({ selected }: Props) => {
  const { t } = useTranslation('common');
  const { mutateAsync } = useDeleteMultipleTransactionMutation();
  const confirmModalRef = useRef<ModalRefObject>(null);

  const handleDelete = async () => {
    await mutateAsync({
      ids: selected,
    } as ExpectedAny);
    toast.success(t('notification:delete-success'));
    queryClient.invalidateQueries([CASHBOOK_KEY], { exact: false });
  };

  const handleOpenModal = useCallback(() => {
    confirmModalRef.current?.handleOpen({
      action: handleDelete,
      title: t('delete'),
    });
  }, [handleDelete]);

  return (
    <div className="pw-flex pw-gap-2 pw-h-10 pw-items-center">
      <IconButton size="sm" color="red" onClick={handleOpenModal} appearance="primary" icon={<TrashIcon />} />
      <ModalConfirm ref={confirmModalRef} />
    </div>
  );
};

export default memo(HeaderSelectAll);
