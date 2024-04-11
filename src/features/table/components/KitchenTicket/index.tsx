import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { formatDateToString } from '~app/utils/helpers';
import { TicketItemStatus, DeliveryMethodType } from '~app/features/pos/utils';

const KitchenTicket = ({
  orderInfo,
  note,
  reservationInfo,
}: {
  orderInfo?: KitchenTicketItem | PendingOrderForm;
  note?: string;
  reservationInfo?: ReservationMeta | null;
}) => {
  const { t } = useTranslation('table');
  const getInfoItems = () => {
    if (orderInfo && 'list_order_item' in orderInfo) {
      return orderInfo?.list_order_item;
    }

    if (orderInfo && 'order_change_info' in orderInfo) {
      return orderInfo?.order_change_info;
    }
    return [];
  };
  const getItemStatus = (item: KitchenTicketItemInfo | PendingOrderItem) => {
    if (item && 'status' in item) {
      return item?.status;
    }
    return '';
  };

  const getAddonItem = (item: KitchenTicketItemInfo | PendingOrderItem) => {
    let listAddonItems;
    if (item && 'order_item_addon' in item) {
      listAddonItems = item.order_item_addon;
    }

    if (item && 'order_item_add_on' in item) {
      listAddonItems = item.order_item_add_on;
    }

    if (!listAddonItems || listAddonItems.length === 0) return;

    return (
      <ul className="pw-list-disc pw-ml-4">
        {listAddonItems.map((item) => (
          <li className="pw-text-2xs pw-font-bold" key={`${item.name}-${item.product_add_on_id}`}>
            {' '}
            {`${item.quantity}x ${item.name}`}
          </li>
        ))}
      </ul>
    );
  };

  const getItemNote = (item: KitchenTicketItemInfo | PendingOrderItem) => {
    let itemNote;
    if (item && 'note' in item) {
      itemNote = item.note;
    }

    if (item && 'item_note' in item) {
      itemNote = item.item_note;
    }

    if (!itemNote) return;

    return <p className="pw-text-2xs pw-font-bold">*{itemNote}</p>;
  };
  return (
    <div className="pw-max-w-full pw-bg-white pw-pr-5">
      <p className="pw-text-2xs pw-font-bold pw-text-black pw-font-roboto pw-text-center pw-uppercase">
        {t('kitchen_ticket.kitchen_slip')}
      </p>
      {orderInfo?.delivery_method === DeliveryMethodType.TABLE ? (
        <p className="pw-text-2xs pw-font-bold pw-text-black pw-font-roboto pw-text-center pw-uppercase">
          {reservationInfo?.sector_name} - {reservationInfo?.table_name} - {orderInfo?.order_number}
        </p>
      ) : (
        <p className="pw-text-2xs pw-font-bold pw-text-black pw-font-roboto pw-text-center pw-uppercase">
          {t(`kitchen_ticket.${orderInfo?.delivery_method}`)} - {orderInfo?.order_number}
        </p>
      )}
      <div className="pw-flex pw-justify-between">
        <span className="pw-text-2xs pw-font-bold pw-text-black pw-font-roboto">
          {t('kitchen_ticket.date')}:{' '}
          <span className="pw-text-2xs pw-font-bold">
            {formatDateToString(orderInfo?.updated_at || new Date(), 'dd/MM/yyyy')}
          </span>
        </span>
        <span className="pw-text-2xs pw-font-bold pw-text-black pw-font-roboto">
          {t('kitchen_ticket.time')}:{' '}
          <span className="pw-text-2xs pw-font-bold">
            {formatDateToString(orderInfo?.updated_at || new Date(), 'HH:mm ')}
          </span>
        </span>
      </div>
      <p className="pw-text-2xs pw-font-bold pw-mt-2 pw-text-black pw-font-roboto">
        {t('kitchen_ticket.note')}: <span className="pw-text-2xs pw-font-bold">{note}</span>
      </p>
      <table className="pw-border-collapse pw-text-black pw-w-full pw-m-0 pw-mt-3 pw-box-border pw-bg-white">
        <tr>
          <th className="pw-border pw-border-solid pw-border-black pw-text-left pw-text-2xs pw-font-bold pw-font-roboto pw-p-1">
            {t('kitchen_ticket.name')}
          </th>
          <th className="pw-border pw-border-solid pw-border-black pw-text-center pw-text-2xs pw-font-bold pw-font-roboto pw-p-1">
            {t('kitchen_ticket.quantity')}
          </th>
          <th className="pw-border pw-border-solid pw-border-black pw-text-left pw-text-2xs pw-font-bold pw-font-roboto pw-p-1">
            {t('kitchen_ticket.unit')}
          </th>
        </tr>
        {getInfoItems().map((item: KitchenTicketItemInfo | PendingOrderItem, index) => {
          return (
            <tr key={`${item.sku_id}-${item.product_id}-${index}`}>
              <td
                className={cx(
                  'pw-border pw-border-solid pw-border-black pw-text-left pw-text-2xs pw-font-bold pw-font-roboto pw-p-1',
                  {
                    'pw-line-through !pw-text-black': getItemStatus(item) === TicketItemStatus.REMOVED,
                  },
                )}
              >
                {item.product_name} {item.sku_name && ` - ${item.sku_name}`}
                {getAddonItem(item)}
                {getItemNote(item)}
              </td>
              <td
                className={cx(
                  'pw-border pw-border-solid pw-border-black pw-text-center pw-text-2xs pw-font-bold pw-font-roboto pw-p-1',
                  {
                    'pw-line-through !pw-text-black': getItemStatus(item) === TicketItemStatus.REMOVED,
                  },
                )}
              >
                {item.quantity}
              </td>
              <td
                className={cx(
                  'pw-border pw-border-solid pw-border-black pw-text-left pw-text-2xs pw-font-bold pw-font-roboto pw-p-1',
                  {
                    'pw-line-through !pw-text-black': getItemStatus(item) === TicketItemStatus.REMOVED,
                  },
                )}
              >
                {item.uom}
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default KitchenTicket;
