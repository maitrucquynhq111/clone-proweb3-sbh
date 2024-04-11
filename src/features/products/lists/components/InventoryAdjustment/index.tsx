import cx from 'classnames';
import { ReactNode, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { Button, Popover, Whisper } from 'rsuite';
import { HiChevronDown } from 'react-icons/hi';
import { formSchema, yupSchema } from './config';
import { FormProvider, FormLayout } from '~app/components/HookForm';
import { createSku, defaultPoDetail } from '~app/features/products/utils';
import { toPendingSku } from '~app/utils/helpers';

type Props = {
  sku: Sku;
  product: Product;
  children: ReactNode;
  className?: string;
  onUpdateProduct: (productId: string, sku: Sku) => Promise<boolean>;
};

const InventoryAdjustment = ({ product, sku, onUpdateProduct, className, children }: Props) => {
  const { t } = useTranslation();
  const whisperRef = useRef<ExpectedAny>(null);

  const [open, setOpen] = useState(false);

  const methods = useForm<PendingSku>({
    mode: 'all',
    resolver: yupResolver(yupSchema()),
    defaultValues: { ...createSku({}), historical_cost: null },
  });

  const { handleSubmit, watch, reset, setValue, getValues } = methods;

  const onSubmit = async (data: PendingSku) => {
    try {
      if (data.po_details) {
        onUpdateProduct(product.id, {
          ...sku,
          historical_cost: data.historical_cost,
          sku_type: data.sku_type,
          po_details: { ...data.po_details, quantity: Number(data.po_details.quantity) },
        });
        return;
      }
      onUpdateProduct(product.id, { ...sku, sku_type: data.sku_type, historical_cost: data.historical_cost });
    } catch (error) {
      // TO DO
    }
  };

  const handleStatusChange = useCallback(
    (value: boolean) => {
      setValue('is_active', value);
      onUpdateProduct(product.id, { ...sku, is_active: value });
      whisperRef.current?.close();
    },
    [product, sku, onUpdateProduct],
  );

  const handleTurnOnAdvanceStock = () => {
    const sku = getValues();
    const value = sku.sku_type === 'stock' ? false : true;
    const po_details = value ? (sku?.po_details ? sku.po_details : defaultPoDetail) : undefined;
    setValue('po_details', po_details);
    setValue('sku_type', value ? 'stock' : 'non_stock');
  };

  useEffect(() => {
    if (!sku) return;
    const pendingSku = toPendingSku(sku);
    reset({ ...pendingSku, historical_cost: pendingSku?.historical_cost || null });
  }, [sku]);

  return (
    <Whisper
      ref={whisperRef}
      placement="autoVerticalEnd"
      trigger="click"
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      speaker={({ left, top, className }, ref) => {
        return (
          <Popover
            ref={ref}
            className={cx('!pw-rounded-none pw-w-84', className)}
            style={{ left, top }}
            arrow={false}
            full
          >
            <FormProvider
              methods={methods}
              className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormLayout
                formSchema={formSchema({
                  sku_type: watch('sku_type'),
                  is_active: watch('is_active'),
                  onStatusChange: handleStatusChange,
                })}
              />
              {watch('sku_type') === 'stock' ? (
                <div className="pw-py-3 pw-px-4 pw-flex pw-justify-end pw-gap-x-4 pw-shadow-inner ">
                  <Button
                    type="button"
                    className="pw-button-secondary !pw-py-1.5 !pw-px-4"
                    onClick={() => handleTurnOnAdvanceStock()}
                  >
                    <span className="pw-text-sm pw-font-bold pw-text-neutral-primary">{t('common:cancel')}</span>
                  </Button>
                  <Button type="submit" className="pw-button-primary !pw-py-1.5 !pw-px-4">
                    <span className="pw-text-sm pw-font-bold pw-text-neutral-white">{t('common:modal-confirm')}</span>
                  </Button>
                </div>
              ) : null}
            </FormProvider>
          </Popover>
        );
      }}
    >
      <div className={cx('pw-flex pw-items-center pw-gap-x-2', className)}>
        {children}
        <HiChevronDown
          size={20}
          className={cx('pw-text-neutral-secondary pw-transition-all pw-duration-100 pw-ease-in', {
            'pw-rotate-180': open,
          })}
        />
      </div>
    </Whisper>
  );
};

export default memo(InventoryAdjustment);
