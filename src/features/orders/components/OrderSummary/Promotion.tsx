import cx from 'classnames';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsExclamationTriangle } from 'react-icons/bs';
import { Tooltip, Whisper } from 'rsuite';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import { formatCurrency } from '~app/utils/helpers';

type Props = {
  orderGrandTotal: number;
};

const Promotion = ({ orderGrandTotal }: Props) => {
  const { t } = useTranslation('pos');
  const [isCreate] = usePosStore((store) => store.is_create_order);
  const [promotionDiscount] = useSelectedOrderStore((store) => store.promotion_discount);
  const [promotionCode] = useSelectedOrderStore((store) => store.promotion_code);

  return (
    <>
      {!isCreate ? (
        <div className="pw-flex pw-justify-between pw-items-center pw-py-1">
          <div className="pw-flex pw-gap-x-2 pw-items-center">
            <h4 className="pw-font-normal pw-text-base pw-text-neutral-primary">{t('promotion')}</h4>
            {promotionCode ? (
              <div
                className={cx('pw-py-1.5 pw-px-4 pw-font-bold pw-text-sm pw-rounded', {
                  'pw-bg-primary-background pw-text-primary-main':
                    promotionDiscount <= orderGrandTotal + promotionDiscount,
                  'pw-text-warning-active pw-bg-warning-background':
                    promotionDiscount > orderGrandTotal + promotionDiscount,
                })}
              >
                {promotionCode}
              </div>
            ) : null}
          </div>
          <div className="pw-flex pw-gap-x-2">
            <span className="pw-text-base pw-text-neutral-primary pw-font-semibold">
              -{formatCurrency(promotionDiscount)}₫
            </span>
            {promotionDiscount > orderGrandTotal + promotionDiscount ? (
              <Whisper
                placement="bottomEnd"
                trigger="hover"
                speaker={<Tooltip arrow={false}>{t('error.unqualified_promotion')}</Tooltip>}
              >
                <div className="pw-text-orange-500 pw-ml-2 pw-text-xl">
                  <BsExclamationTriangle />
                </div>
              </Whisper>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default memo(Promotion);
