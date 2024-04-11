import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EditIcon from '@rsuite/icons/Edit';
import { addMonths, startOfMonth } from 'date-fns';
import { DateRangePicker } from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
import { toast } from 'react-toastify';
import { ActionMenu, MenuItemProps, PriceCell } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { useDeleteTransactionMutation } from '~app/services/mutations';
import { ModalTypes, ModalPlacement, ModalSize } from '~app/modals/types';
import { convertDateFilter, formatDateToString } from '~app/utils/helpers';
import { CashBookType } from '~app/utils/constants';
import { queryClient } from '~app/configs/client';
import { CASHBOOK_KEY, CASH_TOTAL_KEY, CONTACT_TRANSACTION_TOTAL_KEY } from '~app/services/queries';

const { allowedRange } = DateRangePicker;

const dataMenuAction = (rowData: Cashbook): MenuItemProps[] => {
  const { mutateAsync } = useDeleteTransactionMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const handleClick = (name: string, id: string, type: CashBookType, rowData?: ExpectedAny) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: name,
        id: id,
        transaction_type: type,
        placement: ModalPlacement.Right,
        size: ModalSize.Xsmall,
        contact_transaction: rowData,
      })}`,
    });
  };

  return [
    {
      title: t('edit'),
      icon: <EditIcon />,
      action: () =>
        handleClick(
          rowData.txn_type === 'ctxn' ? ModalTypes.DebtDetails : ModalTypes.CashbookDetails,
          rowData.id,
          rowData['transaction_type'] as CashBookType,
          rowData,
        ),
    },
    {
      title: t('delete'),
      icon: <TrashIcon />,
      className: 'pw-text-red-500',
      action: async () => {
        await mutateAsync({
          id: rowData.id,
        } as ExpectedAny);
        toast.success(t('notification:delete-success'));
        queryClient.invalidateQueries([CASHBOOK_KEY], { exact: false });
        queryClient.invalidateQueries([CASH_TOTAL_KEY], { exact: false });
        queryClient.invalidateQueries([CONTACT_TRANSACTION_TOTAL_KEY], {
          exact: false,
        });
      },
      showConfirm: true,
    },
  ];
};

export const columnOptions = () => {
  const { t } = useTranslation('transaction-table');
  return {
    created_at: {
      isDateTime: true,
      minWidth: 160,
      flexGrow: 1,
      label: t('created_at'),
      cell: ({ rowData }: { rowData: ExpectedAny; dataKey: string }) => {
        return (
          <div className="pw-flex pw-items-center pw-p-3 pw-w-full pw-text-sm">
            {formatDateToString(rowData.created_at, 'dd/MM/yyyy HH:mm')}
          </div>
        );
      },
    },
    category_name: {
      minWidth: 150,
      flexGrow: 1,
      label: t('category_name'),
      cell: ({ rowData }: { rowData: ExpectedAny; dataKey: string }) => {
        return <div className="pw-flex pw-items-center pw-p-3 pw-w-full pw-text-sm">{rowData.category_name}</div>;
      },
    },
    payment_source_name: {
      minWidth: 120,
      flexGrow: 1,
      label: t('payment_source_name'),
      cell: ({ rowData }: { rowData: ExpectedAny; dataKey: string }) => {
        return <div className="pw-flex pw-items-center pw-p-3 pw-w-full pw-text-sm">{rowData.payment_source_name}</div>;
      },
    },
    status: {
      width: 120,
      label: t('status'),
      cell: ({ rowData, dataKey }: { rowData: ExpectedAny; dataKey: string }) => {
        const value = rowData[dataKey] || '';
        const isIn = rowData['transaction_type'] === CashBookType.IN;
        const isOut = rowData['transaction_type'] === CashBookType.OUT;
        return (
          <div className="pw-flex pw-items-center pw-w-full pw-p-3 pw-h-full pw-text-sm">
            {isIn && value === 'paid'
              ? t('received')
              : isIn && value !== 'paid'
              ? t('must-received')
              : isOut && value === 'paid'
              ? t('paid')
              : isOut && value !== 'paid'
              ? t('must-pay')
              : ''}
          </div>
        );
      },
    },
    total_in: {
      width: 120,
      label: t('total_in'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: ExpectedAny; dataKey: string }) => {
        const isIn = rowData['transaction_type'] === CashBookType.IN;
        return (
          <div className="pw-flex pw-items-center pw-text-right pw-w-full pw-font-semibold pw-py-3 pw-h-full pw-text-sm">
            {isIn ? <PriceCell value={rowData['amount']} /> : ''}
          </div>
        );
      },
    },
    total_out: {
      width: 120,
      label: t('total_out'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: ExpectedAny; dataKey: string }) => {
        const isOut = rowData['transaction_type'] === CashBookType.OUT;
        return (
          <div className="pw-flex pw-items-center pw-text-right pw-w-full pw-font-semibold pw-py-3 pw-h-full pw-text-sm">
            {isOut ? <PriceCell value={rowData['amount']} /> : ''}
          </div>
        );
      },
    },
    description: {
      flexGrow: 1,
      label: t('description'),
      minWidth: 380,
      cell: ({ rowData }: { rowData: ExpectedAny; dataKey: string }) => {
        return <div className="pw-flex pw-items-center pw-p-3 pw-w-full pw-text-sm">{rowData.description}</div>;
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
    dateRange: [startOfMonth(addMonths(new Date(), -1)), new Date()],
  },
};

export const filterOptions = () => {
  const { t } = useTranslation('filters');
  const firstDate = startOfMonth(addMonths(new Date(), -1));
  const today = new Date();
  return {
    primary: {
      search: {
        type: ComponentType.Text,
        placeholder: t('cashbook-table.search'),
        defaultValue: '',
        icon: 'search',
        size: 'lg',
        className: '!pw-w-80',
      },
      dateRange: {
        type: ComponentType.DateRange,
        placeholder: t('cashbook-table.daterange'),
        defaultValue: [startOfMonth(addMonths(new Date(), -1)), new Date()],
        className: '!pw-w-80 custom-daterange-neutral',
        editable: false,
        cleanable: false,
        size: 'lg',
        disabledDate: allowedRange?.(firstDate, today),
      },
    },
  };
};
