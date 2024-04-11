import { useTranslation } from 'react-i18next';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { BsPrinterFill, BsPencilFill, BsTrash } from 'react-icons/bs';
import { Button, Tag, Tooltip, Whisper } from 'rsuite';
import cx from 'classnames';
import { WiMoonAltFirstQuarter, WiMoonAltFull, WiMoonAltNew } from 'react-icons/wi';
import { endOfDay, startOfMonth } from 'date-fns';
import { OrderInfoCell } from './components';
import { ActionMenu, MenuItemProps } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { OrderPermission, useHasPermissions } from '~app/utils/shield';
import { ModalTypes } from '~app/modals';
import { OrderStatus, OrderStatusType } from '~app/utils/constants';
import { convertDateFilter, formatCurrency, formatDateToString } from '~app/utils/helpers';
import { usePaymentSourcesQuery, useGetListStaffQuery } from '~app/services/queries';

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
      icon: <BsTrash />,
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

const dataMenuAction = (rowData: Order, { canDelete, canView }: Permission, onClick: ExpectedAny): MenuItemProps[] => {
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
    ...(canView
      ? [
          {
            title: t('common:edit'),
            icon: <BsPencilFill className="pw-text-primary-main" />,
            action: () => {
              handleClick(ModalTypes.OrderDetails, rowData.order_number);
            },
          },
        ]
      : []),
    ...(canDelete &&
    (rowData.state === OrderStatusType.WAITING_CONFIRM ||
      rowData.state === OrderStatusType.DELIVERING ||
      rowData.state === OrderStatusType.COMPLETE)
      ? [
          {
            title: t('common:delete'),
            icon: <BsTrash />,
            className: 'pw-text-red-500',
            action: async () => {
              onClick(rowData, 'cancel');
            },
          },
        ]
      : []),
  ];
};

const paymentDot = (rowData: Order) => {
  const { t } = useTranslation('orders-table');
  let content = {
    icon: <WiMoonAltFirstQuarter className="pw-text-success-active" size={22} />,
    text: t('partial_payment'),
  };
  if (rowData.amount_paid === rowData.grand_total) {
    content = {
      icon: <WiMoonAltNew className="pw-text-success-active" size={22} />,
      text: t('paid'),
    };
  } else if (!rowData.amount_paid) {
    content = {
      icon: <WiMoonAltFull className="pw-text-green-600" size={22} />,
      text: t('unpaid'),
    };
  }
  return (
    <Whisper placement="autoVerticalEnd" trigger="hover" speaker={<Tooltip arrow={false}>{content.text}</Tooltip>}>
      <div>{content.icon}</div>
    </Whisper>
  );
};

const returnDot = (rowData: Order) => {
  const { t } = useTranslation('orders-form');
  let content = {
    icon: <WiMoonAltFirstQuarter className="pw-text-neutral-placeholder" size={22} />,
    text: t('partial_return'),
  };
  if (rowData.is_full_return) {
    content = {
      icon: <WiMoonAltNew className="pw-text-neutral-placeholder" size={22} />,
      text: t('full_return'),
    };
  } else {
    content = {
      icon: <WiMoonAltFirstQuarter className="pw-text-neutral-placeholder" size={22} />,
      text: t('partial_return'),
    };
  }
  return (
    <Whisper placement="autoVerticalEnd" trigger="hover" speaker={<Tooltip arrow={false}>{content.text}</Tooltip>}>
      <div>{content.icon}</div>
    </Whisper>
  );
};

const actionButton = (rowData: Order, canCompleteOrder: boolean, onClick: ExpectedAny) => {
  const { t } = useTranslation('orders-table');
  if (rowData.state === OrderStatusType.WAITING_CONFIRM) {
    return (
      <Button appearance="primary" onClick={() => onClick(rowData)}>
        {t('action_button.confirm')}
      </Button>
    );
  }
  if (rowData.state === OrderStatusType.DELIVERING && canCompleteOrder) {
    return (
      <Button appearance="ghost" onClick={() => onClick(rowData)}>
        {t('action_button.delivered')}
      </Button>
    );
  }
  return <div />;
};

type ColumnOptionsProps = {
  status: string;
  onClick(order: Order): void;
};

