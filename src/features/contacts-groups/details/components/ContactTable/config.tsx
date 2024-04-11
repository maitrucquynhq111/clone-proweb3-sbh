import cx from 'classnames';
import { BsPencilFill, BsPlus, BsTrash } from 'react-icons/bs';
import { formatCurrency, formatPhoneWithZero } from '~app/utils/helpers';
import { ContactTagLabel, ImageTextCell } from '~app/features/contacts/lists/components';
import { isAmountOut } from '~app/features/contacts/lists/config';
import { ActionMenu, MenuItemProps } from '~app/components';
import i18n from '~app/i18n/i18n';
import { RETAILCUSTOMER } from '~app/configs';

const dataMenuAction = (
  rowData: Contact,
  { canCreate, canDelete }: Permission,
  onClick: (rowData: Contact, action: string) => void,
): MenuItemProps[] => {
  const { t } = i18n;

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
      title: t('common:edit'),
      icon: <BsPencilFill className="pw-text-primary-main" />,
      action: () => onClick(rowData, 'edit'),
    },
    ...(canDelete && rowData.phone_number !== RETAILCUSTOMER.phone_number
      ? [
          {
            title: t('common:delete'),
            icon: <BsTrash />,
            className: 'pw-text-red-500',
            action: async () => onClick(rowData, 'delete'),
          },
        ]
      : []),
  ];
};

export function columnsConfig({
  canCreateOrder,
  canDeleteContact,
  onClick,
  onOpenOrderDetail,
}: {
  canCreateOrder: boolean;
  canDeleteContact: boolean;
  onClick(row: Contact, action: string): void;
  onOpenOrderDetail(data: Contact): void;
}) {
  const { t } = i18n;
  return [
    {
      key: 'contact_name',
      name: 'contact_name',
      label: t('contacts-table:name'),
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
            textClassName="pw-font-bold pw-mb-1"
            secondTextClassName="pw-text-sm pw-text-neutral-secondary"
          />
        );
      },
    },
    {
      key: 'contact_label',
      name: 'contact_label',
      label: t('contacts-table:contact_tags'),
      width: 226,
      cell: ({ rowData }: { rowData: Contact }) => {
        return <ContactTagLabel tags={rowData.contact_tag || []} />;
      },
    },
    {
      key: 'latest_order',
      name: 'latest_order',
      label: t('contacts-table:latest_order'),
      width: 129,
      align: 'right',
      cell: ({ rowData }: { rowData: Contact }) => {
        return (
          <div
            className="pw-w-full pw-px-4 pw-text-blue-primary pw-font-semibold pw-cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onOpenOrderDetail(rowData);
            }}
          >
            {rowData?.last_order?.order_number}
          </div>
        );
      },
    },
    {
      key: 'delivered_order',
      name: 'delivered_order',
      label: t('contacts-table:delivered_order'),
      width: 114,
      align: 'right',
      cell: ({ rowData }: { rowData: Contact }) => {
        return (
          <div className="pw-text-right pw-w-full pw-px-4">
            {rowData.total_quantity_order > 0 ? (
              <p className="pw-mb-1 pw-font-semibold">{formatCurrency(rowData.total_quantity_order)}</p>
            ) : null}
          </div>
        );
      },
    },
    {
      key: 'total_revenue',
      name: 'total_revenue',
      label: t('contacts-table:total_revenue'),
      width: 210,
      align: 'right',
      cell: ({ rowData }: { rowData: Contact }) => {
        return (
          <div className="pw-text-right pw-w-full pw-px-4">
            {rowData.total_amount_order > 0 ? (
              <p className="pw-mb-1 pw-font-semibold">{formatCurrency(rowData.total_amount_order)}</p>
            ) : null}
          </div>
        );
      },
    },
    {
      key: 'debt_amount',
      name: 'debt_amount',
      label: t('contacts-table:debt_amount'),
      flexGrow: 1,
      align: 'right',
      cell: ({ rowData }: { rowData: Contact }) => {
        return (
          <div
            className={cx('pw-text-right pw-w-full pw-px-4 pw-font-semibold', {
              'pw-text-secondary-main': isAmountOut(rowData),
              'pw-text-primary-main': isAmountOut(rowData) === false,
            })}
          >
            {rowData?.debt_amount && rowData?.debt_amount !== 0 ? formatCurrency(rowData.debt_amount) : ''}
          </div>
        );
      },
    },
    {
      key: 'action',
      name: 'action',
      label: '',
      width: 56,
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
                  canCreate: canCreateOrder,
                  canDelete: canDeleteContact,
                },
                onClick,
              )}
            />
          </div>
        );
      },
    },
  ];
}
