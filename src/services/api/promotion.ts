import qs from 'qs';
import AuthService from './auth';
import { API_URI } from '~app/configs';
import { fetchAll, post } from '~app/utils/helpers';

type GetPromotionsProps = { page: number; page_size: number; type?: string; name?: string; sort?: string };

async function getPromotions({ page = 1, page_size = 75, name = '', sort = '' }: GetPromotionsProps) {
  const business_id = await AuthService.getBusinessId();
  return fetchAll<{ data: Promotion[]; meta: ResponseMeta }>(
    `${API_URI}/finan-promotion/api/v1/promotions/get-list?${qs.stringify({
      business_id,
      page,
      page_size,
      sort,
      name,
    })}`,
    {
      authorization: true,
    },
  );
}

async function processPromotion(data: ParamsProcessPromotion) {
  const business_id = await AuthService.getBusinessId();

  return await post<ProcessPromotion>(
    `${API_URI}/finan-promotion/api/v1/promotions/process`,
    {
      ...data,
      business_id,
    },
    {
      authorization: true,
    },
  );
}

const promotionService = { getPromotions, processPromotion };

export default promotionService;
