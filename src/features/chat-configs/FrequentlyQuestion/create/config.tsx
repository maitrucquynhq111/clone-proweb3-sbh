import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';
import { ProductSelect, QuestionType, WebAnswer } from '~app/features/chat-configs/FrequentlyQuestion/components';
import { FrequentlyQuestionType } from '~app/features/chat-configs/FrequentlyQuestion/utils';
import { Dropzone } from '~app/components';

export const frequentlyQuestionYupSchema = () => {
  const { t } = useTranslation('common');
  return yup.object().shape({
    message: yup.string().required(t('required_info') || ''),
    message_type: yup.string(),
    answer: yup.string().required(t('required_info') || ''),
    answer_type: yup.string(),
    images: yup.array(),
  });
};

type Props = {
  type: string;
  answer: ExpectedAny;
  detail?: FrequentlyQuestion;
  answerError: string;
  products?: Product[];
  setValue(type: string, value: ExpectedAny): void;
};

const renderContentByType = ({ type, answer, answerError, products, setValue }: Props) => {
  const { t } = useTranslation('chat');
  switch (type) {
    case FrequentlyQuestionType.Image: {
      const content = [
        {
          type: ComponentType.Label,
          key: 'label_images',
          name: 'answer',
          isRequired: true,
          isError: !!answerError,
          label: `${t('image')} (${Array.isArray(answer) ? answer.length : 0}/2)`,
        },
        {
          type: ComponentType.Custom,
          name: 'answer',
          fileList: answer || [],
          maxFiles: 2,
          errorForm: answerError,
          errorMessage: t('error.max_image_length_question'),
          component: Dropzone,
          onChange: (files: ExpectedAny) => {
            setValue('images', files);
            setValue('answer', files.length === 0 ? '' : 'images');
          },
        },
      ];
      return [...content];
    }
    case FrequentlyQuestionType.Product:
      return [
        {
          type: ComponentType.Custom,
          name: 'answer',
          className: 'pw-col-span-12',
          errorMessage: t('error.max_image_length_question'),
          error: answerError,
          answer,
          products,
          component: ProductSelect,
          onChange: (value: ExpectedAny) => {
            setValue('answer', value);
          },
        },
      ];
    case FrequentlyQuestionType.Web:
      return [
        {
          type: ComponentType.Custom,
          className: 'pw-col-span-12',
          answer,
          error: answerError,
          component: WebAnswer,
          onChange: (value: ExpectedAny) => {
            setValue('answer', value);
          },
        },
      ];
    default:
      return [
        {
          type: ComponentType.Text,
          as: 'textarea',
          rows: 3,
          className: 'pw-col-span-12',
          label: t('text'),
          name: 'answer',
          isRequired: true,
          placeholder: t('placeholder.text'),
        },
      ];
  }
};

export const frequentlyQuestionFormSchema = ({ type, answer, detail, answerError, products, setValue }: Props) => {
  const { t } = useTranslation('chat');
  return {
    className: 'pw-grid pw-grid-cols-12 pw-gap-x-6',
    type: 'container',
    name: 'form',
    children: [
      {
        className: 'pw-col-span-12',
        name: 'first-col',
        type: 'block-container',
        children: [
          {
            blockClassName: 'pw-col-span-12',
            className: `pw-grid pw-grid-cols-12 pw-gap-4 pw-relative`,
            type: 'block',
            name: 'first-block',
            children: [
              {
                type: ComponentType.Text,
                as: 'textarea',
                rows: 3,
                className: 'pw-col-span-12',
                label: t('question'),
                name: 'message',
                isRequired: true,
                placeholder: t('placeholder.question'),
              },
            ],
          },
          {
            blockClassName: 'pw-col-span-12 pw-mt-4',
            type: 'block',
            name: 'second-block',
            children: [
              {
                type: ComponentType.Custom,
                name: 'type',
                label: t('answer_after_press_button'),
                questionType: type,
                onChange: (value: FrequentlyQuestionType) => {
                  setValue('answer_type', value);
                  setValue('answer', detail?.answer_type === value ? detail.answer : '');
                  setValue('images', []);
                },
                component: QuestionType,
              },
            ],
          },
          {
            blockClassName: 'pw-col-span-12',
            className: `pw-gap-4 pw-relative`,
            type: 'block',
            name: 'third-block',
            children: renderContentByType({ type, answer, products, answerError, setValue }),
          },
        ],
      },
    ],
  };
};
