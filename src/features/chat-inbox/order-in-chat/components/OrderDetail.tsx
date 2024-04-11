import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '~app/components';
import { EmptyStateProduct } from '~app/components/Icons';
import { OrderItems } from '~app/features/pos/components';
import { useSelectedOrderStore } from '~app/features/pos/hooks';

type Props = {
  className?: string;
  onClick(): void;
};

const OrderDetail = ({ className, onClick }: Props) => {
  const { t } = useTranslation('orders-form');
  const [listOrderItem] = useSelectedOrderStore((store) => store.list_order_item);
  return (
    <div
      className={cx(
        {
          'pw-justify-center': listOrderItem.length === 0,
        },
        className,
      )}
    >
      {listOrderItem.length === 0 ? (
        <EmptyState
          className="pw-mx-auto"
          icon={<EmptyStateProduct />}
          description1={t('empty_product')}
          textBtn={t('action.add_product') || ''}
          onClick={onClick}
          hidePlusIcon={true}
        />
      ) : (
        <OrderItems />
      )}
    </div>
  );
};

export default OrderDetail;
