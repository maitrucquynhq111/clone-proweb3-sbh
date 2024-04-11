import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Button } from 'rsuite';
import {
  frequentlyQuestionFormSchema,
  frequentlyQuestionYupSchema,
} from '~app/features/chat-configs/FrequentlyQuestion/create/config';
import { DrawerBody, DrawerFooter, DrawerHeader, Loading } from '~app/components';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import {
  FrequentlyQuestionType,
  defaultFrequentlyQuesttion,
  toDefaultFrequentlyQuestion,
  toPendingFrequentlyQuestion,
} from '~app/features/chat-configs/FrequentlyQuestion/utils';
import { useUpdateFrequentlyQuestionMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import { FREQUENTLY_QUESTION_KEY } from '~app/services/queries';
import { useGetProducts } from '~app/features/chat-configs/FrequentlyQuestion/hooks';
import { isLocalImage } from '~app/utils/helpers';
import { ProductService } from '~app/services/api';

type Props = {
  pageId: string;
  suggestMessageEnable: boolean;
  detail: FrequentlyQuestion;
  questions: FrequentlyQuestion[];
  onClose: () => void;
};

const FrequentlyQuestionDetails = ({
  pageId,
  suggestMessageEnable,
  detail,
  questions,
  onClose,
}: Props): JSX.Element => {
  const { t } = useTranslation('chat');
  const { mutateAsync } = useUpdateFrequentlyQuestionMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { products } = useGetProducts({ detail });

  const methods = useForm<ReturnType<typeof defaultFrequentlyQuesttion>>({
    resolver: yupResolver(frequentlyQuestionYupSchema()),
    defaultValues: defaultFrequentlyQuesttion(),
  });

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
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
          data.images.map(async (image: string | PendingUploadImage) => {
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
        nextData.answer = uploadedImages.join(',');
      }
      const body = questions.map((question) => {
        if (question.id === nextData.id) {
          const { images, ...others } = nextData;
          return others;
        }
        return toPendingFrequentlyQuestion(question);
      });
      await mutateAsync({ business_has_page_id: pageId, data: body, suggest_message_enable: suggestMessageEnable });
      toast.success(t('success.update_question'));
      setIsLoading(false);
      queryClient.invalidateQueries([FREQUENTLY_QUESTION_KEY], { exact: false });
      onClose();
    } catch (_) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (watch('answer') && errors.answer?.message) {
      clearErrors('answer');
    }
  }, [watch('answer')]);

  useEffect(() => {
    if (detail) {
      reset(toDefaultFrequentlyQuestion(detail));
    }
  }, [detail]);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t('modal.update_sample_question')} onClose={onClose} />
      <FormProvider
        className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden"
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DrawerBody className="pw-bg-white">
          <FormLayout
            formSchema={frequentlyQuestionFormSchema({
              type: watch('answer_type'),
              detail,
              answer: watch('answer_type') === FrequentlyQuestionType.Image ? watch('images') : watch('answer'),
              answerError: errors.answer?.message || '',
              products,
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

export default FrequentlyQuestionDetails;
