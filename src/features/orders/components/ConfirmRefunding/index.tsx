import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { formSchema, yupSchema } from './config';
import { usePaymentSourcesQuery } from '~app/services/queries';
import { DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import FormProvider from '~app/components/HookForm/FormProvider';
import FormLayout from '~app/components/HookForm/FormLayout';
import { useUpdateOrderRefundMutation } from '~app/services/mutations';

type Props = {
  orderId: string;
  amount: number;
  isDebit: boolean;
  onSuccess?(): void;
  onClose(): void;
};

const ConfirmRefunding = ({ orderId, amount, isDebit, onSuccess, onClose }: Props) => {
  const { t } = useTranslation(['orders-form', 'modal-title', 'common']);
  const { mutateAsync } = useUpdateOrderRefundMutation();
  const { data: paymentSource, isLoading } = usePaymentSourcesQuery({
    page: 1,
    page_size: 10,
    type: 'default',
    sort: 'priority asc',
  });

  const methods = useForm<UpdateOrderRefundBody>({
    resolver: yupResolver(yupSchema()),
    defaultValues: {
      business_id: '',
      payment_source_id: '',
      payment_source_name: '',
      debit: {
        buyer_pay: amount,
        is_debit: false,
      },
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

  const onSubmit = async (values: UpdateOrderRefundBody) => {
    try {
      const body: UpdateOrderRefundBody = {
        ...values,
        debit: {
          buyer_pay: values.debit.buyer_pay,
          is_debit: values.debit.is_debit,
        },
      };
      await mutateAsync({ id: orderId, body: body });
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
      <DrawerHeader
        title={isDebit ? t('modal-title:debt-payment') : t('modal-title:confirm-paying')}
        onClose={handleClose}
      />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white">
          <FormLayout
            formSchema={formSchema({
              amount,
              isDebit,
            })}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button onClick={handleClose} className="pw-button-primary-outline !pw-py-3 !pw-px-6">
            <span className="pw-text-base pw-font-bold">{isDebit ? t('common:cancel') : t('refund_later')}</span>
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

export default ConfirmRefunding;
