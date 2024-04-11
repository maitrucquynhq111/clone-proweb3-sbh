import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { BsPrinterFill } from 'react-icons/bs';
import { formatDateToString } from '~app/utils/helpers';
import { TicketItemStatus } from '~app/features/pos/utils';
import { useKitchenPrinting } from '~app/utils/hooks';
import { useSelectedOrderStore } from '~app/features/pos/hooks';

type Props = {
  ticket: KitchenTicketItem;
};

const HistoryItem = ({ ticket }: Props) => {
  const { t } = useTranslation('pos');
  const [selectedOrder] = useSelectedOrderStore((store) => store);
  const [reservationInfo] = useSelectedOrderStore((store) => store.reservation_info);
  const { handlePrint, showDataPrint } = useKitchenPrinting({
    orderInfo: ticket,
    note: selectedOrder.note,
    reservationInfo: reservationInfo,
  });

  const getSkuAddonItem = (item: KitchenTicketItemInfo) => {
    const variantName = [
      item.sku_name,
      ...(item?.order_item_addon || []).map(
        (itemAddon: { name: string; quantity: number; addon_note: string; product_add_on_id: string }) =>
          `x${itemAddon.quantity} ${itemAddon.name}`,
      ),
    ];
    return (
      <p
        className={cx('pw-text-sm !pw-m-0 pw-text-neutral-secondary', {
          'pw-line-through !pw-text-neutral-placeholder': item.status === TicketItemStatus.REMOVED,
        })}
      >
        {variantName.filter((name) => !!name).join(' - ')}
      </p>
    );
  };

  return (
    <div key={ticket.id}>
      <div className="pw-flex pw-justify-between pw-items-center pw-pl-6 pw-pr-3 pw-py-4 pw-bg-secondary-background">
        <span className="pw-font-bold pw-text-base pw-text-blue-primary">
          {formatDateToString(ticket.created_at, 'HH:mm - dd/MM/yyyy')}
        </span>
        <button
          onClick={() => {
            handlePrint();
          }}
          className="pw-flex pw-items-center pw-justify-center pw-rounded pw-text-center pw-p-3 pw-bg-neutral-white pw-border pw-border-solid pw-border-secondary-border"
        >
          <BsPrinterFill className="pw-text-blue-primary" />
          <span className="pw-ml-2 pw-font-bold pw-text-sm pw-text-blue-primary">{t('action.print_ticket')}</span>
        </button>
        <div className="pw-hidden">{showDataPrint()}</div>
      </div>
      {ticket.order_change_info.map((item: KitchenTicketItemInfo, index: number) => {
        return (
          <div
            key={`${item.category_id}-${item.product_id}-${index}`}
            className={cx('pw-flex pw-py-3 pw-pr-6 pw-items-center', {
              'pw-border-b pw-border-solid pw-border-neutral-divider': index !== ticket.order_change_info.length - 1,
            })}
          >
            <p
              className={cx('pw-min-w-20 pw-text-base pw-text-center pw-text-neutral-primary', {
                'pw-line-through !pw-text-neutral-placeholder': item.status === TicketItemStatus.REMOVED,
              })}
            >
              {item.quantity}x
            </p>
            <div>
              <p
                className={cx('pw-text-sm pw-font-bold pw-text-litght-primary !pw-m-0', {
                  'pw-line-through !pw-text-neutral-placeholder': item.status === TicketItemStatus.REMOVED,
                })}
              >
                {item.product_name}
              </p>
              {getSkuAddonItem(item)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryItem;
