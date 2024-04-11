import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { AutoResizeInput } from '~app/components';
import { getTotalAddonPrice } from '~app/features/pos/utils';
import { formatCurrency } from '~app/utils/helpers';

type Props = {
  className?: string;
  orderItem: PendingOrderItem;
  onPriceChange(value: string): void;
  onNoteChange(value: string): void;
};

const OrderItemPriceExtend = ({ orderItem, className = '', onPriceChange, onNoteChange }: Props) => {
  const { t } = useTranslation('pos');
  return (
    <div className={cx('pw-bg-secondary-background pw-p-2 pw-rounded', className)}>
      <div className="pw-flex pw-justify-between pw-items-start">
        <label className="pw-text-sm pw-font-normal pw-text-neutral-primary">{t('normal_price')}</label>
        <div>
          <div className="pw-flex pw-justify-end">
            <AutoResizeInput
              name=""
              isForm={false}
              isNumber={true}
              className="!pw-bg-transparent"
              defaultValue={orderItem.price.toString()}
              onChange={onPriceChange}
              placeholder="0"
            />
          </div>
          {orderItem?.order_item_add_on.length > 0 ? (
            <div
              className="pw-inline-block pw-w-full pw-mt-2 pw-text-xs 
            pw-text-neutral-secondary pw-font-semibold pw-text-right"
            >
              + {formatCurrency(getTotalAddonPrice(orderItem.order_item_add_on))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="pw-mt-1 pw-flex pw-justify-between pw-items-center">
        <label className="pw-text-sm pw-font-normal pw-text-neutral-primary">{t('note')}</label>
        <div>
          <AutoResizeInput
            name=""
            isForm={false}
            className="!pw-bg-transparent pw-text-right"
            defaultValue={orderItem.note}
            onChange={onNoteChange}
            placeholder=""
          />
        </div>
      </div>
    </div>
  );
};

export default OrderItemPriceExtend;
