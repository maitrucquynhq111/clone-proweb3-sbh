import { useFormContext } from 'react-hook-form';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, Popover, Toggle, Whisper } from 'rsuite';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { InfoTabKeyType, defaultPoDetail } from '~app/features/products/utils';
import { CONFIRM_APPLY_INGREDIENTS } from '~app/configs';

type Props = {
  is_variant: boolean;
  setActiveTab(value: InfoTabKeyType): void;
};

const IngredientsToggle = ({ is_variant, setActiveTab }: Props) => {
  const { setValue, getValues, watch } = useFormContext();
  const { t } = useTranslation('products-form');
  const has_ingredient: boolean = watch('has_ingredient');
  const whisperRef = useRef<ExpectedAny>(null);
  const contentRef = useRef<ExpectedAny>(null);
  const [isHideHint, setIsHideHint] = useState(false);
  const confirmShowHint = localStorage.getItem(CONFIRM_APPLY_INGREDIENTS);

  const formatAfterApplyIngredients = () => {
    // revert stock --> non_stock when apply ingredients
    setValue('is_advance_stock', false);
    const skus = [...getValues('skus')] as PendingSku[];
    const newSkus = skus.map((sku) => ({
      ...sku,
      po_details: sku?.po_details ? sku.po_details : defaultPoDetail,
      sku_type: 'non_stock',
    }));
    setValue('skus', newSkus);
    setValue('is_advance_stock', false);
  };

  useClickAway(contentRef, () => {
    whisperRef?.current?.close();
  });

  return (
    <Whisper
      ref={whisperRef}
      placement="autoVerticalEnd"
      trigger="none"
      speaker={({ onClose, left, top, className }, ref) => {
        return (
          <Popover ref={ref} className={cx(className)} style={{ left, top }} arrow={false} full>
            <div className="pw-p-6 pw-w-96" ref={contentRef}>
              <h6 className="pw-font-bold pw-text-base pw-mb-6">{t('apply_materials')}</h6>
              <div className="pw-text-base pw-text-neutral-secondary pw-mb-3">
                <div className="pw-flex pw-items-start">
                  <div className="pw-rounded-full pw-w-1 pw-h-1 pw-bg-neutral-secondary pw-mr-2 pw-mt-2 pw-ml-1" />
                  <p>{t('ingredients_hint.first')}</p>
                </div>
                <div className="pw-flex pw-items-start">
                  <div className="pw-rounded-full pw-w-1 pw-h-1 pw-bg-neutral-secondary pw-mr-2 pw-mt-2 pw-ml-1" />
                  <p>{t('ingredients_hint.second')}</p>
                </div>
                <div className="pw-flex pw-items-start">
                  <div className="pw-rounded-full pw-w-1 pw-h-1 pw-bg-neutral-secondary pw-mr-2 pw-mt-2 pw-ml-1" />
                  <p>{t('ingredients_hint.third')}</p>
                </div>
              </div>
              <Checkbox onChange={(_, checked: boolean) => setIsHideHint(checked)} checked={isHideHint}>
                <span className="pw-text-sm">{t('action.not_show_hint_again')}</span>
              </Checkbox>
              <div className="pw-flex pw-justify-end pw-mt-6">
                <Button
                  appearance="ghost"
                  size="md"
                  className="!pw-text-neutral-primary !pw-border-neutral-border !pw-font-bold pw-mr-3"
                  onClick={() => onClose()}
                >
                  {t('common:back')}
                </Button>
                <Button
                  appearance="primary"
                  size="md"
                  className="!pw-font-bold"
                  onClick={() => {
                    formatAfterApplyIngredients();
                    setValue('has_ingredient', true);
                    !is_variant && setActiveTab(InfoTabKeyType.RECIPE);
                    whisperRef?.current?.close();
                    if (isHideHint) {
                      localStorage.setItem(CONFIRM_APPLY_INGREDIENTS, 'true');
                    }
                  }}
                >
                  {t('common:confirm')}
                </Button>
              </div>
            </div>
          </Popover>
        );
      }}
    >
      <div className="pw-p-6 pw-flex pw-items-center pw-justify-between">
        <h4 className="pw-text-base pw-font-bold">{t('apply_materials')}</h4>
        <Toggle
          checked={has_ingredient}
          onClick={() => {
            if (!confirmShowHint && !has_ingredient) {
              return whisperRef?.current?.open();
            }
            formatAfterApplyIngredients();
            setValue('has_ingredient', !has_ingredient);
            !has_ingredient && setActiveTab(InfoTabKeyType.RECIPE);
          }}
        />
      </div>
    </Whisper>
  );
};

export default IngredientsToggle;
