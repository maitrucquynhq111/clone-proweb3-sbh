import { useTranslation } from 'react-i18next';
import EditIcon from '@rsuite/icons/Edit';
import { Dispatch, SetStateAction } from 'react';
import { BsCheck2Circle, BsTrash } from 'react-icons/bs';
import { IconButton, Tooltip, Whisper } from 'rsuite';
import { toast } from 'react-toastify';
import { ActionMenu, MenuItemProps, PriceCell } from '~app/components';
import { useDeleteMultipleContactTransactionMutation } from '~app/services/mutations';
import { ModalTypes, ModalPlacement, ModalSize } from '~app/modals';
import { DebtType } from '~app/utils/constants';
import { showPayment } from '~app/utils/helpers';
import { CONTACTS_KEY, CONTACT_DETAIL, CONTACT_TRANSACTIONS_KEY } from '~app/services/queries';
import { queryClient } from '~app/configs/client';

export type ModalData = {
  modal: ModalTypes;
  size?: ModalSize | undefined;
  placement?: ModalPlacement | undefined;
  transaction_type?: DebtType;
  contact_transaction?: ContactTransaction;
  id?: string;
} | null;

const dataMenuAction = (
  rowData: ContactTransaction,
  openModal: Dispatch<SetStateAction<ModalData>>,
): MenuItemProps[] => {
  const { t } = useTranslation('common');
  const { mutateAsync } = useDeleteMultipleContactTransactionMutation();
  return [
    {
      title: t('edit'),
      icon: <EditIcon />,
      action: () =>
        openModal({
          modal: ModalTypes.DebtDetails,
          size: ModalSize.Xsmall,
          placement: ModalPlacement.Right,
          transaction_type: rowData.transaction_type as DebtType,
          id: rowData?.id || '',
        }),
    },
    {
      title: t('delete'),
      icon: <BsTrash size={16} />,
      className: 'pw-text-red-600',
      action: async () => {
        await mutateAsync({
          ids: [rowData.id],
        } as ExpectedAny);
        toast.success(t('notification:delete-success'));
        queryClient.invalidateQueries([CONTACTS_KEY], {
          exact: false,
        });
        queryClient.invalidateQueries([CONTACT_DETAIL], {
          exact: false,
        });
        queryClient.invalidateQueries([CONTACT_TRANSACTIONS_KEY], {
          exact: false,
        });
        queryClient.invalidateQueries([CONTACTS_KEY], {
          exact: false,
        });
      },
      showConfirm: true,
    },
  ];
};

export const columnOptions = ({ setModalData }: { setModalData: Dispatch<SetStateAction<ModalData>> }) => {
  const { t } = useTranslation('debt-table');

  return {
    start_time: {
      isDateTime: true,
      width: 200,
      label: t('start_time'),
    },
    total_in: {
      width: 200,
      label: t('must-spent'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: ContactTransaction; dataKey: string }) => {
        const isOut = rowData['transaction_type'] === 'in';
        return (
          <div className="pw-text-right pw-text-red-600 pw-flex pw-items-center pw-w-full pw-font-semibold pw-py-3 pw-h-full">
            {isOut ? <PriceCell value={rowData['amount']} /> : ''}
          </div>
        );
      },
    },
    total_out: {
      width: 250,
      label: t('must-receive'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: ExpectedAny; dataKey: string }) => {
        const isIn = rowData['transaction_type'] === 'out';
        return (
          <div className="pw-text-right pw-text-green-600 pw-flex pw-items-center pw-w-full pw-font-semibold pw-py-3 pw-h-full">
            {isIn ? <PriceCell value={rowData['amount']} /> : ''}
          </div>
        );
      },
    },
    description: {
      flexGrow: 1,
      label: t('description'),
    },
    action: {
      width: 80,
      label: '',
      cell: ({ rowData }: { rowData: ContactTransaction }) => {
        const enabled = showPayment(rowData);
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="pw-flex pw-items-center pw-w-full pw-justify-end pw-px-2"
          >
            {enabled && (
              <Whisper placement="top" trigger="hover" speaker={<Tooltip>{t('payment')}</Tooltip>}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalData({
                      modal: ModalTypes.DebtCreatePayment,
                      size: ModalSize.Xsmall,
                      placement: ModalPlacement.Right,
                      contact_transaction: rowData,
                      id: rowData?.id || '',
                    });
                  }}
                  disabled={!enabled}
                  size="xs"
                  appearance="subtle"
                  icon={<BsCheck2Circle size={18} color="green" />}
                />
              </Whisper>
            )}
            <ActionMenu data={dataMenuAction(rowData, setModalData)} />
          </div>
        );
      },
    },
  };
};

export const initFilterValues = {
  date: '',
};
