import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'rsuite';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import { ingredientFormSchema, ingredientYupSchema } from '~app/features/ingredients/ingredientsList/create/config';
import { ConfirmModal, DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import { queryClient } from '~app/configs/client';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { INGREDIENTS_KEY } from '~app/services/queries';
import { useDeleteIngredientMutation, useUpdateIngredientMutation } from '~app/services/mutations';
import { defaultIngredient, toDefaultIngredient, toPendingIngredient } from '~app/features/ingredients/utils';
import { IngredientPermission, useHasPermissions } from '~app/utils/shield';

type Props = { detail: Ingredient; onSuccess?: (data: Ingredient) => void; onClose: () => void };

const IngredientDetails = ({ detail, onSuccess, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('ingredients-form');
  const { mutateAsync: updateIngredient } = useUpdateIngredientMutation();
  const { mutateAsync: deleteIngredient } = useDeleteIngredientMutation();
  const [openDelete, setOpenDelete] = useState(false);
  const canDelete = useHasPermissions([IngredientPermission.INGREDIENT_DELETE]);
  const canEdit = useHasPermissions([IngredientPermission.INGREDIENT_UPDATE]);

  const methods = useForm<ReturnType<typeof defaultIngredient>>({
    resolver: yupResolver(ingredientYupSchema()),
    defaultValues: defaultIngredient(),
  });

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    clearErrors,
    formState: { isSubmitting, errors },
  } = methods;

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: ReturnType<typeof defaultIngredient>) => {
    try {
      const response = await updateIngredient(toPendingIngredient({ data, id: detail.id }));
      onSuccess?.(response);
      queryClient.invalidateQueries([INGREDIENTS_KEY], { exact: false });
      handleClose();
      toast.success(t('success.update'));
    } catch (_) {
      // TO DO
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (detail) {
        await deleteIngredient(detail.id);
        queryClient.invalidateQueries([INGREDIENTS_KEY], { exact: false });
        handleClose();
        toast.success(t('success.delete'));
      }
    } catch (error) {
      // TO DO
    }
  };

  useEffect(() => {
    if (detail) {
      reset(toDefaultIngredient(detail));
    }
  }, [detail]);

  useEffect(() => {
    if (watch('uom_name') && errors?.uom_name) {
      clearErrors('uom_name');
    }
  }, [watch('uom_name')]);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t('modal-title:ingredient-details')} onClose={handleClose} />
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
        <DrawerFooter className="pw-justify-between">
          {canDelete ? (
            <Button
              appearance="subtle"
              onClick={() => setOpenDelete(true)}
              type="button"
              className="!pw-flex pw-gap-x-2"
            >
              <BsTrash className="pw-w-6 pw-h-6 pw-fill-red-600" />
              <span className="pw-text-red-600 pw-text-base pw-font-bold">{t('common:delete')}</span>
            </Button>
          ) : (
            <div />
          )}
          <div className="pw-flex">
            <Button appearance="ghost" className="pw-mr-4" onClick={handleClose}>
              <span>{t('common:cancel')}</span>
            </Button>
            {canEdit && (
              <Button appearance="primary" type="submit">
                <span>{t('common:update')}</span>
              </Button>
            )}
          </div>
        </DrawerFooter>
      </FormProvider>
      {openDelete && (
        <ConfirmModal
          open={true}
          title={t('delete_ingredients')}
          description={t('delete_ingredients_description')}
          iconTitle={<BsTrash size={24} />}
          isDelete={true}
          onConfirm={handleConfirmDelete}
          onClose={() => setOpenDelete(false)}
          cancelText={t('common:back') || ''}
        />
      )}
      {isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-[2000]" /> : null}
    </div>
  );
};

export default IngredientDetails;
