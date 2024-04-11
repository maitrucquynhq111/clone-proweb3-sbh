import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { queryClient } from '~app/configs/client';
import {
  customerPaidYupSchema,
  defaultCustomerPaid,
  paymentDebtFormSchema,
  toPendingCustomerPaidDetail,
} from '~app/features/orders/details/config';
import { ORDER_DETAIL_KEY, usePaymentSourcesQuery } from '~app/services/queries';
import { AuthService } from '~app/services/api';
import { useCreateCustomerPaidMutation } from '~app/services/mutations';
import { getErrorMessage } from '~app/utils/helpers';

const PaymentForm = ({ debtAmount, onClose }: { debtAmount: number; onClose(): void }) => {
  const { t } = useTranslation('common');
  const [order] = useSelectedOrderStore((store) => store);
  const { data: paymentSource } = usePaymentSourcesQuery({
    page: 1,
    page_size: 20,
  });
  const { mutateAsync } = useCreateCustomerPaidMutation();

  const methods = useForm<CreateCustomPaid>({
    resolver: yupResolver(customerPaidYupSchema()),
    defaultValues: defaultCustomerPaid(),
  });

  const { handleSubmit, setValue, reset } = methods;

  const onSubmit = async (data: CreateCustomPaid) => {
    try {
      const nextData = { ...data, business_id: (await AuthService.getBusinessId()) || '' };
      await mutateAsync(nextData);
      onClose();
      queryClient.invalidateQueries([ORDER_DETAIL_KEY], { exact: false });
      toast.success(t('orders-form:success.create_customer_paid'));
    } catch (error) {
      // TO DO
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    if (!order) return;
    reset(
      toPendingCustomerPaidDetail({ id: order.id || '', debtAmount, paymentSource: paymentSource?.data?.[0] || null }),
    );
  }, [order, paymentSource]);

  return (
    <FormProvider
      className="pw-rounded pw-bg-neutral-background pw-my-4"
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormLayout formSchema={paymentDebtFormSchema({ debtAmount, setValue })} />
      <div className="pw-flex pw-justify-end pw-mt-2 pw-pb-3 pw-mr-3">
        <Button className="pw-mr-3 !pw-bg-white !pw-font-bold" onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button className="!pw-font-bold" appearance="primary" type="submit">
          {t('modal-confirm')}
        </Button>
      </div>
    </FormProvider>
  );
};

export default memo(PaymentForm);
