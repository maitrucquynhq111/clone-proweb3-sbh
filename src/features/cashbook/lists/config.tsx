import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsPencilFill, BsTrash } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { ActionMenu, MenuItemProps, PriceCell } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { useDeleteMultipleTransactionMutation } from '~app/services/mutations';
import { ModalTypes, ModalPlacement, ModalSize } from '~app/modals/types';
import { CashBookType } from '~app/utils/constants';
import { queryClient } from '~app/configs/client';
import { CASHBOOK_KEY, CASH_TOTAL_KEY } from '~app/services/queries';
import { convertDateFilter, formatDateToString } from '~app/utils/helpers';

const dataMenuAction = (rowData: Cashbook): MenuItemProps[] => {
  const { mutateAsync } = useDeleteMultipleTransactionMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const handleClick = (name: string, id: string, type: CashBookType) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: name,
        id: id,
        transaction_type: type,
        placement: ModalPlacement.Right,
        size: ModalSize.Xsmall,
      })}`,
    });
  };

  return [
    {
      title: t('edit'),
      icon: <BsPencilFill className="pw-text-primary-main" />,
      action: () => handleClick(ModalTypes.CashbookDetails, rowData.id, rowData['transaction_type'] as CashBookType),
    },
    {
      title: t('delete'),
      icon: <BsTrash />,
      className: 'pw-text-red-500',
      action: async () => {
        await mutateAsync({
          ids: [rowData.id],
        } as ExpectedAny);
        toast.success(t('notification:delete-success'));
        queryClient.invalidateQueries([CASHBOOK_KEY], { exact: false });
        queryClient.invalidateQueries([CASH_TOTAL_KEY], { exact: false });
      },
      showConfirm: true,
    },
  ];
};

export const columnOptions = () => {
  const { t } = useTranslation('cashbook-table');
  return {
    day: {
      isDateTime: true,
      width: 160,
      label: t('day'),
      cell: ({ rowData }: { rowData: ExpectedAny; dataKey: string }) => {
        return (
          <div className="pw-flex pw-items-center pw-p-3 pw-w-full pw-text-sm">
            {formatDateToString(rowData.day, 'dd/MM/yyyy HH:mm')}
          </div>
        );
      },
    },
    object_key: {
      width: 130,
      label: t('object_key'),
      cell: ({ rowData }: { rowData: ExpectedAny; dataKey: string }) => {
        return <div className="pw-flex pw-items-center pw-p-2 pw-w-full pw-text-sm">{rowData.object_key}</div>;
      },
    },
    payment_source_name: {
      width: 140,
      label: t('payment_source_name'),
      cell: ({ rowData }: { rowData: ExpectedAny; dataKey: string }) => {
        return <div className="pw-flex pw-items-center pw-p-2 pw-w-full pw-text-sm">{rowData.payment_source_name}</div>;
      },
    },
    total_in: {
      width: 130,
      label: t('total_in'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: ExpectedAny; dataKey: string }) => {
        const isIn = rowData['transaction_type'] === CashBookType.IN;
        return (
          <div className="pw-text-right pw-w-full pw-font-semibold pw-p-2 pw-text-sm">
            {isIn ? <PriceCell value={rowData['amount']} /> : ''}
          </div>
        );
      },
    },
    total_out: {
      width: 130,
      label: t('total_out'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: ExpectedAny; dataKey: string }) => {
        const isOut = rowData['transaction_type'] === CashBookType.OUT;
        return (
          <div className="pw-text-right pw-w-full pw-font-semibold pw-p-2 pw-text-sm">
            {isOut ? <PriceCell value={rowData['amount']} /> : ''}
          </div>
        );
      },
    },
    description: {
      flexGrow: 1,
      label: t('description'),
      minWidth: 250,
      cell: ({ rowData }: { rowData: ExpectedAny; dataKey: string }) => {
        return <div className="pw-flex pw-items-center pw-p-2 pw-w-full pw-text-sm">{rowData.description}</div>;
      },
    },
    action: {
      width: 50,
      label: '',
      cell: ({ rowData }: { rowData: Cashbook }) => {
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ActionMenu data={dataMenuAction(rowData)} />
          </div>
        );
      },
    },
  };
};

export const convertFilter = (filter: ExpectedAny) => {
  const { dateRange, ...rest } = filter;
  return {
    ...rest,
    ...convertDateFilter(dateRange),
  };
};

export const initFilterValues = {
  primary: {
    search: '',
    dateRange: [],
  },
};

export const filterOptions = () => {
  const { t } = useTranslation('filters');
  return {
    primary: {
      search: {
        type: ComponentType.Text,
        placeholder: t('cashbook-table.search'),
        defaultValue: '',
        icon: 'search',
        className: '!pw-w-60',
        size: 'lg',
      },
      dateRange: {
        type: ComponentType.DateRange,
        placeholder: t('cashbook-table.daterange'),
        defaultValue: [],
        className: '!pw-w-60',
        size: 'lg',
      },
    },
  };
};
