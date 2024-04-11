import { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormSetValue, useFormContext } from 'react-hook-form';
import PaymentSources from './PaymentSources';
import { formatCurrency } from '~app/utils/helpers/stringHelpers';
import { AutoResizeInput, RHFToggle } from '~app/components';
import { numberOfItemsPurchaseOrder } from '~app/utils/helpers';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';

export const Payment = ({ setValue }: { setValue: UseFormSetValue<PendingInventoryCreate> }): JSX.Element => {
  const { t } = useTranslation('purchase-order');
  const { watch } = useFormContext<PendingInventoryCreate>();
  const selectedList = watch('po_details') || [];
  const selectedIngredientList = watch('po_detail_ingredient') || [];
  const canUpdateHistoricalCost = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);

  const handleChange = (value: string, key: 'total_discount' | 'sur_charge' | 'buyer_pay') => {
    setValue(key, +value);
  };

  const { totalItems, skuItems, ingredientItems } = useMemo(() => {
    return numberOfItemsPurchaseOrder({ items: selectedList, ingredients: selectedIngredientList });
  }, [selectedList, selectedIngredientList]);

  const totalPrice = useMemo(() => {
    return selectedList.reduce((prev: number, cur: SkuSelected) => prev + cur.quantity * cur.historical_cost, 0);
  }, [selectedList]);
  const totalPriceIngredient = useMemo(() => {
    return selectedIngredientList.reduce(
      (prev: number, cur: PendingPoDetailsIngredient) => prev + cur.quantity * cur.price,
      0,
    );
  }, [selectedIngredientList]);
  const buyerPay = useMemo(() => {
    return watch('buyer_pay') || 0;
  }, [watch('buyer_pay')]);
  const grandTotalPrice = useMemo(() => {
    const totalDiscount = watch('total_discount') || 0;
    const surCharge = watch('sur_charge') || 0;
    return totalPrice + totalPriceIngredient + surCharge - totalDiscount;
  }, [totalPrice, totalPriceIngredient, watch('sur_charge'), watch('total_discount')]);

  useEffect(() => {
    if (canUpdateHistoricalCost) {
      setValue('buyer_pay', grandTotalPrice);
    }
  }, [grandTotalPrice]);

  return (
    <div className="pw-flex">
      <div className="pw-flex-1"></div>
      {(selectedList.length > 0 || selectedIngredientList.length > 0) && (
        <div className="pw-flex pw-flex-col pw-gap-y-3 pw-flex-1">
          <div className="pw-flex pw-justify-between">
            <span className="pw-text-sm">{t('total-quantity')}</span>
            <span className="pw-text-base pw-font-semibold">{formatCurrency(totalItems)}</span>
          </div>
          <div className="pw-flex pw-justify-between pw-ml-6">
            <span className="pw-text-base">{t('sku-table.product')}</span>
            <span className="pw-text-base pw-font-semibold">{formatCurrency(skuItems)}</span>
          </div>
          <div className="pw-flex pw-justify-between pw-ml-6">
            <span className="pw-text-base">{t('ingredient-table.ingredient')}</span>
            <span className="pw-text-base pw-font-semibold">{formatCurrency(ingredientItems)}</span>
          </div>
          <div className="pw-flex pw-justify-between">
            <span className="pw-text-sm">{t('total-price-product')}</span>
            <span className="pw-text-base pw-font-semibold">
              {canUpdateHistoricalCost ? formatCurrency(totalPrice + totalPriceIngredient) : 0}đ
            </span>
          </div>
          <div className="pw-flex pw-justify-between">
            <span className="pw-text-sm">{t('total-discount')}</span>
            <AutoResizeInput
              name=""
              defaultValue="0"
              isForm={false}
              isNumber
              placeholder="0"
              className="!pw-text-base !pw-font-semibold"
              onChange={(value) => handleChange(value, 'total_discount')}
            />
          </div>
          <div className="pw-flex pw-justify-between">
            <span className="pw-text-sm">{t('surcharge')}</span>
            <AutoResizeInput
              name=""
              defaultValue="0"
              isForm={false}
              isNumber
              placeholder="0"
              className="!pw-text-base !pw-font-semibold"
              onChange={(value) => handleChange(value, 'sur_charge')}
            />
          </div>
          <div className="pw-border-b pw-border-solid pw-border-neutral-border" />
          <div className="pw-flex pw-justify-between">
            <span className="pw-text-sm pw-font-semibold">{t('grand-total-price')}</span>
            <span className="pw-text-lg pw-text-secondary-main pw-font-bold">
              {canUpdateHistoricalCost ? formatCurrency(grandTotalPrice) : 0}đ
            </span>
          </div>
          <div className="pw-flex pw-justify-between">
            <span className="pw-text-sm pw-font-semibold">{t('buyer-pay')}</span>
            <AutoResizeInput
              name=""
              defaultValue={buyerPay.toString()}
              isForm={false}
              isNumber
              placeholder="0"
              className="!pw-text-lg !pw-font-bold"
              onChange={(value) => handleChange(value, 'buyer_pay')}
            />
          </div>
          {grandTotalPrice < buyerPay && (
            <div className="pw-flex pw-justify-between">
              <span className="pw-text-sm">{t('change_money')}</span>
              <span className="pw-text-base pw-font-semibold">
                {formatCurrency(buyerPay - (canUpdateHistoricalCost ? grandTotalPrice : 0))}đ
              </span>
            </div>
          )}
          {canUpdateHistoricalCost && grandTotalPrice > buyerPay && (
            <div className="pw-flex pw-justify-between">
              <RHFToggle
                name="is_debit"
                checkedChildren={t('debit') || ''}
                textPlacement="left"
                isTextOutSide
                textClassName="pw-text-sm"
              />
              <span className="pw-text-base pw-font-semibold">{formatCurrency(grandTotalPrice - buyerPay)}đ</span>
            </div>
          )}
          <PaymentSources setValue={setValue} />
        </div>
      )}
    </div>
  );
};
