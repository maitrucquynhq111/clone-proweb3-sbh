import { useTranslation } from 'react-i18next';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import { BsPrinterFill } from 'react-icons/bs';
import { endOfDay, startOfMonth } from 'date-fns';
import { MenuItemProps } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { ModalTypes } from '~app/modals';
import { convertDateFilter } from '~app/utils/helpers';

export const selectAllAction = (): MenuItemProps[] => {
  const { t } = useTranslation('common');

  return [
    {
      title: t('common:print'),
      icon: <BsPrinterFill />,
      action: () => {
        console.log('');
      },
    },
    {
      title: t('common:delete'),
      icon: <TrashIcon />,
      className: 'pw-text-red-500',
      action: async () =>
        new Promise(function (resolve) {
          setTimeout(() => {
            resolve();
          }, 2000);
        }),
      showConfirm: true,
    },
  ];
};

const dataMenuAction = (rowData: Order, { canDelete }: Permission): MenuItemProps[] => {
  const { t } = useTranslation('common');

  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (name: string, id: string) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: name,
        id: id,
      })}`,
    });
  };

  return [
    {
      title: t('common:edit'),
      icon: <EditIcon />,
      action: () => {
        handleClick(ModalTypes.OrderDetails, rowData.order_number);
      },
    },
    ...(canDelete
      ? [
          {
            title: t('common:delete'),
            icon: <TrashIcon />,
            className: 'pw-text-red-500',
            action: async () => {
              // TODO
            },
            showConfirm: true,
          },
        ]
      : []),
  ];
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
    dateRange: [startOfMonth(new Date()), endOfDay(new Date())],
  },
};

export const filterOptions = () => {
  const { t } = useTranslation(['filters', 'orders-table']);
  return {
    primary: {
      search: {
        type: ComponentType.Text,
        placeholder: t('orders-table.search-offline'),
        className: 'pw-w-80',
        defaultValue: '',
        icon: 'search',
        size: 'lg',
      },
      dateRange: {
        type: ComponentType.DateRange,
        placeholder: t('orders-table.daterange'),
        defaultValue: [startOfMonth(new Date()), endOfDay(new Date())],
        className: 'pw-w-64',
        size: 'lg',
      },
    },
  };
};
