import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { formSchema, yupSchema } from './config';
import { useCancelCompleteOrderMutation } from '~app/services/mutations';
import { usePaymentSourcesQuery } from '~app/services/queries';
import { DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';

type Props = {
  orderId: string;
  amount: number;
  onSuccess?(): void;
  onClose(): void;
};

const CancelCompleteOrderDrawer = ({ orderId, amount, onSuccess, onClose }: Props) => {
  const { t } = useTranslation('orders-form');
  const { mutateAsync } = useCancelCompleteOrderMutation();
  const { data: paymentSource, isLoading } = usePaymentSourcesQuery({
    page: 1,
    page_size: 10,
    type: 'default',
    sort: 'priority asc',
  });

  const methods = useForm<CancelCompleteOrderBody>({
    resolver: yupResolver(yupSchema()),
    defaultValues: {
      payment_source_id: '',
      payment_source_name: '',
      refund_amount: amount,
    },
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (values: CancelCompleteOrderBody) => {
    try {
      await mutateAsync({ id: orderId, body: values });
      onSuccess?.();
      toast.success(t('success.update'));
    } catch (error) {
      // TO DO
    }
  };

  useEffect(() => {
    if (!paymentSource?.data?.[0]) return;
    reset({
      payment_source_id: paymentSource?.data?.[0].id,
      payment_source_name: paymentSource?.data?.[0].name,
    });
  }, [paymentSource]);

  return (
    <>
      <DrawerHeader title={t('modal-title:confirm-cancel-order')} onClose={handleClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white">
          <FormLayout
            formSchema={formSchema({
              amount,
            })}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button onClick={handleClose} className="pw-button-secondary !pw-py-3 !pw-px-6">
            <span className="pw-text-base pw-font-bold pw-text-neutral-primary">{t('common:cancel')}</span>
          </Button>
          <Button type="submit" className="pw-button-primary !pw-py-3 !pw-px-6">
            <span className="pw-text-base pw-font-bold pw-text-neutral-white">{t('common:modal-confirm')}</span>
          </Button>
        </DrawerFooter>
      </FormProvider>
      {isLoading || isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-2000" /> : null}
    </>
  );
};

export default CancelCompleteOrderDrawer;
