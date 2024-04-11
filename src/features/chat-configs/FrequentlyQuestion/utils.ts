export enum FrequentlyQuestionType {
  Text = 'text',
  Image = 'image',
  Product = 'product',
  Web = 'web',
}

export enum FrequentlyQuestionDefault {
  COMMON_PRODUCT = 'common_product',
  NEWEST_PRODUCT = 'newest_product',
}

export const isDefaultQuestion = (detail: FrequentlyQuestion | null) => {
  if (!detail || detail?.answer_type !== FrequentlyQuestionType.Product) return false;
  return (
    detail.answer === FrequentlyQuestionDefault.NEWEST_PRODUCT ||
    detail.answer === FrequentlyQuestionDefault.COMMON_PRODUCT
  );
};

export const isGetProductsByIds = (detail: FrequentlyQuestion | null) => {
  if (!detail || detail?.answer_type !== FrequentlyQuestionType.Product) return false;
  return detail?.answer && detail?.answer.split(',').every((answer) => answer.length === 36);
};

export const defaultFrequentlyQuesttion = () => ({
  id: '',
  answer: '',
  answer_type: FrequentlyQuestionType.Text as string,
  message: '',
  message_type: FrequentlyQuestionType.Text as string,
  images: [] as ExpectedAny,
});

export const toDefaultFrequentlyQuestion = (detail: FrequentlyQuestion) => ({
  id: detail.id,
  answer: detail.answer,
  answer_type: detail.answer_type,
  message: detail.message,
  message_type: detail.message_type,
  images: detail.answer_type === FrequentlyQuestionType.Image ? detail.answer.split(',') : [],
});

export const toPendingFrequentlyQuestion = (detail: FrequentlyQuestion) => ({
  id: detail.id,
  answer: detail.answer,
  answer_type: detail.answer_type,
  message: detail.message,
  message_type: detail.message_type,
});
