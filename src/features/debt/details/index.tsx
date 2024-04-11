import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { debtbookSchema, debtbookYupSchema } from './config';
import { DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { Action, DebtType } from '~app/utils/constants';
import {
  defaultContactTransaction,
  DefaultContactTransactionType,
  toPendingContactTransaction,
} from '~app/features/debt/utils';
import { isLocalImage } from '~app/utils/helpers';
import { ProductService } from '~app/services/api';
import { useUpdateContactTransactionMutation } from '~app/services/mutations/useUpdateContactTransactionMutation';
import { queryClient } from '~app/configs/client';
import {
  CONTACTS_KEY,
  CONTACT_DETAIL,
  CONTACT_TRANSACTIONS_KEY,
  CONTACT_TRANSACTION_TOTAL_KEY,
  TRANSACTION_HISTORY,
  useDebtDetailQuery,
} from '~app/services/queries';

const DebtbookDetails = ({ id, onClose }: { id?: string; onClose: () => void }): JSX.Element => {
  const { t } = useTranslation(['debtbook-form', 'modal-title']);
  const { mutateAsync } = useUpdateContactTransactionMutation();
  const { data: contact_transaction, isLoading, isError } = useDebtDetailQuery(id || '');
  const methods = useForm<DefaultContactTransactionType>({
    resolver: yupResolver(debtbookYupSchema()),
    defaultValues: defaultContactTransaction(),
  });
  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: DefaultContactTransactionType) => {
    try {
      const uploadedImages = await Promise.all(
        data.images.map(async (image) => {
          try {
            if (isLocalImage(image)) {
              return await ProductService.uploadProductImage(image as PendingUploadImage);
            }
            return image;
          } catch (error: ExpectedAny) {
            toast.error(error.message);
            return image;
          }
        }),
      );
      const params = toPendingContactTransaction(data);
      params.transaction_type = data.transaction_type;
      params.images = uploadedImages;
      params.action = Action.UPDATE;
      params.reminder_day = null;
      params.end_time = null;
      await mutateAsync({ ...params, id: contact_transaction?.id || '' });
      queryClient.invalidateQueries([CONTACTS_KEY], {
        exact: false,
      });
      queryClient.invalidateQueries([CONTACT_DETAIL], {
        exact: false,
      });
      queryClient.invalidateQueries([CONTACT_TRANSACTIONS_KEY], {
        exact: false,
      });
      queryClient.invalidateQueries([CONTACT_TRANSACTION_TOTAL_KEY], { exact: false });
      queryClient.invalidateQueries([TRANSACTION_HISTORY], { exact: false });
      toast.success(t('notification:update-success'));
      handleClose();
    } catch (error: ExpectedAny) {
      // TO DO
    }
  };

  useEffect(() => {
    if (isError) {
      onClose();
    }
  }, [isError]);

  useEffect(() => {
    if (!contact_transaction) return;
    reset({
      ...defaultContactTransaction(),
      amount: contact_transaction.amount,
      contact_id: contact_transaction.contact_id,
      contact_name: contact_transaction.contact.name,
      is_pay_transaction: contact_transaction.is_pay_transaction,
      images: contact_transaction?.images || [],
      transaction_type: contact_transaction.transaction_type,
      object_key: contact_transaction.object_key,
      object_type: contact_transaction.object_type,
      description: contact_transaction.description,
      start_time: new Date(contact_transaction.start_time),
      end_time: contact_transaction.end_time,
    });
  }, [contact_transaction]);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader
        title={t(`modal-title:update-debtbook-${contact_transaction?.transaction_type}`)}
        className={contact_transaction?.transaction_type === DebtType.IN ? 'pw-bg-orange-600' : ''}
        onClose={handleClose}
      />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white">
          <FormLayout
            formSchema={debtbookSchema({
              images: watch('images'),
              setValue,
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
      {isLoading || isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-[2000]" /> : null}
    </div>
  );
};

export default DebtbookDetails;
