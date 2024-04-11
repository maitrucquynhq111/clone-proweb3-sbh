import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { ingredientFormSchema, ingredientYupSchema } from './config';
import { DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import { queryClient } from '~app/configs/client';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { INGREDIENTS_KEY } from '~app/services/queries';
import { useCreateIngredientMutation } from '~app/services/mutations';
import { defaultIngredient, toPendingIngredient } from '~app/features/ingredients/utils';

type Props = { onSuccess?: (data: Ingredient) => void; onClose: () => void };

const IngredientCreate = ({ onSuccess, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('ingredients-form');
  const { mutateAsync } = useCreateIngredientMutation();

  const methods = useForm<ReturnType<typeof defaultIngredient>>({
    resolver: yupResolver(ingredientYupSchema()),
    defaultValues: defaultIngredient(),
  });
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { isSubmitting, errors },
  } = methods;

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: ReturnType<typeof defaultIngredient>) => {
    try {
      const response = await mutateAsync(toPendingIngredient({ data }));
      onClose();
      onSuccess?.(response);
      queryClient.invalidateQueries([INGREDIENTS_KEY], { exact: false });
      toast.success(t('success.create'));
    } catch (_) {
      // TO DO
    }
  };

  useEffect(() => {
    if (watch('uom_name') && errors?.uom_name) {
      clearErrors('uom_name');
    }
  }, [watch('uom_name')]);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t('modal-title:create-ingredient')} onClose={handleClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white">
          <FormLayout
            formSchema={ingredientFormSchema({
              is_warning: watch('is_warning'),
              total_quantity: watch('total_quantity'),
              setValue,
            })}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button appearance="ghost" onClick={handleClose}>
            <span>{t('common:cancel')}</span>
          </Button>
          <Button appearance="primary" type="submit">
            <span>{t('common:modal-confirm')}</span>
          </Button>
        </DrawerFooter>
      </FormProvider>
      {isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-[2000]" /> : null}
    </div>
  );
};

export default IngredientCreate;
