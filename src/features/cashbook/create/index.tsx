import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Button } from 'rsuite';
import { cashbookFormSchema, cashbookYupSchema } from './config';
import { DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import { queryClient } from '~app/configs/client';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { defaultCashbook, toPendingCashbook, toPendingContactTransaction } from '~app/features/cashbook/utils';
import { isLocalImage, revokeObjectUrl } from '~app/utils/helpers';
import { ProductService } from '~app/services/api';
import { useCreateCashbookMutation, useCreateContactTransactionMutation } from '~app/services/mutations';
import { CASHBOOK_KEY, TRANSACTION_HISTORY } from '~app/services/queries';
import { Action, CashBookType } from '~app/utils/constants';

const CashbookCreate = ({
  onSuccess,
  onClose,
  transaction_type,
}: {
  onSuccess?: (data: ExpectedAny) => void;
  onClose: () => void;
  transaction_type: CashBookType;
}): JSX.Element => {
  const { t } = useTranslation('cashbook-form');
  const { mutateAsync: createCashbookMutateAsync } = useCreateCashbookMutation();
  const { mutateAsync: createContactTransactionMutateAsync } = useCreateContactTransactionMutation();

  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<ReturnType<typeof defaultCashbook>>({
    resolver: yupResolver(cashbookYupSchema()),
    defaultValues: defaultCashbook(),
  });
  const { handleSubmit, watch, setValue, getValues } = methods;

  const handleClose = () => {
    const data = getValues();
    data.images.forEach((image: string | PendingUploadImage) => {
      if (isLocalImage(image)) {
        revokeObjectUrl(image.url);
      }
    });
    onClose();
  };

  const onSubmit = async (data: ReturnType<typeof defaultCashbook>) => {
    try {
      setIsLoading(true);
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
      if (data.is_debit === true) {
        const params = toPendingContactTransaction(data, transaction_type, Action.CREATE);
        params.images = uploadedImages;
        const response = await createContactTransactionMutateAsync(params);
        onSuccess?.(response);
      } else {
        const params = toPendingCashbook(data, transaction_type);
        params.images = uploadedImages;
        const response = await createCashbookMutateAsync(params);
        onSuccess?.(response);
      }
      setIsLoading(false);
      handleClose();
      queryClient.invalidateQueries([CASHBOOK_KEY], { exact: false });
      queryClient.invalidateQueries([TRANSACTION_HISTORY], { exact: false });
    } catch (_) {
      // TO DO
      setIsLoading(false);
    }
  };

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader
        title={t(`modal-title:create-cashbook-${transaction_type}`)}
        className={transaction_type === CashBookType.OUT ? 'pw-bg-secondary-main' : ''}
        onClose={handleClose}
      />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white">
          <FormLayout
            formSchema={cashbookFormSchema({
              setValue,
              transaction_type,
              is_debit: watch('is_debit'),
              images: watch('images'),
            })}
          />
        </DrawerBody>
        <DrawerFooter className="!pw-border-none !pw-shadow-revert">
          <Button onClick={handleClose} className="pw-button-secondary !pw-py-3 !pw-px-6">
            <span className="pw-text-base pw-font-bold pw-text-neutral-primary">{t('common:cancel')}</span>
          </Button>
          <Button type="submit" className="pw-button-primary !pw-py-3 !pw-px-6">
            <span className="pw-text-base pw-font-bold pw-text-neutral-white">{t('common:modal-confirm')}</span>
          </Button>
        </DrawerFooter>
      </FormProvider>
      {isLoading ? <Loading backdrop={true} vertical={true} className="pw-z-2000" /> : null}
    </div>
  );
};

export default CashbookCreate;
