import cx from 'classnames';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsXCircle } from 'react-icons/bs';
import { AutoResizeInput } from '~app/components';
import { usePosStore } from '~app/features/pos/hooks/usePos';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';

type Props = {
  orderTotal: number;
  promotionDiscount: number;
  className?: string;
};

const OtherDiscountInput = ({ orderTotal, promotionDiscount, className }: Props) => {
  const { t } = useTranslation('pos');
  const [, setPosStore] = usePosStore((store) => store.show_other_discount_modal);
  const [showOtherDiscount, setStore] = useSelectedOrderStore((store) => store.show_other_discount);
  const [otherDiscount] = useSelectedOrderStore((store) => store.other_discount);
  const [deliveryFee] = useSelectedOrderStore((store) => store.delivery_fee);

  const maxDiscountPrice = useMemo(() => {
    return orderTotal + deliveryFee - promotionDiscount;
  }, [orderTotal, promotionDiscount, deliveryFee]);

  const handleClose = () => {
    setStore((store) => ({ ...store, other_discount: 0, show_other_discount: false }));
  };

  useEffect(() => {
    if (otherDiscount >= maxDiscountPrice) setStore((store) => ({ ...store, other_discount: maxDiscountPrice }));
  }, [otherDiscount, maxDiscountPrice]);

  if (!showOtherDiscount) return null;

  return (
    <div className={cx('pw-py-1 pw-flex pw-items-center pw-justify-between', className)}>
      <div className="pw-flex pw-items-center pw-justify-center pw-gap-x-3 pw-text-sm">
        <button onClick={handleClose}>
          <BsXCircle size={20} className="pw-fill-neutral-secondary" />
        </button>
        <span>{t('other_discount')}</span>
      </div>
      <button onClick={() => setPosStore((store) => ({ ...store, show_other_discount_modal: true }))}>
        <AutoResizeInput
          name=""
          defaultValue={otherDiscount.toString()}
          isNumber
          readOnly
          placeholder="0"
          className="pw-cursor-pointer"
        />
      </button>
    </div>
  );
};

export default OtherDiscountInput;
