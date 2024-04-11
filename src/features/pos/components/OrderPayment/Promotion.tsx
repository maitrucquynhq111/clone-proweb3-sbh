import { memo } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { BsChevronRight, BsExclamationTriangle, BsXCircle } from 'react-icons/bs';
import { Button, Tooltip, Whisper } from 'rsuite';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';
import { numberFormat } from '~app/configs';
import { usePosStore } from '~app/features/pos/hooks/usePos';

const Promotion = () => {
  const { t } = useTranslation('pos');
  const [promotionDiscount] = useSelectedOrderStore((store) => store.promotion_discount);
  const [promotionCode] = useSelectedOrderStore((store) => store.promotion_code);
  const [validPromotion, setSelectedPromotion] = useSelectedOrderStore((store) => store.valid_promotion);
  const [, setShowPromotionModal] = usePosStore((store) => store.show_promotion_modal);

  const handleClose = () => {
    setSelectedPromotion((prevState) => ({
      ...prevState,
      valid_promotion: false,
      selected_promotion: null,
      promotion_code: '',
      promotion_discount: 0,
    }));
  };

  return (
    <>
      <div className="pw-flex pw-items-center pw-justify-between pw-mt-3">
        <div className="pw-flex pw-items-center pw-gap-x-3">
          <button onClick={handleClose}>
            <BsXCircle size={20} className="pw-fill-neutral-secondary" />
          </button>
          <span className="pw-font-normal pw-text-sm pw-text-neutral-primary">{t('promotion')}</span>
          <Button
            className={cx('pw-py-1.5 !pw-font-bold pw-text-sm', {
              '!pw-bg-primary-background !pw-text-primary-main': validPromotion,
              '!pw-bg-warning-background !pw-text-warning-active': !validPromotion,
            })}
            endIcon={<BsChevronRight />}
            onClick={() => setShowPromotionModal((prevState) => ({ ...prevState, show_promotion_modal: true }))}
          >
            {promotionCode}
          </Button>
        </div>
        <div className="pw-flex pw-items-center">
          <div
            className={cx('pw-text-base pw-font-semibold', {
              'pw-text-neutral-disable': !validPromotion,
            })}
          >
            {numberFormat.format(promotionDiscount)}
          </div>
          {!validPromotion && (
            <Whisper
              placement="bottomEnd"
              trigger="hover"
              speaker={<Tooltip arrow={false}>{t('error.unqualified_promotion')}</Tooltip>}
            >
              <div className="pw-text-orange-500 pw-ml-2 pw-text-xl">
                <BsExclamationTriangle />
              </div>
            </Whisper>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(Promotion);
