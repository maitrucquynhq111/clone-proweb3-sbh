import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import { yupSchema } from './config';
import { CurrencyInput, TextInput } from '~app/components';
import { queryClient } from '~app/configs/client';
import { useCreatePaymentMutation } from '~app/services/mutations';
import { PAYMENT_SOURCE_KEY } from '~app/services/queries';

type Props = {
  queryKey: ExpectedAny;
  onClose?(): void;
};

const CreatePaymentSource = ({ onClose }: Props) => {
  const { t } = useTranslation(['cashbook-form', 'common']);
  const { mutateAsync } = useCreatePaymentMutation();

  const methods = useForm<PendingPayment>({
    resolver: yupResolver(yupSchema()),
    defaultValues: { name: '', balance: 0 },
  });
  const { control, handleSubmit } = methods;

  const handleClose = () => {
    onClose && onClose();
  };

  const onSubmit = async (data: PendingPayment) => {
    try {
      const response = await mutateAsync(data);
      if (response) {
        queryClient.invalidateQueries([PAYMENT_SOURCE_KEY], { exact: false });
        handleClose();
      }
    } catch (_) {
      // TO DO
    }
  };

  const handleSubmitWithPropagation = (e: ExpectedAny) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onSubmit)(e);
  };

  return (
    <form onSubmit={handleSubmitWithPropagation} className="pw-p-4 pw-bg-neutral-background">
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <TextInput
              {...field}
              label={t('payment_source_name') || ''}
              isForm={false}
              isRequired={true}
              error={error}
              placeholder={t('placeholder.payment_source_name') || ''}
            />
          );
        }}
      />
      <div className="pw-mt-2">
        <Controller
          name="balance"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <CurrencyInput
                {...field}
                label={t('balance') || ''}
                isForm={false}
                error={error}
                placeholder="0.000"
                onChange={(value: string) => field.onChange(+value)}
              />
            );
          }}
        />
      </div>
      <div className="pw-flex pw-justify-end pw-gap-x-2.5 pw-bg-neutral-background pw-mt-4">
        <Button onClick={handleClose} className="pw-button-secondary !pw-py-1.5 !pw-px-4">
          <span className="pw-text-sm pw-font-bold pw-text-neutral-primary">{t('common:back')}</span>
        </Button>
        <Button type="submit" className="pw-button-primary !pw-py-1.5 !pw-px-4">
          <span className="pw-text-sm pw-font-bold pw-text-neutral-white">{t('common:save')}</span>
        </Button>
      </div>
    </form>
  );
};

export default CreatePaymentSource;
