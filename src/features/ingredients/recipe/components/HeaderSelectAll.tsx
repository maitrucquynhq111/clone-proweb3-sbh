import { memo, useRef, useCallback } from 'react';
import { IconButton } from 'rsuite';
import { toast } from 'react-toastify';
import TrashIcon from '@rsuite/icons/Trash';
import { useTranslation } from 'react-i18next';
import { useDeleteMultiRecipeMutation } from '~app/services/mutations';
import { RECIPES_KEY } from '~app/services/queries';
import { ModalConfirm, ModalRefObject } from '~app/components/ActionMenu';
import { queryClient } from '~app/configs/client';

type Props = {
  selected: Recipe[];
};

const HeaderSelectAll = ({ selected }: Props) => {
  const { t } = useTranslation(['recipe-table']);
  const { mutateAsync } = useDeleteMultiRecipeMutation();
  const confirmModalRef = useRef<ModalRefObject>(null);

  const handleDelete = async () => {
    const product_ids = selected.map((item) => item.id);
    await mutateAsync(product_ids);
    toast.success(t('success.delete'));
    queryClient.invalidateQueries([RECIPES_KEY], { exact: false });
  };

  const handleOpenModal = useCallback(() => {
    confirmModalRef.current?.handleOpen({
      action: handleDelete,
      title: t('common:delete'),
      modalTitle: t('delete_recipe') as string,
      acceptText: t('multiple-cancel-confirm') as string,
      modalContent: t('multiple-cancel-content') as string,
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
