import { endOfDay, startOfMonth } from 'date-fns';
import { Trans, useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';
import { numberFormat } from '~app/configs';
import { convertDateFilter, formatDateToString, formatPhoneWithZero, hidePhoneNumber } from '~app/utils/helpers';

const AFFILIATE_FILTER = [
  {
    label: 'commission-table.plus_year_1',
    value: 'plus_year_1',
  },
  {
    label: 'commission-table.month_6',
    value: 'month_6',
  },
  {
    label: 'commission-table.year_1',
    value: 'year_1',
  },
  {
    label: 'commission-table.year_2',
    value: 'year_2',
  },
  {
    label: 'commission-table.year_3',
    value: 'year_3',
  },
  {
    label: 'commission-table.non_upgrade',
    value: 'non_upgrade',
  },
];

export function convertFilter(filter: ExpectedAny) {
  const { dateRange, filter_key = [], ...rest } = filter;
  return {
    ...rest,
    ...convertDateFilter(dateRange),
    filter_key: filter_key.map((item: string) => {
      return JSON.parse(item).value;
    }),
  };
}

export function columnOptions() {
  const { t } = useTranslation('commission-table');
  return {
    receiver_name: {
      label: t('presentee'),
      flexGrow: 1,
      minWidth: 200,
      key: 'tracking_info.receiver_name',
      justifyContent: 'flex-start',
      cell: ({ rowData }: { rowData: Commission }) => {
        if (rowData?.tracking_info?.receiver_name) {
          return <div className="pw-w-full pw-px-2">{rowData.tracking_info.receiver_name || ''}</div>;
        }
        return (
          <div className="pw-w-full pw-px-2">
            {hidePhoneNumber(formatPhoneWithZero(rowData?.tracking_info?.receiver_phone_number || ''))}
          </div>
        );
      },
    },
    presenter: {
      label: t('presenter'),
      flexGrow: 1,
      minWidth: 200,
      justifyContent: 'flex-start',
      key: 'trainer_name',
      cell: ({ rowData }: { rowData: Commission }) => {
        const refPhoneNumber = formatPhoneWithZero(rowData?.tracking_info?.ref_phone_number || '');
        const senderName = rowData?.tracking_info?.sender_name || refPhoneNumber;
        const refCode = rowData?.tracking_info?.referral_code || '';
        return (
          <div className="pw-w-full pw-px-2">{`${senderName} ${senderName && refCode ? ' - ' : ''} ${refCode}`}</div>
        );
      },
    },
    presentee_phone_number: {
      label: t('presentee_phone_number'),
      flexGrow: 1,
      minWidth: 150,
      justifyContent: 'flex-start',
      key: 'tracking_info.receiver_phone_number',
      cell: ({ rowData }: { rowData: Commission }) => {
        return (
          <div className="pw-w-full pw-px-2">
            {hidePhoneNumber(formatPhoneWithZero(rowData?.tracking_info?.receiver_phone_number || ''))}
          </div>
        );
      },
    },
    upgrade_package: {
      label: t('upgrade_package'),
      key: 'package_duration',
      flexGrow: 1,
      minWidth: 150,
      justifyContent: 'flex-start',
      cell: ({ rowData }: { rowData: Commission }) => {
        let value = rowData?.package_duration || '';
        if (value.includes('plus_year_1')) {
          return (
            <div className="pw-w-full pw-px-2">
              <Trans t={t} i18nKey="package_plus_duration_year" values={{ count: 1 }} />
            </div>
          );
        }
        if (value.includes('year')) {
          value = value.split('_')?.[1] || '';
          return (
            <div className="pw-w-full pw-px-2">
              <Trans t={t} i18nKey="package_pro_duration_year" values={{ count: value }} />
            </div>
          );
        }
        if (value.includes('month')) {
          value = value.split('_')?.[1] || '';
          return (
            <div className="pw-w-full pw-px-2">
              <Trans t={t} i18nKey="package_pro_duration_month" values={{ count: value }} />
            </div>
          );
        }
        return <div className="pw-w-full pw-px-2">{t(value)}</div>;
      },
    },
    upgrade_date: {
      sortable: true,
      label: t('upgrade_date'),
      flexGrow: 1,
      key: 'upgraded_at',
      align: 'center',
      minWidth: 150,
      cell: ({ rowData }: { rowData: Commission }) => {
        return (
          <div className="pw-w-full pw-px-2">
            {rowData?.upgraded_at ? formatDateToString(rowData?.upgraded_at) : ''}
          </div>
        );
      },
    },
    payment_amount: {
      label: t('payment_amount'),
      flexGrow: 1,
      key: 'payment_amount',
      align: 'right',
      minWidth: 150,
      justifyContent: 'flex-end',
      cell: ({ rowData }: { rowData: Commission }) => {
        return (
          <div className="pw-w-full pw-px-2">
            {rowData?.tracking_info?.payment_amount
              ? numberFormat.format(parseInt(rowData.tracking_info.payment_amount.toFixed(), 10))
              : ''}
          </div>
        );
      },
    },
    commission_percent: {
      label: t('commission_percent'),
      flexGrow: 1,
      key: 'commission_percent',
      align: 'right',
      justifyContent: 'flex-end',
      minWidth: 150,
      cell: ({ rowData }: { rowData: Commission }) => {
        return (
          <div className="pw-w-full pw-px-2">{rowData?.commission_percent ? `${rowData.commission_percent}%` : ''}</div>
        );
      },
    },
    commission_amount: {
      label: t('commission_amount'),
      flexGrow: 1,
      key: 'commission_amount',
      align: 'right',
      justifyContent: 'flex-end',
      minWidth: 150,
      cell: ({ rowData }: { rowData: Commission }) => {
        return (
          <div className="pw-w-full pw-px-2">
            {rowData?.commission_amount ? numberFormat.format(parseInt(rowData.commission_amount.toFixed(), 10)) : ''}
          </div>
        );
      },
    },
  };
}

export const initFilterValues = {
  primary: {
    search: '',
    senderPhone: '',
    dateRange: [startOfMonth(new Date()), endOfDay(new Date())],
  },
  secondary: {
    filter_key: [],
  },
};

export function filterOptions() {
  const { t } = useTranslation('filters');
  return {
    primary: {
      search: {
        type: ComponentType.Text,
        placeholder: t('commission-table.search'),
        className: 'pw-w-full md:pw-w-64',
        defaultValue: '',
        icon: 'search',
        size: 'lg',
      },
      senderPhone: {
        type: ComponentType.Text,
        placeholder: t('commission-table.sender_phone'),
        className: 'pw-w-full md:pw-w-64',
        defaultValue: '',
        icon: 'search',
        size: 'lg',
      },
      dateRange: {
        type: ComponentType.DateRange,
        placeholder: t('orders-table.daterange'),
        defaultValue: [startOfMonth(new Date()), endOfDay(new Date())],
        className: 'pw-w-full md:pw-w-64',
        size: 'lg',
      },
    },
    secondary: {
      filter_key: {
        type: ComponentType.TagPicker,
        menuMaxHeight: 200,
        size: 'sm',
        label: t('commission-table.upgrade_package'),
        placeholder: t('commission-table.upgrade_package'),
        container: () => document.getElementById('filter'),
        data: AFFILIATE_FILTER.map((item) => {
          return {
            label: t(item.label),
            value: JSON.stringify({
              label: t(item.label),
              value: item.value,
            }),
          };
        }),
      },
    },
  };
}
