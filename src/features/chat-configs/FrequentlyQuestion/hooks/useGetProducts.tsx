import { useProductsByIds, useProductsQuery } from '~app/services/queries';
import {
  FrequentlyQuestionDefault,
  isDefaultQuestion,
  isGetProductsByIds,
} from '~app/features/chat-configs/FrequentlyQuestion/utils';

type Props = {
  detail: FrequentlyQuestion | null;
};

const useGetProducts = ({ detail }: Props) => {
  const getSortParams = () => {
    if (detail?.answer === FrequentlyQuestionDefault.NEWEST_PRODUCT) return { id: 'created_at', direction: 'desc' };
    if (detail?.answer === FrequentlyQuestionDefault.COMMON_PRODUCT)
      return { id: 'can_pick_quantity', direction: 'desc' };
  };

  const { data: products } = useProductsByIds({
    page: 1,
    pageSize: 5,
    ids: (isGetProductsByIds(detail) && detail?.answer.split(',')) || [],
  });

  const { data: productsDefault } = useProductsQuery({
    page: 1,
    pageSize: 5,
    orderBy: getSortParams(),
    enabled: isDefaultQuestion(detail),
  });

  return { products: isDefaultQuestion(detail) ? productsDefault?.data || [] : products?.data || [] };
};

export default useGetProducts;
