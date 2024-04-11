import { useTranslation } from 'react-i18next';
import { BsPencilFill } from 'react-icons/bs';
import { endOfDay, format, startOfMonth } from 'date-fns';
import { ActionMenu, MenuItemProps } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { convertDateFilter, formatCurrency } from '~app/utils/helpers';
import { useInventoryCategoriesQuery, useStaffsQuery } from '~app/services/queries';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';

const dataMenuAction = (rowData: Inventory, onClick: (rowData: Inventory) => void): MenuItemProps[] => {
  const { t } = useTranslation('common');

  return [
    {
      title: t('common:edit'),
      icon: <BsPencilFill className="pw-text-primary-main" />,
      action: () => {
        onClick(rowData);
      },
    },
  ];
};

type Props = {
  onClick(rowData: Inventory): void;
};

export const columnOptions = ({ onClick }: Props) => {
  const { t } = useTranslation('inventory-table');
  const canUpdateHistoricalCost = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);
  let value = null;
  if (canUpdateHistoricalCost) {
    value = {
      sortable: true,
      flexGrow: 0.7,
      label: t('value'),
      align: 'right',
      cell: ({ rowData }: { rowData: Inventory }) => {
        return (
          <div className="pw-flex pw-items-center pw-justify-end pw-p-2 pw-w-full pw-text-sm pw-font-semibold">
            {formatCurrency(rowData.quantity * rowData.pricing)}
          </div>
        );
      },
    };
  }
  return {
    po_code: {
      flexGrow: 0.5,
      label: t('po_code'),
      cell: ({ rowData }: { rowData: Inventory }) => {
        return (
          <div className="pw-p-2 pw-w-full">
            <p className="pw-text-sm">{rowData.po_code}</p>
            <p className="pw-text-2sm pw-text-neutral-secondary">
              {format(new Date(rowData.created_at), 'dd/MM/yyyy')}
            </p>
          </div>
        );
      },
    },
    sku_info: {
      flexGrow: 1,
      label: t('sku_ingredient'),
      cell: ({ rowData }: { rowData: Inventory }) => {
        return (
          <div className="pw-p-2 pw-w-full">
            <p className="pw-text-sm">{rowData.sku_info?.product_name || rowData.sku_info?.name}</p>
            <p className="pw-text-2sm pw-text-neutral-secondary">{rowData.sku_info?.sku_code || ''}</p>
          </div>
        );
      },
    },
    category_name: {
      flexGrow: 0.5,
      label: t('category_name'),
      cell: ({ rowData }: { rowData: Inventory }) => {
        return <div className="pw-flex pw-items-center pw-p-2 pw-w-full pw-text-sm">{rowData.category_name}</div>;
      },
    },
    quantity: {
      sortable: true,
      flexGrow: 0.5,
      label: t('quantity'),
      align: 'right',
      cell: ({ rowData }: { rowData: Inventory }) => {
        return (
          <div className="pw-flex pw-items-center pw-justify-end pw-p-2 pw-w-full pw-text-sm pw-font-semibold">
            {`${rowData.transaction_type === 'in' ? '+' : '-'}${formatCurrency(rowData.quantity)}`}
          </div>
        );
      },
    },
    value,
    action: {
      width: 50,
      label: '',
      cell: ({ rowData }: { rowData: Inventory }) => {
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
  },
  secondary: {
    type: [],
    category_name: [],
    staff_id: [],
  },
};

export const convertFilter = (filter: ExpectedAny) => {
  const { dateRange, type = [], category_name = [], staff_id = [], ...rest } = filter;
  return {
    ...rest,
    ...convertDateFilter(dateRange),
    type: type.map((item: string) => {
      return JSON.parse(item).value;
    }),
    category_name: category_name.map((item: string) => {
      return JSON.parse(item).value;
    }),
    staff_id: staff_id.map((item: string) => {
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
        placeholder: t('inventory-table.search'),
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
      type: {
        type: ComponentType.TagPicker,
        placeholder: t('inventory-table.type'),
        label: t('inventory-table.type'),
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
      category_name: {
        type: ComponentType.CheckPicker,
        placeholder: t('inventory-table.category'),
        async: true,
        label: t('inventory-table.category'),
        menuMaxHeight: 200,
        size: 'lg',
        defaultValue: initFilterValues.secondary.category_name,
        initStateFunc: () => ({ page: 1, page_size: 20 }),
        container: () => document.getElementById('filter'),
        query: useInventoryCategoriesQuery,
        mapFunc: (item: InventoryCategory) => ({
          label: item.name,
          value: JSON.stringify({
            label: item.name,
            value: item.name,
          }),
        }),
      },
      staff_id: {
        type: ComponentType.CheckPicker,
        placeholder: t('inventory-table.staff'),
        async: true,
        label: t('inventory-table.staff'),
        menuMaxHeight: 200,
        initStateFunc: () => ({
          page: 1,
          page_size: 10,
        }),
        searchKey: 'search',
        size: 'lg',
        defaultValue: initFilterValues.secondary.staff_id,
        container: () => document.getElementById('filter'),
        query: useStaffsQuery,
        mapFunc: (item: StaffInfo) => ({
          label: item.user_name,
          value: JSON.stringify({
            label: item.user_name,
            value: item.user_id,
          }),
        }),
      },
    },
  };
};
