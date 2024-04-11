import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Tag } from 'rsuite';
import { endOfDay, startOfDay } from 'date-fns';
import { formatDateToString } from '~app/utils/helpers';
import { StockTakingAnalyticStatus, StockTakingAnalyticStatusOption } from '~app/utils/constants';
import { ComponentType } from '~app/components/HookForm/utils';
import { useGetPoStaffs } from '~app/services/queries';

export const columnOptions = () => {
  const { t } = useTranslation('stocktaking-table');
  return {
    po_code: {
      label: t('po_code'),
      key: 'po_code',
      flexGrow: 1,
      cell: ({ rowData }: { rowData: InventoryStockTaking }) => {
        return <div className="pw-text-sm pw-w-full pw-text-left pw-px-2.5">#{rowData.po_code}</div>;
      },
    },
    created_at: {
      label: t('created_at'),
      key: 'created_at',
      flexGrow: 1,
      cell: ({ rowData }: { rowData: InventoryStockTaking }) => {
        return (
          <div className="pw-text-sm pw-w-full pw-text-left pw-px-2.5">
            {formatDateToString(rowData.created_at, 'HH:mm dd/MM/yyyy')}
          </div>
        );
      },
    },
    staff_info: {
      label: t('staff_info'),
      flexGrow: 1,
      cell: ({ rowData }: { rowData: InventoryStockTaking }) => {
        return <div className="pw-text-sm pw-w-full pw-text-left pw-px-2.5">{rowData.staff_info.staff_name}</div>;
      },
    },
    status: {
      label: t('status'),
      key: 'status',
      className: 'pw-text-center ',
      flexGrow: 1,
      cell: ({ rowData }: { rowData: InventoryStockTaking }) => {
        const status = rowData.status as StockTakingAnalyticStatus;
        if (!status) return null;
        return (
          <Tag
            className={cx(
              'pw-text-sm !pw-text-neutral-white pw-font-semibold pw-px-2',
              StockTakingAnalyticStatusOption[status].bgColor,
            )}
          >
            {t(StockTakingAnalyticStatusOption[status].title)}
          </Tag>
        );
      },
    },
    difference: {
      label: t('difference'),
      flexGrow: 1,
      align: 'right',
      cell: ({ rowData }: { rowData: InventoryStockTaking }) => {
        const { total_quantity } = rowData;
        return (
          <div className="pw-text-sm pw-w-full pw-text-right pw-font-bold pw-px-2.5">
            {Number(total_quantity.toFixed(4))}
          </div>
        );
      },
    },
  };
};

export const convertDate = (date: Date[] = []) => {
  return date?.length > 0
    ? {
        startTime: formatDateToString(startOfDay(date?.[0] as Date), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        endTime: formatDateToString(endOfDay(date?.[1] as Date), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      }
    : {
        startTime: '',
        endTime: '',
      };
};

export const convertFilter = (filter: ExpectedAny) => {
  const { dateRange, status, object_type = [], staff_ids = [], ...rest } = filter;
  return {
    ...rest,
    ...convertDate(dateRange),
    status,
    objectType: object_type
      .map((item: string) => {
        return JSON.parse(item).value;
      })
      .join('|'),
    staffIds: staff_ids
      .map((item: string) => {
        return JSON.parse(item).value;
      })
      .join(','),
  };
};

export const initFilterValues = {
  primary: {
    search: '',
    dateRange: [startOfDay(new Date()), endOfDay(new Date())],
  },
  secondary: {
    object_type: [],
    staff_ids: [],
  },
};

export const filterOptions = () => {
  const { t } = useTranslation(['filters', 'stocktaking-table']);
  return {
    primary: {
      search: {
        type: ComponentType.Text,
        placeholder: t('stocktaking-table.search'),
        className: 'pw-w-60',
        defaultValue: '',
        icon: 'search',
        size: 'lg',
      },
      dateRange: {
        type: ComponentType.DateRange,
        placeholder: t('stocktaking-table.daterange'),
        defaultValue: [startOfDay(new Date()), endOfDay(new Date())],
        className: 'pw-w-60',
        size: 'lg',
      },
    },
    secondary: {
      object_type: {
        type: ComponentType.TagPicker,
        placeholder: t('stocktaking-table.all'),
        label: t('stocktaking-table.product_type'),
        menuMaxHeight: 200,
        size: 'lg',
        container: () => document.getElementById('filter'),
        data: [
          {
            label: t('stocktaking-table.product'),
            value: JSON.stringify({
              label: t('stocktaking-table.product'),
              value: 'sku',
            }),
          },
          {
            label: t('stocktaking-table.ingredient'),
            value: JSON.stringify({
              label: t('stocktaking-table.ingredient'),
              value: 'ingredient',
            }),
          },
        ],
      },
      staff_ids: {
        type: ComponentType.TagPicker,
        placeholder: t('stocktaking-table.all'),
        async: true,
        label: t('stocktaking-table.staff'),
        menuMaxHeight: 200,
        size: 'lg',
        initStateFunc: () => ({
          type: 'stocktake',
        }),
        container: () => document.getElementById('filter'),
        query: useGetPoStaffs,
        mapFunc: (item: InventoryStaffInfo) => ({
          label: item.staff_name,
          value: JSON.stringify({
            label: item.staff_name,
            value: item.staff_id,
          }),
        }),
      },
    },
  };
};