export const columnOptions = ({ status, onClick }: ColumnOptionsProps) => {
  const { t } = useTranslation('orders-table');
  const canDelete = useHasPermissions([OrderPermission.ORDER_ORDERDETAIL_DELETE]);
  const canViewDetail = useHasPermissions([OrderPermission.ORDER_ORDERDETAIL_UPDATE]);
  const canCompleteOrder = useHasPermissions([OrderPermission.ORDER_ORDERDETAIL_COMPLETE]);
  let state = null;
  if (status === '') {
    state = {
      label: t('state'),
      className: 'pw-text-center ',
      flexGrow: 0.5,
      minWidth: 150,
      cell: ({ rowData }: { rowData: ExpectedAny }) => {
        const state = rowData.state as OrderStatusType;
        return state === OrderStatusType.RETURN ? (
          <div className="pw-flex pw-gap-x-2">
            <Tag className={cx('!pw-text-white !pw-font-semibold pw-text-sm', OrderStatus.complete.bgColor)}>
              {t(`common:order-status.${OrderStatus.complete.name}`)}
            </Tag>
            {returnDot(rowData)}
          </div>
        ) : (
          <Tag className={cx('!pw-text-white !pw-font-semibold pw-text-sm', OrderStatus[state]?.bgColor)}>
            {t(`common:order-status.${OrderStatus[state]?.name}`)}
          </Tag>
        );
      },
    };
  }

  let button = null;
  if (status === '' || status === OrderStatusType.WAITING_CONFIRM || status === OrderStatusType.DELIVERING) {
    button = {
      width: 120,
      label: t('action'),
      cell: ({ rowData }: { rowData: Order }) => {
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {actionButton(rowData, canCompleteOrder, onClick)}
          </div>
        );
      },
    };
  }

  let payment: ExpectedAny = {
    width: 125,
    label: t('payment'),
    cell: ({ rowData }: { rowData: Order }) => paymentDot(rowData),
  };
  if (status === OrderStatusType.REFUND) payment = null;

  let updated_order_at = null;
  let created_at: ExpectedAny = null;
  let action = null;
  if (status === '' || status === OrderStatusType.WAITING_CONFIRM || status === OrderStatusType.DELIVERING) {
    created_at = {
      label: t('created_at'),
      width: 150,
      isDateTime: true,
      cell: ({ rowData }: { rowData: Order }) => {
        return (
          <div className="pw-w-full pw-px-2 pw-text-sm">
            {formatDateToString(rowData.created_at, 'dd/MM/yyyy HH:mm')}
          </div>
        );
      },
    };
  }

  if (status === OrderStatusType.REFUND) {
    created_at = {
      label: t('refund_at'),
      width: 150,
      isDateTime: true,
      cell: ({ rowData }: { rowData: Order }) => {
        return (
          <div className="pw-w-full pw-px-2 pw-text-sm">
            {formatDateToString(rowData.created_at, 'dd/MM/yyyy HH:mm')}
          </div>
        );
      },
    };
  }

  if (status === OrderStatusType.COMPLETE) {
    updated_order_at = {
      label: t('complete_at'),
      width: 150,
      isDateTime: true,
      cell: ({ rowData }: { rowData: Order }) => {
        return (
          <div className="pw-w-full pw-px-2 pw-text-sm">
            {formatDateToString(rowData.updated_order_at || new Date(), 'dd/MM/yyyy HH:mm')}
          </div>
        );
      },
    };
  }

  if (status === OrderStatusType.CANCEL) {
    updated_order_at = {
      label: t('cancelled_at'),
      width: 150,
      isDateTime: true,
      cell: ({ rowData }: { rowData: Order }) => {
        return (
          <div className="pw-w-full pw-px-2 pw-text-sm">
            {formatDateToString(rowData.updated_order_at || new Date(), 'dd/MM/yyyy HH:mm')}
          </div>
        );
      },
    };
  }

  if (canDelete || canViewDetail) {
    action = {
      width: 50,
      label: '',
      cell: ({ rowData }: { rowData: Order }) => {
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ActionMenu
              data={dataMenuAction(
                rowData,
                {
                  canDelete,
                  canView: canViewDetail,
                },
                onClick,
              )}
            />
          </div>
        );
      },
    };
  }

  return {
    order_number: {
      fixed: true,
      label: t('order_number'),
      flexGrow: 1,
      minWidth: 200,
      cell: ({ rowData }: { rowData: Order }) => {
        return <OrderInfoCell rowData={rowData} />;
      },
    },
    created_at,
    updated_order_at,
    state,
    grand_total: {
      className: 'pw-text-right',
      label: t('grand_total'),
      flexGrow: 0.5,
      minWidth: 150,
      cell: ({ rowData }: { rowData: Order }) => {
        return <div className="pw-w-full pw-px-2 pw-text-sm">{formatCurrency(rowData.grand_total)}</div>;
      },
    },
    payment,
    button,
    action,
  };
};

