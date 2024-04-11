import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { paymentFormSchema, paymentYubSchema } from './config';
import { DrawerHeader, DrawerBody, DrawerFooter, Loading } from '~app/components';
import {
  useContactDetailQuery,
  CONTACTS_KEY,
  CONTACT_TRANSACTIONS_KEY,
  CONTACT_DETAIL,
  usePaymentSourcesQuery,
  CONTACT_TRANSACTION_TOTAL_KEY,
} from '~app/services/queries';
import { queryClient } from '~app/configs/client';
import { defaultContactTransaction, toPendingContactTransaction, toPendingCashbook } from '~app/features/debt/utils';
import FormProvider from '~app/components/HookForm/FormProvider';
import FormLayout from '~app/components/HookForm/FormLayout';
import { useCreateCashbookMutation, useCreateContactTransactionMutation } from '~app/services/mutations';
import { Action, CASH_PAYMENT_SOURCE, DebtbookObjectType, DebtType } from '~app/utils/constants';

const CreatePayment = ({
  onClose,
  contact_transaction,
}: {
  onClose: () => void;
  contact_transaction?: ContactTransaction;
}): JSX.Element => {
  const { t } = useTranslation(['modal-title', 'common']);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') as string;
  const { data: contactDetail, isLoading, isError } = useContactDetailQuery(id);
  const { data: paymentSource } = usePaymentSourcesQuery({
    page: 1,
    page_size: 10,
    type: 'default',
    sort: 'priority asc',
  });

  const { mutateAsync: mutateAsyncContactTransaction } = useCreateContactTransactionMutation();
  const { mutateAsync: mutateAsyncCashbook } = useCreateCashbookMutation();

  const showContactInfo = useMemo(() => {
    if (contact_transaction) return false;
    return true;
  }, [contact_transaction]);

  const methods = useForm<ReturnType<typeof defaultContactTransaction>>({
    resolver: yupResolver(paymentYubSchema()),
    defaultValues: defaultContactTransaction(),
  });
  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: ReturnType<typeof defaultContactTransaction>) => {
    try {
      if (data.object_type === DebtbookObjectType.ORDER || data.object_type === DebtbookObjectType.PO) {
        const cashPaymentSource = paymentSource?.data.find((item) => item.name === CASH_PAYMENT_SOURCE);
        data.payment_method = cashPaymentSource?.name || '';
        data.payment_source_name = cashPaymentSource?.name || '';
        data.payment_source_id = cashPaymentSource?.id || '';
      }
      const contactTransactionParams = toPendingContactTransaction({
        ...data,
        action: Action.CREATE,
        is_pay_transaction: true,
      });
      await mutateAsyncContactTransaction(contactTransactionParams);
      if (data.is_cashbook) {
        const cashbookParams = toPendingCashbook(data);
        await mutateAsyncCashbook(cashbookParams);
      }
      queryClient.invalidateQueries([CONTACT_TRANSACTIONS_KEY], {
        exact: false,
      });
      queryClient.invalidateQueries([CONTACT_TRANSACTION_TOTAL_KEY], { exact: false });
      queryClient.invalidateQueries([CONTACT_DETAIL], {
        exact: false,
      });
      queryClient.invalidateQueries([CONTACTS_KEY], { exact: false });
      handleClose();
    } catch (error) {
      // TO DO
    }
  };

  useEffect(() => {
    if (!contactDetail) return;
    let amount = 0;
    const option = contactDetail?.debt_amount && contactDetail?.debt_amount > 0 ? DebtType.IN : DebtType.OUT;
    if (contact_transaction) {
      amount = contact_transaction?.amount ? Math.abs(contact_transaction.amount) : 0;
    } else {
      amount = contactDetail?.debt_amount ? Math.abs(contactDetail.debt_amount) : 0;
    }
    reset({
      ...defaultContactTransaction(),
      amount,
      max_amount: amount,
      contact_id: contactDetail?.id || '',
      contact_name: contactDetail?.name || '',
      transaction_type: contact_transaction?.transaction_type ? contact_transaction?.transaction_type : option,
      object_key: contact_transaction?.object_key || '',
      object_type: contact_transaction?.object_type || '',
      is_contact_debt: contact_transaction ? false : true,
    });
  }, [contactDetail, contact_transaction]);

  const handleClose = () => {
    onClose();
  };

  const handlePaymentSourceChange = useCallback((data: Payment) => {
    setValue('payment_source_id', data.id);
    setValue('payment_source_name', data.name);
    setValue('payment_method', data.name);
  }, []);

  useEffect(() => {
    if (isError) {
      onClose();
    }
  }, [isError]);

  return (
    <>
      <DrawerHeader title={t(`modal-title:create-payment-debt`)} onClose={onClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white">
          <FormLayout
            formSchema={paymentFormSchema({
              showContactInfo,
              contact: contactDetail,
              isContactPayment: contact_transaction ? false : true,
              isCashbook: watch('is_cashbook'),
              onPaymentSourceChange: handlePaymentSourceChange,
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
        {isLoading || isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-[2000]" /> : null}
      </FormProvider>
    </>
  );
};
export default CreatePayment;
