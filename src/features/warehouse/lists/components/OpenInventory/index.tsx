import { memo, useEffect, useRef } from 'react';
import cx from 'classnames';
import { Button, Popover, Whisper } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import {
  defaultSkuInventory,
  skuInventoryFormSchema,
  skuInventoryYupSchema,
  toDefaultSkuInventory,
  toPendingSkuInventory,
} from './config';
import FormProvider from '~app/components/HookForm/FormProvider';
import FormLayout from '~app/components/HookForm/FormLayout';
import { INVENTORY_ANALYTICS_KEY, SKUS_INVENTORY_KEY } from '~app/services/queries';
import { queryClient } from '~app/configs/client';
import { useUpdateSkuMutation } from '~app/services/mutations';

type Props = { sku: SkuInventory; canUpdate: boolean; onSuccess?(sku: SkuInventory): void };

const OpenInventory = ({ sku, canUpdate, onSuccess }: Props) => {
  const { t } = useTranslation('inventory-form');
  const whisperRef = useRef<ExpectedAny>(null);
  const { mutateAsync } = useUpdateSkuMutation();

  const methods = useForm<PendingSkuInventory>({
    resolver: yupResolver(skuInventoryYupSchema()),
    defaultValues: defaultSkuInventory(),
  });
  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: PendingSkuInventory) => {
    try {
      const response = await mutateAsync({ id: data.id, sku: toPendingSkuInventory(data) });
      queryClient.invalidateQueries([SKUS_INVENTORY_KEY], { exact: false });
      queryClient.invalidateQueries([INVENTORY_ANALYTICS_KEY], { exact: false });
      onSuccess?.(response);
      whisperRef.current?.close();
      toast.success(t('success.open_inventory'));
    } catch (_) {
      // TO DO
    }
  };

  useEffect(() => {
    if (sku) {
      reset(toDefaultSkuInventory(sku));
    }
  }, [sku]);

  return (
    <Whisper
      ref={whisperRef}
      placement="autoVerticalEnd"
      trigger="click"
      container={
        document.getElementById('open-inventory') || document.getElementById('select-ingredients') || undefined
      }
      speaker={({ onClose, left, top, className }, ref) => {
        return (
          <Popover ref={ref} className={cx('!pw-rounded-none', className)} style={{ left, top }} arrow={false} full>
            <FormProvider
              className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
              methods={methods}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="pw-p-4" onClick={(e) => e.stopPropagation()}>
                <p className="pw-text-base pw-font-bold pw-mb-4">{t('more_inventory_info')}</p>
                <FormLayout formSchema={skuInventoryFormSchema()} />
                <div className="pw-flex pw-justify-end pw-pt-3 pw-border-t pw-border-t-neutral-divider">
                  <Button
                    appearance="ghost"
                    className="!pw-font-bold !pw-text-neutral-primary !pw-border-neutral-border pw-mr-4"
                    onClick={() => onClose()}
                  >
                    {t('common:cancel')}
                  </Button>
                  <Button appearance="primary" className="!pw-font-bold" type="submit">
                    {t('common:confirm')}
                  </Button>
                </div>
              </div>
            </FormProvider>
          </Popover>
        );
      }}
    >
      <Button
        appearance="ghost"
        onClick={(e) => {
          e.stopPropagation();
          if (!canUpdate) whisperRef.current?.close();
        }}
      >
        {t('action.open_inventory')}
      </Button>
    </Whisper>
  );
};

export default memo(OpenInventory);