export const convertFilter = (filter: ExpectedAny) => {
  const {
    dateRange,
    state,
    staff_creator_ids = [],
    payment_status = [],
    create_method = [],
    payment_method = [],
    ...rest
  } = filter;
  return {
    ...rest,
    state: state || '',
    ...convertDateFilter(dateRange),
    staff_creator_ids: staff_creator_ids.map((item: string) => {
      return JSON.parse(item).value;
    }),
    payment_status: payment_status.map((item: string) => {
      return JSON.parse(item).value;
    }),
    create_method: create_method.map((item: string) => {
      return JSON.parse(item).value;
    }),
    payment_method: payment_method.map((item: string) => {
      return JSON.parse(item).value;
    }),
  };
};

export const getInitFilterValues = ({
  stateDefault,
  dateRangeDefault,
}: {
  stateDefault?: string;
  dateRangeDefault?: Array<Date>;
}) => {
  return {
    primary: {
      search: '',
      state: stateDefault || '',
      dateRange: dateRangeDefault || [startOfMonth(new Date()), endOfDay(new Date())],
    },
    secondary: {
      create_method: [],
      payment_status: [],
      payment_method: [],
      staff_creator_ids: [],
    },
  };
};

export const filterOptions = ({ dateRangeDefault }: { dateRangeDefault?: Array<Date | null> }) => {
  const { t } = useTranslation(['filters', 'orders-table']);
  const canViewOther = useHasPermissions([OrderPermission.ORDER_ORDERLIST_VIEW_ONLY]);
  let staff_creator_ids = null;
  if (canViewOther) {
    staff_creator_ids = {
      type: ComponentType.TagPicker,
      placeholder: t('orders-table.creator_id'),
      async: true,
      label: t('orders-table.creator_id'),
      menuMaxHeight: 200,
      size: 'lg',
      initStateFunc: () => ({
        page: 1,
        page_size: 10,
      }),
      container: () => document.getElementById('filter'),
      query: useGetListStaffQuery,
      mapFunc: (item: Staff) => ({
        label: item.staff_name,
        value: JSON.stringify({
          label: item.staff_name,
          value: item.user_id,
        }),
      }),
    };
  }
  return {
    primary: {
      search: {
        type: ComponentType.Text,
        placeholder: t('orders-table.search'),
        className: 'pw-w-60',
        defaultValue: '',
        icon: 'search',
        size: 'lg',
      },
      dateRange: {
        type: ComponentType.DateRange,
        placeholder: t('orders-table.daterange'),
        defaultValue: dateRangeDefault || [startOfMonth(new Date()), endOfDay(new Date())],
        className: 'pw-w-60',
        size: 'lg',
      },
    },
    secondary: {
      create_method: {
        type: ComponentType.TagPicker,
        placeholder: t('orders-table.type'),
        label: t('orders-table.type'),
        menuMaxHeight: 200,
        size: 'lg',
        container: () => document.getElementById('filter'),
        data: [
          {
            label: t('orders-table.pos'),
            value: JSON.stringify({
              label: t('orders-table.pos'),
              value: 'store',
            }),
          },
          {
            label: t('orders-table.website'),
            value: JSON.stringify({
              label: t('orders-table.website'),
              value: 'website',
            }),
          },
        ],
      },
      payment_status: {
        type: ComponentType.TagPicker,
        placeholder: t('orders-table.payment_status'),
        label: t('orders-table.payment_status'),
        menuMaxHeight: 200,
        size: 'lg',
        container: () => document.getElementById('filter'),
        data: [
          {
            label: t('orders-table:unpaid'),
            value: JSON.stringify({
              label: t('orders-table:unpaid'),
              value: 'un_paid',
            }),
          },
          {
            label: t('orders-table:partial_payment'),
            value: JSON.stringify({
              label: t('orders-table:partial_payment'),
              value: 'partially_paid',
            }),
          },
          {
            label: t('orders-table:paid'),
            value: JSON.stringify({
              label: t('orders-table:paid'),
              value: 'fully_paid',
            }),
          },
        ],
      },
      payment_method: {
        type: ComponentType.TagPicker,
        placeholder: t('orders-table.payment_source_type'),
        async: true,
        label: t('orders-table.payment_source_type'),
        menuMaxHeight: 200,
        size: 'lg',
        initStateFunc: () => ({
          page: 1,
          page_size: 10,
        }),
        searchKey: 'name',
        container: () => document.getElementById('filter'),
        query: usePaymentSourcesQuery,
        mapFunc: (item: Payment) => ({
          label: item.name,
          value: JSON.stringify({
            label: item.name,
            value: item.name,
          }),
        }),
      },
      staff_creator_ids,
    },
  };
};
