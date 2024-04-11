import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { toast } from 'react-toastify';
import { updateOrderFormSchema, updateOrderYupSchema } from './config';
import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  IngredientOutOfStock,
  Loading,
  ProductOutOfStock,
} from '~app/components';
import { queryClient } from '~app/configs/client';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { ORDERS_ANALYTICS_KEY, ORDERS_KEY, usePaymentSourcesQuery } from '~app/services/queries';
import { useUpdateOrderMutation } from '~app/services/mutations/useUpdateOrderMutation';
import { defaultUpdateOrder } from '~app/features/orders/utils';
import { OrderResponseType, OrderStatusType } from '~app/utils/constants';

type Props = { order: Order | null; onSuccess?: () => void; onClose: () => void };

const ConfirmPaying = ({ order, onSuccess, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('orders-form');
  const { mutateAsync } = useUpdateOrderMutation();
  const { data: paymentSource } = usePaymentSourcesQuery({
    page: 1,
    page_size: 10,
    type: 'default',
    sort: 'priority asc',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [responseOrder, setResponseOrder] = useState<ExpectedAny>(null);
  const methods = useForm<ReturnType<typeof defaultUpdateOrder>>({
    resolver: yupResolver(updateOrderYupSchema()),
    defaultValues: defaultUpdateOrder({
      buyer_pay: 0,
      paymentMethod: { id: '', name: '' },
    }),
  });
  const { handleSubmit, watch, setValue, reset } = methods;
  const paymentAmount = useMemo(() => (order ? order?.grand_total - order?.amount_paid : 0), [order]);
  const buyerPay = watch('debit.buyer_pay');
  const isDebit = watch('debit.is_debit');

  useEffect(() => {
    if (paymentSource?.data?.[0] && order) {
      const defaultData = defaultUpdateOrder({
        state: OrderStatusType.COMPLETE,
        buyer_pay: order.grand_total - order.amount_paid,
        paymentMethod: paymentSource.data[0],
      });
      reset({ ...defaultData });
    }
  }, [paymentSource]);

  useEffect(() => {
    if (isDebit === true && buyerPay === paymentAmount) {
      setValue('debit.buyer_pay', 0);
    }
  }, [isDebit, paymentAmount]);

  useEffect(() => {
    if ((buyerPay > paymentAmount || buyerPay === paymentAmount) && isDebit) {
      setValue('debit.is_debit', false);
    }
    if (buyerPay > 0 && buyerPay < paymentAmount && !isDebit) {
      setValue('debit.is_debit', true);
    }
  }, [buyerPay, paymentAmount]);

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: ReturnType<typeof defaultUpdateOrder>) => {
    try {
      if (order && paymentSource?.data?.[0]) {
        setIsLoading(true);
        const nextOrder = { ...data, payment_method: data.payment_source_name };
        const response = await mutateAsync({ id: order.id, body: nextOrder });
        if (response?.status) {
          setIsLoading(false);
          setResponseOrder(response);
          return;
        }
        queryClient.invalidateQueries([ORDERS_KEY], { exact: false });
        queryClient.invalidateQueries([ORDERS_ANALYTICS_KEY], { exact: false });
        toast.success(t('success.update'));
        onSuccess?.();
        setIsLoading(false);
        onClose();
      }
    } catch (_) {
      // TO DO
      setIsLoading(false);
    }
  };

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t('modal-title:confirm-paying')} onClose={handleClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white">
          <FormLayout
            formSchema={updateOrderFormSchema({
              buyerPay,
              isDebit,
              paymentAmount,
            })}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button
            className="pw-button-primary !pw-py-3 !pw-px-4 !pw-text-base !pw-font-bold !pw-text-neutral-white"
            onClick={handleClose}
          >
            <span>{t('common:cancel')}</span>
          </Button>
          <Button
            type="submit"
            className="pw-button-primary !pw-py-3 !pw-px-4 !pw-text-base !pw-font-bold !pw-text-neutral-white"
          >
            <span>{t('common:modal-confirm')}</span>
          </Button>
        </DrawerFooter>
      </FormProvider>
      {isLoading ? <Loading backdrop={true} vertical={true} className="pw-z-[2000]" /> : null}
      {responseOrder && responseOrder.status === OrderResponseType.SOLD_OUT && (
        <ProductOutOfStock
          data={responseOrder.items_info}
          hideDelete={true}
          open={true}
          onClose={() => setResponseOrder(null)}
        />
      )}
      {responseOrder && responseOrder.status === OrderResponseType.SOLD_OUT_GREDIENT && (
        <IngredientOutOfStock
          data={responseOrder.list_ingredient}
          hideDelete
          open={true}
          onClose={() => setResponseOrder(null)}
        />
      )}
    </div>
  );
};

export default ConfirmPaying;
