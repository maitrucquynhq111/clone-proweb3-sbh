import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { BsPencilFill } from 'react-icons/bs';
import { endOfDay, format, startOfMonth } from 'date-fns';
import { Tag } from 'rsuite';
import { ActionMenu, MenuItemProps } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { convertDateFilter, formatCurrency } from '~app/utils/helpers';
import { InventoryStatus } from '~app/utils/constants';
import { StatusInventory } from '~app/features/warehouse/utils';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';

const dataMenuAction = (
  rowData: InventoryImportBook,
  onClick: (rowData: InventoryImportBook) => void,
): MenuItemProps[] => {
  const { t } = useTranslation('common');

  return [
    {
      title: t('common:edit'),
      icon: <BsPencilFill className="pw-text-primary-main" />,
      action: () => onClick(rowData),
    },
  ];
};

type Props = {
  onClick(rowData: InventoryImportBook): void;
};

export const columnOptions = ({ onClick }: Props) => {
  const { t } = useTranslation('inventory-export-book-table');
  const canUpdateHistoricalCost = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);
  let total = null;
  if (canUpdateHistoricalCost) {
    total = {
      flexGrow: 1,
      label: t('total'),
      align: 'right',
      cell: ({ rowData }: { rowData: InventoryImportBook }) => {
        return (
          <div className="pw-flex pw-items-center pw-justify-end pw-p-2 pw-w-full pw-text-sm">
            {formatCurrency(rowData.total_amount)}
          </div>
        );
      },
    };
  }
  return {
    order_info: {
      flexGrow: 1,
      label: t('order_info'),
      cell: ({ rowData }: { rowData: InventoryImportBook }) => {
        return <div className="pw-p-2 pw-w-full pw-text-sm">{rowData.po_code}</div>;
      },
    },
    created_at: {
      width: 160,
      label: t('created_at'),
      cell: ({ rowData }: { rowData: InventoryImportBook }) => {
        return (
          <div className="pw-p-2 pw-w-full pw-text-sm">{format(new Date(rowData.created_at), 'dd/MM/yyyy HH:mm')}</div>
        );
      },
    },
    staff: {
      flexGrow: 1,
      label: t('staff'),
      cell: ({ rowData }: { rowData: InventoryImportBook }) => {
        return (
          <div className="pw-flex pw-items-center pw-p-2 pw-w-full pw-text-sm">
            {rowData?.staff_info?.staff_name || rowData.staff_info?.phone_number}
          </div>
        );
      },
    },
    status: {
      flexGrow: 0.7,
      label: t('status'),
      align: 'center',
      cell: ({ rowData }: { rowData: InventoryImportBook }) => {
        const state = rowData.status as StatusInventory;
        return (
          <div className="pw-flex pw-items-center pw-justify-center pw-p-2 pw-w-full">
            <Tag className={cx('!pw-text-white !pw-font-semibold', InventoryStatus[state]?.bgColor)}>
              {t(`status_filter.${InventoryStatus[state]?.name}`)}
            </Tag>
          </div>
        );
      },
    },
    total,
    action: {
      width: 50,
      label: '',
      cell: ({ rowData }: { rowData: InventoryImportBook }) => {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ActionMenu data={dataMenuAction(rowData, onClick)} />
          </div>
        );
      },
    },
  };
};

export const initFilterValues = {
  primary: {
    search: '',
    dateRange: [startOfMonth(new Date()), endOfDay(new Date())],
    type: 'outbound',
  },
  secondary: {
    status: [],
    object_type: [],
  },
};

export const convertFilter = (filter: ExpectedAny) => {
  const { dateRange, status = [], object_type = [], ...rest } = filter;
  return {
    ...rest,
    ...convertDateFilter(dateRange),
    status: status.map((item: string) => {
      return JSON.parse(item).value;
    }),
    object_type: object_type.map((item: string) => {
      return JSON.parse(item).value;
    }),
  };
};

export const filterOptions = () => {
  const { t } = useTranslation('filters');
  return {
    primary: {
      search: {
        type: ComponentType.Text,
        placeholder: t('inventory-export-book-table.search'),
        value: '',
        icon: 'search',
        className: '!pw-w-80',
        size: 'lg',
      },
      dateRange: {
        type: ComponentType.DateRange,
        placeholder: t('inventory-table.daterange'),
        defaultValue: [startOfMonth(new Date()), endOfDay(new Date())],
        className: 'pw-w-60',
        size: 'lg',
      },
    },
    secondary: {
      object_type: {
        type: ComponentType.TagPicker,
        placeholder: t('inventory-export-book-table.type'),
        label: t('inventory-export-book-table.type'),
        menuMaxHeight: 200,
        size: 'lg',
        container: () => document.getElementById('filter'),
        data: [
          {
            label: t('inventory-table:type.product'),
            value: JSON.stringify({
              label: t('inventory-table:type.product'),
              value: 'sku',
            }),
          },
          {
            label: t('inventory-table:type.ingredient'),
            value: JSON.stringify({
              label: t('inventory-table:type.ingredient'),
              value: 'ingredient',
            }),
          },
        ],
      },
      status: {
        type: ComponentType.TagPicker,
        placeholder: t('inventory-export-book-table.status'),
        label: t('inventory-export-book-table.status'),
        menuMaxHeight: 200,
        size: 'lg',
        container: () => document.getElementById('filter'),
        data: [
          {
            label: t('inventory-export-book-table:status_filter.completed'),
            value: JSON.stringify({
              label: t('inventory-export-book-table:status_filter.completed'),
              value: 'completed',
            }),
          },
          {
            label: t('inventory-export-book-table:status_filter.processing'),
            value: JSON.stringify({
              label: t('inventory-export-book-table:status_filter.processing'),
              value: 'processing',
            }),
          },
          {
            label: t('inventory-export-book-table:status_filter.cancelled'),
            value: JSON.stringify({
              label: t('inventory-export-book-table:status_filter.cancelled'),
              value: 'cancelled',
            }),
          },
        ],
      },
    },
  };
};
