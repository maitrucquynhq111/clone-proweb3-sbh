import { useTranslation } from 'react-i18next';
import { Button, Drawer } from 'rsuite';
import { useEffect } from 'react';
import { BsExclamationTriangleFill } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ingredientOutOfStockFormSchema, toPendingPurchaseOrderIngredient } from './config';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { DrawerBody, DrawerFooter, DrawerHeader } from '~app/components';
import { usePurchaseOrderIngredientMutation } from '~app/services/mutations';

type Props = {
  data: Ingredient[];
  hideDelete?: boolean;
  open: boolean;
  onSuccess?: () => void;
  onClose: () => void;
};

const IngredientOutOfStock = ({ data, hideDelete = false, open, onSuccess, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('pos');
  const { mutateAsync } = usePurchaseOrderIngredientMutation();

  const methods = useForm();
  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (data.length > 0) {
      reset({ data });
    }
  }, [data]);

  const onSubmit = async (data: ExpectedAny) => {
    try {
      const nextData = toPendingPurchaseOrderIngredient(data.data);
      await mutateAsync(nextData);
      toast.success(t('success.import_ingredient'));
      onSuccess?.();
      handleClose();
    } catch (error) {
      // TO DO
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer open={open} onClose={handleClose} size="md" keyboard={false} backdrop="static">
      <div className="pw-flex pw-flex-col !pw-h-screen">
        <DrawerHeader title={t('out_of_stock_ingredient.modal_title')} onClose={handleClose} />
        <div className="pw-flex pw-bg-orange-50 pw-p-4 pw-shadow-dropdown">
          <div className="pw-text-orange-700 pw-mr-2 pw-text-xl">
            <BsExclamationTriangleFill />
          </div>
          <span className="pw-text-sm pw-text-orange-800"> {t('out_of_stock_ingredient.warning_ingredient')} </span>
        </div>
        <FormProvider
          className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
          methods={methods}
          onSubmit={handleSubmit(onSubmit)}
        >
          <DrawerBody className="pw-bg-white !pw-p-0">
            <FormLayout formSchema={ingredientOutOfStockFormSchema()} />
          </DrawerBody>
          <DrawerFooter>
            {!hideDelete && (
              <Button className="!pw-py-3 !pw-px-6" appearance="ghost" onClick={handleClose}>
                {t('common:cancel')}
              </Button>
            )}
            <Button className="!pw-py-3 !pw-px-6" appearance="primary" type="submit">
              {t('action.import_goods')}
            </Button>
          </DrawerFooter>
        </FormProvider>
      </div>
    </Drawer>
  );
};

export default IngredientOutOfStock;
