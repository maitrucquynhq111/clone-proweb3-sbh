import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Button } from 'rsuite';
import { defaultQuickMessage, quickMessageFormSchema, quickMessageYupSchema } from './config';
import { DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import FormProvider from '~app/components/HookForm/FormProvider';
import { QUICK_MESSAGES_KEY } from '~app/services/queries';
import { queryClient } from '~app/configs/client';
import { useUpdateQuickMessageMutation } from '~app/services/mutations';
import FormLayout from '~app/components/HookForm/FormLayout';
import { isLocalImage } from '~app/utils/helpers';
import { ProductService } from '~app/services/api';

type Props = { detail: ExpectedAny | null; onClose: () => void };

const QuickMessageDetails = ({ detail, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('chat');
  const { mutateAsync } = useUpdateQuickMessageMutation();

  const methods = useForm<QuickMessageRequest>({
    resolver: yupResolver(quickMessageYupSchema()),
    defaultValues: defaultQuickMessage(),
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: QuickMessageRequest) => {
    try {
      const newImages = data?.images
        ? await Promise.all(
            data.images.map(async (item) => {
              if (isLocalImage(item)) {
                try {
                  const media = await ProductService.uploadProductImage(item);
                  return media;
                } catch (error: ExpectedAny) {
                  toast.error(error.message);
                  return item;
                }
              }
              return item;
            }),
          )
        : null;
      const body: QuickMessageRequest = {
        id: data.id,
        images: newImages,
        shortcut: data.shortcut,
        message: data.message,
      };
      await mutateAsync({
        id: body?.id || '',
        body: body,
      });
      queryClient.invalidateQueries([QUICK_MESSAGES_KEY], { exact: false });
      toast.success(t('success.update_quick_message'));
      onClose();
    } catch (_) {
      // TO DO
    }
  };

  useEffect(() => {
    const newData: QuickMessageRequest = {
      id: detail?.id || '',
      shortcut: detail?.shortcut || '',
      message: detail?.message || '',
      images: detail?.images || null,
    };
    reset(newData);
  }, [detail]);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t('modal.update_label')} onClose={onClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white">
          <FormLayout
            formSchema={quickMessageFormSchema({
              images: watch('images') || [],
              setValue,
            })}
          />
        </DrawerBody>
        <DrawerFooter className="!pw-border-none !pw-shadow-revert">
          <Button onClick={onClose} className="pw-button-secondary !pw-py-3 !pw-px-6">
            <span className="pw-text-base pw-font-bold pw-text-neutral-primary">{t('common:cancel')}</span>
          </Button>
          <Button type="submit" className="pw-button-primary !pw-py-3 !pw-px-6">
            <span className="pw-text-base pw-font-bold pw-text-neutral-white">{t('common:modal-confirm')}</span>
          </Button>
        </DrawerFooter>
      </FormProvider>
      {isSubmitting ? <Loading backdrop={true} vertical={true} className="pw-z-2000" /> : null}
    </div>
  );
};

export default QuickMessageDetails;
