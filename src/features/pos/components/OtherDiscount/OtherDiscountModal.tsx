import { useEffect, useMemo, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'rsuite';
import { CurrencyInput, DecimalInput, SquareToggle } from '~app/components';
import { usePosStore } from '~app/features/pos/hooks/usePos';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';
import { OrderDiscountUnit } from '~app/utils/constants';

type Props = {
  orderTotal: number;
  promotionDiscount: number;
};

const OtherDiscountModal = ({ orderTotal, promotionDiscount }: Props) => {
  const { t } = useTranslation(['pos', 'common']);
  const [showOtherDiscountModal, setPosStore] = usePosStore((store) => store.show_other_discount_modal);
  const [orderDiscountUnit, setSelectedOrderStore] = useSelectedOrderStore((store) => store.order_discount_unit);
  const [otherDiscount] = useSelectedOrderStore((store) => store.other_discount);

  const [value, setValue] = useState('');
  const [discountUnit, setDiscountUnit] = useState(orderDiscountUnit);

  const maxDiscountPrice = useMemo(() => {
    return orderTotal - promotionDiscount;
  }, [orderTotal, promotionDiscount]);

  const handleClose = () => {
    setValue('');
    setPosStore((store) => ({ ...store, show_other_discount_modal: false }));
  };

  const handleChange = (value: string) => {
    if (maxDiscountPrice <= 0) return;
    if (discountUnit === OrderDiscountUnit.CASH) {
      setValue(+value >= maxDiscountPrice ? maxDiscountPrice.toString() : value);
    } else {
      setValue(+value >= 100 ? '100' : value);
    }
  };

  const handleUnitChange = (checked: boolean) => {
    if (checked) {
      if (discountUnit === OrderDiscountUnit.CASH) return;
      setDiscountUnit(OrderDiscountUnit.CASH);
      if (!value) return;
      const newValue = Math.floor((+value * maxDiscountPrice) / 100).toString();
      setValue(newValue);
    } else {
      if (discountUnit === OrderDiscountUnit.PERCENT) return;
      setDiscountUnit(OrderDiscountUnit.PERCENT);
      if (!value) return;
      const newValue = Math.floor((+value / maxDiscountPrice) * 100).toString();
      setValue(newValue);
    }
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (value) {
      const newValue = discountUnit === OrderDiscountUnit.CASH ? +value : (+value * maxDiscountPrice) / 100;
      setSelectedOrderStore((store) => ({
        ...store,
        other_discount: newValue,
        order_discount_unit: discountUnit,
        show_other_discount: true,
      }));
    } else {
      setSelectedOrderStore((store) => ({
        ...store,
        other_discount: 0,
        order_discount_unit: OrderDiscountUnit.CASH,
        show_other_discount: false,
      }));
    }
    handleClose();
  };

  useEffect(() => {
    if (showOtherDiscountModal) {
      if (!otherDiscount) return setValue('');
      if (orderDiscountUnit === OrderDiscountUnit.CASH) {
        setValue(otherDiscount >= maxDiscountPrice ? maxDiscountPrice.toString() : otherDiscount.toString());
      } else {
        const newValue = Math.floor((otherDiscount / maxDiscountPrice) * 100).toString();
        setValue(newValue);
      }
    }
  }, [orderDiscountUnit, otherDiscount, maxDiscountPrice, showOtherDiscountModal]);

  return (
    <Modal
      open={showOtherDiscountModal}
      keyboard={false}
      className="!pw-flex !pw-absolute !-pw-translate-x-1/2 xl:-pw-translate-y-1/2 xl:pw-top-1/2 pw-left-1/2
        pw-items-center pw-justify-center xl:!pw-my-0 center-modal"
    >
      <form onSubmit={handleSubmit}>
        <div className="pw-w-full pw-p-1">
          <label className="pw-inline-block pw-text-sm pw-font-normal pw-text-neutral-primary pw-mb-1">
            {t('enter_other_discount')}
          </label>
          {discountUnit === OrderDiscountUnit.CASH ? (
            <CurrencyInput
              name=""
              onChange={handleChange}
              isForm={false}
              value={value}
              placeholder="đ"
              autoFocus={true}
              additionalComponent={
                <SquareToggle
                  className="pw-absolute pw-z-10 pw-right-4"
                  value={true}
                  leftText="VNĐ"
                  rightText="%"
                  onClick={handleUnitChange}
                />
              }
              inputGroupClassName="pw-px-4 pw-py-2"
              inputClassName="!pw-border-none !pw-outline-none !pw-px-0"
            />
          ) : (
            <DecimalInput
              name=""
              onChange={handleChange}
              isForm={false}
              value={value}
              autoFocus={true}
              placeholder="0"
              additionalComponent={
                <SquareToggle
                  className="pw-absolute pw-z-10 pw-right-4"
                  value={false}
                  leftText="VNĐ"
                  rightText="%"
                  onClick={handleUnitChange}
                />
              }
              inputGroupClassName="pw-px-4 pw-py-2"
              inputClassName="!pw-border-none !pw-outline-none !pw-px-0"
            />
          )}
          <div className="pw-flex pw-justify-end pw-items-center pw-gap-x-3 pw-mt-4">
            <Button appearance="ghost" type="button" onClick={handleClose}>
              {t('common:cancel')}
            </Button>
            <Button appearance="primary" type="submit">
              {t('common:modal-confirm')}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default memo(OtherDiscountModal);
