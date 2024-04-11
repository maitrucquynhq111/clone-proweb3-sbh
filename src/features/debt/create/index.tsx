import { toast } from 'react-toastify';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { debtbookSchema, debtbookYupSchema } from './config';
import { DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { Action, DebtType } from '~app/utils/constants';
import { defaultDebtbook } from '~app/features/debt/utils';
import { useCreateContactTransactionMutation } from '~app/services/mutations';
import { isLocalImage } from '~app/utils/helpers';
import { ProductService } from '~app/services/api';
import {
  CONTACTS_KEY,
  CONTACT_ANALYTIC_KEY,
  CONTACT_DETAIL,
  CONTACT_TRANSACTIONS_KEY,
  CONTACT_TRANSACTION_TOTAL_KEY,
} from '~app/services/queries';
import { queryClient } from '~app/configs/client';

const DebtbookCreate = ({
  onSuccess,
  onClose,
  transaction_type,
}: {
  onSuccess?: (data: ContactTransaction) => void;
  onClose: () => void;
  transaction_type: DebtType;
}): JSX.Element => {
  const { t } = useTranslation(['debtbook-form', 'modal-title']);
  const [searchParams] = useSearchParams();
  const contact_id = searchParams.get('id') as string;

  const { mutateAsync } = useCreateContactTransactionMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditContact, setIsEditContact] = useState(true);

  const showContactBlock = useMemo(() => {
    return contact_id ? false : true;
  }, [contact_id]);

  const methods = useForm<PendingContactTransaction>({
    resolver: yupResolver(debtbookYupSchema()),
    defaultValues: defaultDebtbook(),
  });
  const { handleSubmit, watch, setValue, reset } = methods;

  const handleContactChange = useCallback((data: Contact) => {
    setValue('contact_phone', data.phone_number);
    setValue('contact_avatar', data.avatar);
    setIsEditContact(false);
  }, []);

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: PendingContactTransaction) => {
    try {
      setIsLoading(true);
      const { contact, contact_avatar, contact_phone, ...params } = data;
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
      params.images = uploadedImages;
      params.transaction_type = transaction_type;
      params.action = Action.CREATE;
      params.start_time = (data.start_time as Date).toISOString();
      params.reminder_day = null;
      const response = await mutateAsync(params);
      onSuccess?.(response);
      setIsLoading(false);
      handleClose();
      queryClient.invalidateQueries([CONTACTS_KEY], {
        exact: false,
      });
      queryClient.invalidateQueries([CONTACT_DETAIL], {
        exact: false,
      });
      queryClient.invalidateQueries([CONTACT_TRANSACTIONS_KEY], {
        exact: false,
      });
      queryClient.invalidateQueries([CONTACT_TRANSACTION_TOTAL_KEY], {
        exact: false,
      });
      queryClient.invalidateQueries([CONTACT_ANALYTIC_KEY], {
        exact: false,
      });
    } catch (_) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!contact_id) return;
    reset({
      ...defaultDebtbook(),
      contact_id,
    });
  }, [contact_id]);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader
        title={t(`modal-title:create-debtbook-${transaction_type}`)}
        className={transaction_type === DebtType.IN ? 'pw-bg-secondary-main' : ''}
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
              isEditContact,
              showContactBlock,
              setIsEditContact,
              images: watch('images'),
              onContactChange: handleContactChange,
              setValue,
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

export default DebtbookCreate;
