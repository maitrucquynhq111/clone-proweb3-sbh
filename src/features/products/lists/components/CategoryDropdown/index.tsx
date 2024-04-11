import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { config } from './config';
import { useAssignProductsToCategoriesMutation } from '~app/services/mutations';
import FormProvider from '~app/components/HookForm/FormProvider';
import FormLayout from '~app/components/HookForm/FormLayout';

const initialValues = {
  category_ids: [],
};

const CategoryDropdown = ({ selected }: { selected: string[] }) => {
  const { isLoading, mutateAsync } = useAssignProductsToCategoriesMutation();
  const { t } = useTranslation('notification');
  const methods = useForm<ExpectedAny>({
    defaultValues: initialValues,
  });

  const { handleSubmit, reset, watch } = methods;

  const onSubmit = async ({ category_ids }: { category_ids: string[] }) => {
    const result = await mutateAsync({
      productIds: selected,
      categoryIds: category_ids,
    } as ExpectedAny);
    if (result) {
      reset(initialValues);
      toast.success(t('update-success'));
    }
  };

  const category_ids = watch('category_ids');

  return (
    <FormProvider className="pw-z-10 pw-relative pw-max-w-xs pw-min-w" methods={methods}>
      <FormLayout
        formSchema={{
          type: 'container',
          name: 'form',
          children: config(
            handleSubmit(onSubmit),
            () => {
              reset(initialValues);
            },
            isLoading,
            category_ids.length <= 0,
          ),
        }}
      />
    </FormProvider>
  );
};

export default CategoryDropdown;
