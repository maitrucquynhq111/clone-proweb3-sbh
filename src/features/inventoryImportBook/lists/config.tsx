import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { BsPencilFill } from 'react-icons/bs';
import { endOfDay, format, startOfMonth } from 'date-fns';
import { Tag } from 'rsuite';
import { ActionMenu, MenuItemProps } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { convertDateFilter, formatCurrency } from '~app/utils/helpers';
import { useContactsPurchaseOrder } from '~app/services/queries';
import { PaymentState } from '~app/utils/constants';
import { PaymentStateInventory } from '~app/features/warehouse/utils';
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
  const { t } = useTranslation('inventory-import-book-table');
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
    supplier: {
      flexGrow: 1,
      label: t('supplier'),
      cell: ({ rowData }: { rowData: InventoryImportBook }) => {
        return (
          <div className="pw-flex pw-items-center pw-p-2 pw-w-full pw-text-sm">
            {rowData?.contact_info?.name || rowData.contact_info?.phone_number}
          </div>
        );
      },
    },
    payment: {
      flexGrow: 0.7,
      label: t('payment'),
      align: 'center',
      cell: ({ rowData }: { rowData: InventoryImportBook }) => {
        const state = rowData.payment_state as PaymentStateInventory;
        return (
          <div className="pw-flex pw-items-center pw-justify-center pw-p-2 pw-w-full">
            <Tag className={cx('!pw-text-white !pw-font-semibold', PaymentState[state]?.bgColor)}>
              {t(`common:payment_state.${PaymentState[state]?.name}`)}
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
    type: 'inbound',
  },
  secondary: {
    payment_state: [],
    object_type: [],
    category_name: [],
    contact_id: [],
  },
};

export const convertFilter = (filter: ExpectedAny) => {
  const { dateRange, payment_state = [], object_type = [], category_name = [], contact_id = [], ...rest } = filter;
  return {
    ...rest,
    ...convertDateFilter(dateRange),
    payment_state: payment_state.map((item: string) => {
      return JSON.parse(item).value;
    }),
    object_type: object_type.map((item: string) => {
      return JSON.parse(item).value;
    }),
    category_name: category_name.map((item: string) => {
      return JSON.parse(item).value;
    }),
    contact_id: contact_id.map((item: string) => {
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
        placeholder: t('inventory-import-book-table.search'),
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
      payment_state: {
        type: ComponentType.TagPicker,
        placeholder: t('inventory-import-book-table.payment_state'),
        label: t('inventory-import-book-table.payment_state'),
        menuMaxHeight: 200,
        size: 'lg',
        container: () => document.getElementById('filter'),
        data: [
          {
            label: t('common:payment_state.un_paid'),
            value: JSON.stringify({
              label: t('common:payment_state.un_paid'),
              value: 'un_paid',
            }),
          },
          {
            label: t('common:payment_state.partial_paid'),
            value: JSON.stringify({
              label: t('common:payment_state.partial_paid'),
              value: 'partial_paid',
            }),
          },
          {
            label: t('common:payment_state.paid'),
            value: JSON.stringify({
              label: t('common:payment_state.paid'),
              value: 'paid',
            }),
          },
        ],
      },
      object_type: {
        type: ComponentType.TagPicker,
        placeholder: t('inventory-import-book-table.type'),
        label: t('inventory-import-book-table.type'),
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
      contact_id: {
        type: ComponentType.CheckPicker,
        placeholder: t('inventory-table.supplier'),
        async: true,
        label: t('inventory-table.supplier'),
        menuMaxHeight: 200,
        initStateFunc: () => ({
          page: 1,
          page_size: 10,
        }),
        searchKey: 'search',
        size: 'lg',
        defaultValue: initFilterValues.secondary.contact_id,
        container: () => document.getElementById('filter'),
        query: useContactsPurchaseOrder,
        mapFunc: (item: InventoryContactInfo) => ({
          label: item.name || item.phone_number,
          value: JSON.stringify({
            label: item.name || item.phone_number,
            value: item.id,
          }),
        }),
      },
    },
  };
};
