import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { yupSchema } from './config';
import { useCreateCategoryMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import { TextInput } from '~app/components';

type Props = {
  queryKey: ExpectedAny;
  onClose?(): void;
};

const CreateCashbookCategory = ({ queryKey, onClose }: Props) => {
  const { t } = useTranslation(['cashbook-form', 'common']);
  const { mutateAsync } = useCreateCategoryMutation();
  const [searchParams] = useSearchParams();
  const transaction_type = searchParams.get('transaction_type') as string;

  const methods = useForm<PendingCashbookCategory>({
    resolver: yupResolver(yupSchema()),
    defaultValues: { name: '' },
  });
  const { control, handleSubmit } = methods;

  const handleClose = () => {
    onClose && onClose();
  };

  const onSubmit = async (data: PendingCashbookCategory) => {
    try {
      const response = await mutateAsync({ ...data, type: transaction_type });
      if (response) {
        queryClient.invalidateQueries(queryKey);
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
              label={t('cashbook_category_name') || ''}
              isForm={false}
              isRequired={true}
              error={error}
              placeholder={t('placeholder.cashbook_category_name') || ''}
            />
          );
        }}
      />
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

export default CreateCashbookCategory;
