import cx from 'classnames';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BiDish } from 'react-icons/bi';
import { BsFillHandbagFill } from 'react-icons/bs';
import { FaShippingFast } from 'react-icons/fa';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Tag } from 'rsuite';
import { OrderCreateMethod } from '~app/features/orders/components';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { DeliveryMethodType } from '~app/features/pos/utils';
import { ModalTypes } from '~app/modals';
import { OrderCreateMethod as OrderCreateMethodType, OrderStatus, OrderStatusType } from '~app/utils/constants';

type Props = {
  className?: string;
};

const RenderDeliveryMethod = ({ deliveryMethod }: { deliveryMethod: DeliveryMethodType }) => {
  const { t } = useTranslation('pos');
  if (deliveryMethod === DeliveryMethodType.TABLE) {
    return (
      <div className="pw-flex pw-gap-x-2 pw-items-center">
        <BiDish className="pw-text-neutral-placeholder" />
        <span className="pw-text-sm pw-text-neutral-primary">{t('pay_at_table')}</span>
      </div>
    );
  }
  if (deliveryMethod === DeliveryMethodType.BUYER_PICK_UP) {
    return (
      <div className="pw-flex pw-gap-x-2 pw-items-center">
        <BsFillHandbagFill className="pw-text-neutral-placeholder" />
        <span className="pw-text-sm pw-text-neutral-primary">{t('buyer_pick_up')}</span>
      </div>
    );
  }
  return (
    <div className="pw-flex pw-gap-x-2 pw-items-center">
      <FaShippingFast className="pw-text-neutral-placeholder" />
      <span className="pw-text-sm pw-text-neutral-primary">{t('seller_delivery')}</span>
    </div>
  );
};

const OrderStatusAndStaff = ({ className }: Props) => {
  const { t } = useTranslation(['orders-form', 'common']);
  const [state] = useSelectedOrderStore((store) => store.state as OrderStatusType);
  const [createMethod] = useSelectedOrderStore((store) => store.create_method as OrderCreateMethodType);
  const [deliveryMethod] = useSelectedOrderStore((store) => store.delivery_method as DeliveryMethodType);
  const [reservationMeta] = useSelectedOrderStore((store) => store.reservation_meta);
  const [originOrderNumber] = useSelectedOrderStore((store) => store.origin_order_number);

  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.OrderDetails,
        id: originOrderNumber || '',
      })}`,
    });
  };

  return (
    <div className={cx('pw-w-full pw-flex pw-justify-between pw-items-center', className)}>
      <div>
        <Tag className={cx('!pw-text-white !pw-font-semibold', OrderStatus[state].bgColor)}>
          {t(`common:order-status.${OrderStatus[state].name}`)}
        </Tag>
      </div>
      {originOrderNumber ? (
        <div className="pw-text-sm pw-text-neutral-primary">
          <span>{t('return_from')}&nbsp;</span>
          <span
            className="pw-font-bold pw-text-secondary-main-blue pw-cursor-pointer hover:pw-underline"
            onClick={handleClick}
          >
            {originOrderNumber}
          </span>
        </div>
      ) : (
        <div className="pw-flex pw-items-center">
          <OrderCreateMethod createMethod={createMethod} />
          <div className="pw-h-3 pw-border-l pw-border-solid pw-border-neutral-disable pw-mx-4" />
          <RenderDeliveryMethod deliveryMethod={deliveryMethod} />
          {reservationMeta ? (
            <>
              <span className="pw-text-sm pw-text-neutral-primary">:&nbsp;</span>
              <span className="pw-text-base pw-font-semibold pw-text-neutral-primary">
                {reservationMeta.table_name} - {reservationMeta.sector_name}
              </span>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default memo(OrderStatusAndStaff);
