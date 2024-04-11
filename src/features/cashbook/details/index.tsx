import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Button } from 'rsuite';
import { cashbookFormSchema, cashbookYupSchema } from './config';
import { DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { defaultCashbookDetail, toPendingCashbookDetail } from '~app/features/cashbook/utils';
import { isLocalImage, revokeObjectUrl } from '~app/utils/helpers';
import { ProductService } from '~app/services/api';
import { CashBookType } from '~app/utils/constants';
import { useCashbookDetailQuery, CASHBOOK_KEY, TRANSACTION_HISTORY } from '~app/services/queries';
import { useUpdateCashbookMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';

const CashbookDetail = ({
  onClose,
  transaction_type,
}: {
  onClose: () => void;
  transaction_type: CashBookType;
}): JSX.Element => {
  const { t } = useTranslation('cashbook-form');
  const { mutateAsync } = useUpdateCashbookMutation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') as string;
  const { data: cashbookDetail, isLoading, isError } = useCashbookDetailQuery(id ? id : '');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<PendingCashbook>({
    resolver: yupResolver(cashbookYupSchema()),
    defaultValues: defaultCashbookDetail(),
  });

  const { handleSubmit, watch, setValue, reset, getValues } = methods;

  const handleClose = () => {
    const data = getValues();
    data.images.forEach((image) => {
      if (isLocalImage(image)) {
        revokeObjectUrl(image.url);
      }
    });
    onClose();
  };

  const onSubmit = async (data: PendingCashbook) => {
    try {
      setIsSubmitting(true);
      const params = { ...data };
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
      params.day = (data.day as Date).toISOString();
      params.images = uploadedImages;
      if (data.category_id) {
        Object.assign(params, {
          category_id: data.category_id,
          category_name: data.category_name,
        });
      }
      if (data.payment_source_id) {
        Object.assign(params, {
          payment_source_id: data.payment_source_id,
          payment_source_name: data.payment_source_name,
          payment_method: data.payment_source_name,
        });
      }
      setIsSubmitting(false);
      await mutateAsync(params);

      queryClient.invalidateQueries([CASHBOOK_KEY], {
        exact: false,
      });
      queryClient.invalidateQueries([TRANSACTION_HISTORY], { exact: false });
      handleClose();
    } catch (_) {
      // TO DO
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!cashbookDetail) return;
    reset(toPendingCashbookDetail(cashbookDetail));
  }, [cashbookDetail, transaction_type]);

  useEffect(() => {
    if (isError) {
      onClose();
    }
  }, [isError]);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader
        title={t(`modal-title:detail-cashbook-${transaction_type}`)}
        className={transaction_type === CashBookType.OUT ? 'pw-bg-orange-600' : ''}
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
              images: watch('images'),
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

export default CashbookDetail;
