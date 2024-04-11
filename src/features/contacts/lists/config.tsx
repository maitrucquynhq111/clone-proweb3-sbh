import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { BsPencilFill, BsTrash, BsPlus } from 'react-icons/bs';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { ContactTagLabel, ImageTextCell } from './components';
import { RETAILCUSTOMER } from '~app/configs';
import { ActionMenu, MenuItemProps } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { formatCurrency, formatPhoneWithZero } from '~app/utils/helpers';
import { ModalTypes } from '~app/modals';
import { ContactAnalyticOption } from '~app/utils/constants';
import { OrderPermission, OtherPermision, useHasPermissions } from '~app/utils/shield';
import { useContactsLabelsQuery } from '~app/services/queries';

const dataMenuAction = (
  rowData: Contact,
  { canCreate, canDelete }: Permission,
  onClick: (rowData: Contact, action: string) => void,
): MenuItemProps[] => {
  const { t } = useTranslation('common');

  return [
    ...(canCreate
      ? [
          {
            title: t('contacts-table:create_order'),
            icon: <BsPlus size={20} />,
            action: () => onClick(rowData, 'create_order'),
          },
        ]
      : []),
    {
      title: t('edit'),
      icon: <BsPencilFill className="pw-text-primary-main" />,
      action: () => onClick(rowData, 'edit'),
    },
    ...(canDelete && rowData.phone_number !== RETAILCUSTOMER.phone_number
      ? [
          {
            title: t('delete'),
            icon: <BsTrash />,
            className: 'pw-text-red-500',
            action: async () => onClick(rowData, 'delete'),
          },
        ]
      : []),
  ];
};

export const isAmountOut = (contact: Contact) => {
  if (!contact.debt_amount) return null;
  if (contact.option === 'out') return true;
  return false;
};

type Props = { onClick: (rowData: Contact, action: string) => void };

export const columnOptions = ({ onClick }: Props) => {
  const { t } = useTranslation('contacts-table');
  const navigate = useNavigate();
  const canCreate = useHasPermissions([OrderPermission.ORDER_CART_CREATE]);
  const canDelete = useHasPermissions([OtherPermision.CUSTOMER_CUSTOMERDETAIL_DELETE]);
  const canViewOrder = useHasPermissions([OrderPermission.ORDER_ORDERLIST_VIEW]);
  return {
    name: {
      label: t('name'),
      flexGrow: 1,
      cell: ({ rowData }: { rowData: Contact }) => {
        return (
          <ImageTextCell
            id={rowData.id}
            image={rowData?.avatar || rowData?.social_avatar}
            text={rowData.name}
            isAvatar
            secondText={formatPhoneWithZero(rowData?.phone_number || '')}
            className="pw-px-4"
            imageClassName="!pw-rounded-full"
            textClassName="pw-font-bold pw-mb-1 pw-text-sm"
            secondTextClassName="pw-text-sm pw-text-neutral-secondary pw-text-2sm"
          />
        );
      },
    },
    contact_tag: {
      flexGrow: 1,
      label: t('contact_tags'),
      cell: ({ rowData }: { rowData: Contact }) => {
        return <ContactTagLabel tags={rowData.contact_tag || []} />;
      },
    },
    last_order: {
      flexGrow: 0.5,
      label: t('latest_order'),
      cell: ({ rowData }: { rowData: Contact }) => {
        return (
          <div
            className="pw-w-full pw-px-4 pw-text-blue-primary pw-text-sm pw-font-semibold pw-cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (!canViewOrder) return;
              navigate({
                pathname: location.pathname,
                search: `?${createSearchParams({
                  modal: ModalTypes.OrderDetails,
                  id: rowData.last_order?.order_number || '',
                })}`,
              });
            }}
          >
            {rowData?.last_order?.order_number}
          </div>
        );
      },
    },
    state: {
      flexGrow: 0.7,
      className: 'pw-text-right',
      label: t('state'),
      cell: ({ rowData }: { rowData: Contact }) => {
        return (
          <div className="pw-text-right pw-w-full pw-px-4">
            {(rowData.total_quantity_order > 0 || rowData?.total_amount_order > 0) && (
              <>
                <p className="pw-mb-1 pw-font-semibold pw-text-sm">
                  {formatCurrency(rowData?.total_amount_order || 0)}
                </p>
                <p className="pw-text-neutral-secondary pw-text-2sm pw-mt-0">{`${formatCurrency(
                  rowData?.total_quantity_order || 0,
                )} ${t('order')}`}</p>
              </>
            )}
          </div>
        );
      },
    },
    debt_amount: {
      flexGrow: 0.6,
      className: 'pw-text-right',
      label: t('debt_amount'),
      cell: ({ rowData }: { rowData: Contact }) => {
        return (
          <div
            className={cx('pw-text-right pw-text-sm pw-w-full pw-px-4 pw-font-semibold', {
              'pw-text-secondary-main': isAmountOut(rowData),
              'pw-text-primary-main': isAmountOut(rowData) === false,
            })}
          >
            {rowData?.debt_amount && rowData?.debt_amount !== 0 ? formatCurrency(rowData.debt_amount) : ''}
          </div>
        );
      },
    },
    customer_point: {
      flexGrow: 0.6,
      className: 'pw-text-right',
      label: t('customer_point'),
      cell: ({ rowData }: { rowData: Contact }) => {
        return (
          <div className="pw-text-right pw-text-sm pw-w-full pw-px-4 pw-font-semibold">
            {rowData?.customer_point ? formatCurrency(rowData.customer_point) : ''}
          </div>
        );
      },
    },
    action: {
      width: 50,
      label: '',
      cell: ({ rowData }: { rowData: Contact }) => {
        return (
          <div
            className="pw-flex pw-justify-center"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ActionMenu
              data={dataMenuAction(
                rowData,
                {
                  canCreate,
                  canDelete,
                },
                onClick,
              )}
            />
          </div>
        );
      },
    },
  };
};

