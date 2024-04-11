import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { BsXCircle } from 'react-icons/bs';
import { AutoResizeInput } from '~app/components';
import { usePosStore } from '~app/features/pos/hooks/usePos';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';

type Props = {
  className?: string;
};

const DeliveryFeeInput = ({ className }: Props) => {
  const { t } = useTranslation('pos');
  const [, setPosStore] = usePosStore((store) => store.show_delivery_fee_modal);
  const [showDeliveryFee, setStore] = useSelectedOrderStore((store) => store.show_delivery_fee);
  const [deliveryFee] = useSelectedOrderStore((store) => store.delivery_fee);

  const handleClose = () => {
    setStore((store) => ({ ...store, delivery_fee: 0, show_delivery_fee: false }));
  };

  if (!showDeliveryFee) return null;

  return (
    <div className={cx('pw-py-1 pw-flex pw-items-center pw-justify-between', className)}>
      <div className="pw-flex pw-items-center pw-justify-center pw-gap-x-3 pw-text-sm">
        <button onClick={handleClose}>
          <BsXCircle size={20} className="pw-fill-neutral-secondary" />
        </button>
        <span>{t('delivery')}</span>
      </div>
      <button onClick={() => setPosStore((store) => ({ ...store, show_delivery_fee_modal: true }))}>
        <AutoResizeInput
          name=""
          defaultValue={deliveryFee.toString()}
          isNumber
          readOnly
          placeholder="đ"
          className="pw-cursor-pointer"
        />
      </button>
    </div>
  );
};

export default DeliveryFeeInput;
