import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AutoResizeInput } from '~app/components';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import { formatCurrency } from '~app/utils/helpers';

type Props = {
  orderTotal: number;
};

const OtherDiscount = ({ orderTotal }: Props) => {
  const { t } = useTranslation('pos');
  const [isEdit] = usePosStore((store) => store.is_edit_order);
  const [otherDiscount, setSelectedOrderStore] = useSelectedOrderStore((store) => store.other_discount);
  const [promotionDiscount] = useSelectedOrderStore((store) => store.promotion_discount);

  const maxDiscountPrice = useMemo(() => {
    return orderTotal - promotionDiscount;
  }, [orderTotal, promotionDiscount]);

  const handleChange = (value: string) => {
    setSelectedOrderStore((store) => ({ ...store, other_discount: +value }));
  };

  useEffect(() => {
    if (otherDiscount >= maxDiscountPrice)
      setSelectedOrderStore((store) => ({ ...store, other_discount: maxDiscountPrice }));
  }, [otherDiscount, maxDiscountPrice]);

  return (
    <div className="pw-flex pw-justify-between pw-items-center pw-py-1">
      <h4 className="pw-text-base pw-text-neutral-primary pw-font-normal">{t('other_discount')}</h4>
      {isEdit ? (
        <AutoResizeInput
          name=""
          isForm={false}
          isNumber
          defaultValue={otherDiscount.toString()}
          onChange={handleChange}
          className="!pw-bg-transparent"
          placeholder="0"
        />
      ) : (
        <span className="pw-text-base pw-text-neutral-primary pw-font-semibold">{formatCurrency(otherDiscount)}₫</span>
      )}
    </div>
  );
};

export default OtherDiscount;
