import cx from 'classnames';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Popover, Radio, Whisper } from 'rsuite';
import { BiDish } from 'react-icons/bi';
import { BsFillHandbagFill, BsChevronDown } from 'react-icons/bs';
import { FaShippingFast } from 'react-icons/fa';
import { DeliveryMethodType } from '~app/features/pos/utils';
import ButtonTransparent from '~app/components/ButtonTransparent';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { TablePermission, useHasPermissions } from '~app/utils/shield';

const defaultDeliveryMethod = () => {
  const { t } = useTranslation('pos');
  return [
    {
      value: DeliveryMethodType.TABLE,
      label: t('pay_at_table'),
      icon: <BiDish className="pw-text-neutral-secondary" />,
    },
    {
      value: DeliveryMethodType.BUYER_PICK_UP,
      label: t('buyer_pick_up'),
      icon: <BsFillHandbagFill className="pw-text-neutral-secondary" />,
    },
    {
      value: DeliveryMethodType.SELLER_DELIVERY,
      label: t('seller_delivery'),
      icon: <FaShippingFast className="pw-text-neutral-secondary" />,
    },
  ];
};

const DeliveryMethodSelect = () => {
  const canViewTableList = useHasPermissions([TablePermission.TABLE_TABLELIST_VIEW]);

  const data = defaultDeliveryMethod();
  const [deliveryMethod, setStore] = useSelectedOrderStore((store) => store.delivery_method);
  const selected = useMemo(() => data.find((method) => method.value === deliveryMethod), [deliveryMethod]);

  return (
    <Whisper
      trigger="click"
      placement="bottomEnd"
      speaker={({ onClose, left, top, className }, ref) => {
        return (
          <Popover ref={ref} className={cx('!pw-rounded-none', className)} style={{ left, top }} arrow={false} full>
            {(canViewTableList ? data : data.filter((item) => item.value !== DeliveryMethodType.TABLE)).map((item) => (
              <ButtonTransparent
                key={item.value}
                onClick={() => {
                  const isSellerDelivery = item.value === DeliveryMethodType.SELLER_DELIVERY;
                  onClose();
                  setStore((prevState) => ({
                    ...prevState,
                    delivery_method: item.value,
                    debit: { ...prevState.debit, buyer_pay: isSellerDelivery ? 0 : prevState.grand_total },
                  }));
                }}
              >
                <div className="custom-radio pw-flex pw-px-4 pw-py-1 pw-items-center pw-justify-between">
                  <div className="pw-flex pw-items-center pw-mr-2">
                    <div className="pw-mr-2 pw-text-2xl">{item.icon}</div>
                    <h5
                      className="pw-text-base pw-font-normal pw-max-w-xs
                      pw-overflow-hidden pw-text-ellipsis pw-text-neutral-primary"
                    >
                      {item.label}
                    </h5>
                  </div>
                  <Radio
                    value={item.value}
                    checked={deliveryMethod === item.value}
                    onChange={(value, _, event) => {
                      event.stopPropagation();
                      const isSellerDelivery = item.value === DeliveryMethodType.SELLER_DELIVERY;
                      onClose();
                      setStore((prevState) => ({
                        ...prevState,
                        delivery_method: item.value,
                        debit: { ...prevState.debit, buyer_pay: isSellerDelivery ? 0 : prevState.grand_total },
                      }));
                    }}
                  />
                </div>
              </ButtonTransparent>
            ))}
          </Popover>
        );
      }}
    >
      {selected ? (
        <div
          className="pw-flex pw-items-center pw-bg-neutral-background pw-rounded
          pw-py-2 pw-px-2 pw-w-fit pw-cursor-pointer"
        >
          <div className="pw-mr-2 pw-text-xl">{selected.icon}</div>
          <h5
            className="pw-text-sm pw-font-normal pw-max-w-xs
            pw-overflow-hidden pw-text-ellipsis pw-whitespace-nowrap pw-text-neutral-primary"
          >
            {selected.label}
          </h5>
          <div className="pw-ml-2 pw-text-xl pw-transition-transform">
            <BsChevronDown />
          </div>
        </div>
      ) : (
        <div />
      )}
    </Whisper>
  );
};

export default DeliveryMethodSelect;
