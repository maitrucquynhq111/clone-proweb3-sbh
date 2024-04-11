import qs from 'querystring';
import { API_URI, DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '~app/configs';
import { fetchData } from '~app/utils/helpers';

async function getCommissions({
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  filter_key,
  search,
  start_time,
  end_time,
  sender_phone,
  sort,
}: GetAffiliateListParams) {
  const { data, meta } = await fetchData<{
    data: Array<Commission>;
    meta: ResponseMeta & {
      total_upgrade: number;
      total_commission: number;
    };
  }>(
    `${API_URI}/finan-loyalty/api/v1/affiliate/proweb/get-list?${qs.stringify({
      start_time,
      end_time,
      page: page,
      page_size: pageSize,
      filter_key,
      sender_phone,
      search,
      sort,
    })}`,
    { authorization: true },
  );
  return { data, meta };
}

async function getTrainerInfo() {
  const response = await fetchData<{
    trainer_info: TrainerInfo;
  }>(`${API_URI}/finan-loyalty/api/v1/campaign/get-info?campaign_key=affiliate_campaign`, { authorization: true });
  return response?.trainer_info;
}

const AffiliateService = {
  getCommissions,
  getTrainerInfo,
};

export default AffiliateService;
