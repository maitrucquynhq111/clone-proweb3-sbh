import { memo, useRef, useCallback } from 'react';
import { IconButton } from 'rsuite';
import { toast } from 'react-toastify';
import TrashIcon from '@rsuite/icons/Trash';
import { useTranslation } from 'react-i18next';
import { useDeleteMultipleContactTransactionMutation } from '~app/services/mutations';
import { ModalConfirm, ModalRefObject } from '~app/components/ActionMenu';
import { CONTACT_TRANSACTIONS_KEY } from '~app/services/queries';
import { queryClient } from '~app/configs/client';

type Props = {
  selected: string[];
};

const HeaderSelectAll = ({ selected }: Props) => {
  const { t } = useTranslation('common');
  const { mutateAsync } = useDeleteMultipleContactTransactionMutation();
  const confirmModalRef = useRef<ModalRefObject>(null);

  const handleDelete = async () => {
    await mutateAsync({
      ids: selected,
    } as ExpectedAny);
    toast.success(t('notification:delete-success'));
    queryClient.invalidateQueries([CONTACT_TRANSACTIONS_KEY], { exact: false });
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
