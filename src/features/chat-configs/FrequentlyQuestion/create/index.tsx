import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Button } from 'rsuite';
import { frequentlyQuestionFormSchema, frequentlyQuestionYupSchema } from './config';
import { DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import {
  FrequentlyQuestionType,
  defaultFrequentlyQuesttion,
  toPendingFrequentlyQuestion,
} from '~app/features/chat-configs/FrequentlyQuestion/utils';
import { useUpdateFrequentlyQuestionMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import { FREQUENTLY_QUESTION_KEY } from '~app/services/queries';
import { ProductService } from '~app/services/api';

type Props = { pageId: string; suggestMessageEnable: boolean; questions: FrequentlyQuestion[]; onClose: () => void };

const FrequentlyQuestionCreate = ({ pageId, suggestMessageEnable, questions, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('chat');
  const { mutateAsync } = useUpdateFrequentlyQuestionMutation();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<ReturnType<typeof defaultFrequentlyQuesttion>>({
    resolver: yupResolver(frequentlyQuestionYupSchema()),
    defaultValues: defaultFrequentlyQuesttion(),
  });
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: ReturnType<typeof defaultFrequentlyQuesttion>) => {
    try {
      setIsLoading(true);
      const nextData = { ...data };
      if (data.answer_type === FrequentlyQuestionType.Web) {
        Object.assign(nextData, { answer_type: FrequentlyQuestionType.Text });
      }
      if (data.answer_type === FrequentlyQuestionType.Image) {
        const uploadedImages = await Promise.all(
          nextData.images.map(async (image: PendingUploadImage) => {
            try {
              return await ProductService.uploadProductImage(image);
            } catch (error: ExpectedAny) {
              toast.error(error.message);
              return image;
            }
          }),
        );
        nextData.answer = uploadedImages.join(',');
      }
      const body = questions.map((question) => toPendingFrequentlyQuestion(question));
      await mutateAsync({
        business_has_page_id: pageId,
        data: [...body, nextData],
        suggest_message_enable: suggestMessageEnable,
      });
      toast.success(t('success.create_question'));
      setIsLoading(false);
      queryClient.invalidateQueries([FREQUENTLY_QUESTION_KEY], { exact: false });
      onClose();
    } catch (_) {
      // TO DO
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (watch('answer') && errors.answer?.message) {
      clearErrors('answer');
    }
  }, [watch('answer')]);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t('modal.create_sample_question')} onClose={onClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white">
          <FormLayout
            formSchema={frequentlyQuestionFormSchema({
              type: watch('answer_type'),
              answer: watch('answer_type') === FrequentlyQuestionType.Image ? watch('images') : watch('answer'),
              answerError: errors.answer?.message || '',
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
      {isLoading ? <Loading backdrop={true} vertical={true} className="pw-z-2000" /> : null}
    </div>
  );
};

export default FrequentlyQuestionCreate;
