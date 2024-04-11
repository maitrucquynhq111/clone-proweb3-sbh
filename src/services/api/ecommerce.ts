import qs from 'querystring';
import AuthService from './auth';
import { API_URI } from '~app/configs';
import { fetchAll, fetchData } from '~app/utils/helpers';

const getAuthLink = async (platform_key: string) => {
  return await fetchData<{ auth_link: string }>(
    `${API_URI}/ms-e-com-adapter/api/synchronize/get-auth-link?platform_key=${platform_key}`,
    {
      authorization: true,
    },
  );
};

const getShopeeAccessToken = async (code: string, shop_id: string) => {
  const business_id = await AuthService.getBusinessId();
  return await fetchData<ExpectedAny>(
    `${API_URI}/ms-e-com-adapter/api/shopee/get-access-token?${qs.stringify({
      business_id,
      code,
      shop_id,
    })}`,
    {
      authorization: true,
    },
  );
};

const getLazadaAccessToken = async (code: string) => {
  const business_id = await AuthService.getBusinessId();
  return await fetchData<ExpectedAny>(
    `${API_URI}/ms-e-com-adapter/api/lazada/get-access-token?${qs.stringify({
      business_id,
      code,
    })}`,
    {
      authorization: true,
    },
  );
};

const getTiktokAccessToken = async (code: string, state: string) => {
  const business_id = await AuthService.getBusinessId();
  return await fetchData<ExpectedAny>(
    `${API_URI}/ms-e-com-adapter/api/lazada/get-access-token?${qs.stringify({
      business_id,
      code,
      state,
    })}`,
    {
      authorization: true,
    },
  );
};

async function getEcomShops({ page, pageSize, platform_key }: CommonParams & { platform_key?: string }) {
  const business_id = await AuthService.getBusinessId();
  return await fetchAll<{
    data: Array<EcomShop>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/ms-e-com-adapter/api/v1/business-ecom-shop/get-list?${qs.stringify({
      page: page,
      page_size: pageSize,
      business_id,
      platform_key,
    })}`,
    {
      authorization: true,
    },
  );
}

const EcommerceService = {
  getAuthLink,
  getShopeeAccessToken,
  getLazadaAccessToken,
  getTiktokAccessToken,
  getEcomShops,
};

export default EcommerceService;