export const initFilterValues = {
  primary: {
    search: '',
    has_analytic: true,
    option_analytic: '',
  },
  secondary: {
    tag_ids: [] as string[],
  },
};

export type ConverFilterType = {
  search: string;
  has_analytic: boolean;
  option_analytic: string;
  tag_ids: string[];
};

export const convertFilter = (props: ConverFilterType) => {
  const { tag_ids, ...rest } = props;
  return {
    ...rest,
    tag_ids: tag_ids.map((item: string) => {
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
        placeholder: t('contacts-table.search'),
        defaultValue: '',
        icon: 'search',
        size: 'lg',
        className: '!pw-w-80',
      },
    },
    secondary: {
      tag_ids: {
        type: ComponentType.CheckPicker,
        placeholder: t('contacts-table.tag'),
        async: true,
        label: t('contacts-table.tag'),
        menuMaxHeight: 200,
        initStateFunc: () => ({
          page: 1,
          page_size: 10,
        }),
        searchKey: 'search',
        size: 'lg',
        defaultValue: initFilterValues.secondary.tag_ids,
        container: () => document.getElementById('filter'),
        query: useContactsLabelsQuery,
        mapFunc: (item: Category) => ({
          label: item.name,
          value: JSON.stringify({
            label: item.name,
            value: item.id,
          }),
        }),
      },
    },
  };
};

export const contactAnalyticData = [
  { value: ContactAnalyticOption.ORDER, priority: 1 },
  { value: ContactAnalyticOption.LAST_CREATE, priority: 2 },
  { value: ContactAnalyticOption.CONTACT_BACK, priority: 3 },
  { value: ContactAnalyticOption.AMOUNT_IN, priority: 4 },
  { value: ContactAnalyticOption.AMOUNT_OUT, priority: 5 },
  { value: ContactAnalyticOption.CUSTOMER_POINT, priority: 6 },
];

export type ContactAnalyticFilter = { value: ContactAnalyticOption; priority: number };
