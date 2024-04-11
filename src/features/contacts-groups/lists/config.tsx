import { useTranslation } from 'react-i18next';
import { BsPencilFill, BsTrash } from 'react-icons/bs';
import { ActionMenu, MenuItemProps } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { formatCurrency } from '~app/utils/helpers';

const dataMenuAction = (
  rowData: ContactGroup,
  onClick: (rowData: ContactGroup, action: string) => void,
): MenuItemProps[] => {
  const { t } = useTranslation('common');

  return [
    {
      title: t('common:edit'),
      icon: <BsPencilFill className="pw-text-primary-main" />,
      action: () => onClick(rowData, 'edit'),
    },
    {
      title: t('common:delete'),
      icon: <BsTrash />,
      className: 'pw-text-red-500',
      action: async () => onClick(rowData, 'delete'),
    },
  ];
};

export const columnOptions = ({ onClick }: { onClick(rowData: ContactGroup, action: string): void }) => {
  const { t } = useTranslation('contacts-groups-table');
  return {
    name: {
      label: t('name'),
      flexGrow: 1,
      cell: ({ rowData }: { rowData: ContactGroup }) => {
        return <span className="pw-w-full pw-text-left pw-text-sm pw-pl-4">{rowData.name}</span>;
      },
    },
    number_of_contact: {
      flexGrow: 0.5,
      className: 'pw-text-right',
      label: t('number_of_contact'),
      cell: ({ rowData }: { rowData: ContactGroup }) => {
        return (
          <div className="pw-text-right pw-text-sm pw-w-full pw-px-4 pw-font-semibold">
            {formatCurrency(rowData?.number_of_contact || 0)}
          </div>
        );
      },
    },
    amount_in: {
      flexGrow: 1,
      className: 'pw-text-right',
      label: t('total_receivable'),
      cell: ({ rowData }: { rowData: ContactGroup }) => {
        return (
          <div className="pw-text-right pw-text-sm pw-w-full pw-px-4 pw-font-semibold pw-text-primary-main">
            {rowData.total_amount_in ? formatCurrency(rowData.total_amount_in).replace('-', '') : ''}
          </div>
        );
      },
    },
    amount_out: {
      flexGrow: 1,
      className: 'pw-text-right',
      label: t('total_paid'),
      cell: ({ rowData }: { rowData: ContactGroup }) => {
        return (
          <div className="pw-text-right pw-text-sm pw-w-full pw-px-4 pw-font-semibold pw-text-secondary-main">
            {rowData.total_amount_out ? formatCurrency(rowData.total_amount_out).replace('-', '') : ''}
          </div>
        );
      },
    },
    action: {
      width: 50,
      label: '',
      cell: ({ rowData }: { rowData: ContactGroup }) => {
        return (
          <div
            className="pw-flex pw-justify-center"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ActionMenu data={dataMenuAction(rowData, onClick)} />
          </div>
        );
      },
    },
  };
};

export const initFilterValues = {
  search: '',
};

export const filterOptions = () => {
  const { t } = useTranslation('filters');
  return {
    primary: {
      search: {
        type: ComponentType.Text,
        placeholder: t('contacts-groups-table.search'),
        defaultValue: '',
        icon: 'search',
        className: '!pw-w-80',
        size: 'lg',
      },
    },
  };
};
