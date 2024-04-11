import { useTranslation } from 'react-i18next';
import { Checkbox, Tag } from 'rsuite';
import cx from 'classnames';
import { ImageTextCell } from '~app/components';
import { formatCurrency, formatDateToString } from '~app/utils/helpers';
import { OrderStatus, OrderStatusType } from '~app/utils/constants';

type Props = {
  order: Order;
  checked?: boolean;
  onChange(order: Order, checked: boolean): void;
};

const OrderSelectItem = ({ order, checked, onChange }: Props) => {
  const { t } = useTranslation('chat');
  const orderState = OrderStatus[order.state as OrderStatusType];

  const handleGetImage = () => {
    const orderItem = order.order_item.find((item) => item.product_images.length > 0);
    return orderItem?.product_images?.[0] || '';
  };

  return (
    <div
      className="pw-grid pw-grid-cols-12 pw-py-2.5 pw-pr-2 pw-cursor-pointer"
      onClick={() => {
        if (checked === undefined) return;
        onChange(order, !checked);
      }}
    >
      <div className="pw-col-span-8">
        <ImageTextCell
          image={handleGetImage()}
          text={`${order.order_number} - ${formatDateToString(order.updated_at, 'HH:mm dd/MM/yy')}`}
          secondText={`${formatCurrency(order.grand_total)}₫ (${order.order_item.length} ${t('product')})`}
          className="!pw-pl-0"
          textClassName="pw-font-bold pw-text-sm line-clamp-1"
          secondTextClassName="pw-text-neutral-secondary pw-text-sm line-clamp-1"
        />
      </div>
      <div className="pw-col-span-3 pw-flex pw-items-center pw-justify-end pw-text-sm">
        <Tag className={cx('!pw-text-white !pw-font-semibold', orderState?.bgColor)}>
          {t(`common:order-status.${orderState?.name}`)}
        </Tag>
      </div>
      <div className="pw-col-span-1 pw-flex pw-items-center pw-justify-center">
        <Checkbox
          checked={checked}
          onChange={(_, newChecked: boolean) => {
            onChange(order, newChecked);
          }}
        />
      </div>
    </div>
  );
};

export default OrderSelectItem;
