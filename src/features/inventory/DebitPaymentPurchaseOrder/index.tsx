import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { toast } from 'react-toastify';
import { debitPaymentDefault, DebitPaymentPurchaseOrderFormSchema, debitPaymentYupSchema } from './config';
import { DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import { queryClient } from '~app/configs/client';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import {
  INVENTORY_BOOK_ANALYTICS_KEY,
  INVENTORY_DETAILS_KEY,
  INVENTORY_KEY,
  usePaymentSourcesQuery,
} from '~app/services/queries';
import { useCreateInventoryPayment } from '~app/services/mutations';

type Props = { detail: InventoryDetail; debtAmount: number; onSuccess?: () => void; onClose: () => void };

const DebitPaymentPurchaseOrder = ({ detail, debtAmount, onSuccess, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('purchase-order');
  const { mutateAsync } = useCreateInventoryPayment();
  const { data: paymentSource } = usePaymentSourcesQuery({
    page: 1,
    page_size: 10,
    type: 'default',
    sort: 'priority asc',
  });
  const methods = useForm<ReturnType<typeof debitPaymentDefault>>({
    resolver: yupResolver(debitPaymentYupSchema()),
    defaultValues: debitPaymentDefault({}),
  });
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (paymentSource?.data?.[0] && detail) {
      const defaultData = debitPaymentDefault({
        amount: debtAmount,
        detail,
        paymentSource: paymentSource.data[0],
      });
      reset({ ...defaultData });
    }
  }, [paymentSource]);

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: ReturnType<typeof debitPaymentDefault>) => {
    try {
      if (detail && paymentSource?.data?.[0]) {
        await mutateAsync(data);
        queryClient.invalidateQueries([INVENTORY_DETAILS_KEY], { exact: false });
        queryClient.invalidateQueries([INVENTORY_KEY], { exact: false });
        queryClient.invalidateQueries([INVENTORY_BOOK_ANALYTICS_KEY], { exact: false });
        toast.success(t('success.payment_purchase'));
        onSuccess?.();
        handleClose();
      }
    } catch (_) {
      // TO DO
    }
  };

  const handlePaymentSourceChange = useCallback((data: Payment) => {
    setValue('payment_source_id', data.id);
    setValue('payment_method', data.name);
    setValue('payment_source_name', data.name);
  }, []);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t('modal-title:debt-payment')} onClose={handleClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white">
          <FormLayout
            formSchema={DebitPaymentPurchaseOrderFormSchema({
              debtAmount,
              onPaymentSourceChange: handlePaymentSourceChange,
            })}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button
            type="submit"
            className="pw-button-primary !pw-py-3 !pw-px-4 !pw-text-base !pw-font-bold !pw-text-neutral-white"
          >
            <span>{t('common:modal-confirm')}</span>
          </Button>
        </DrawerFooter>
      </FormProvider>
      {isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-[2000]" /> : null}
    </div>
  );
};

export default DebitPaymentPurchaseOrder;
