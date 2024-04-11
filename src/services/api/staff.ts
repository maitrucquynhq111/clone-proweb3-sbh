import qs from 'querystring';
import AuthService from './auth';
import { API_URI, DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '~app/configs';
import { fetchAll, put } from '~app/utils/helpers';

async function confirmInvite(body: ConfirmInviteBody) {
  return await put<ExpectedAny>(`${API_URI}/finan-business/api/v1/staff/confirm-invite`, body, {
    authorization: true,
  });
}

async function getStaffs({ page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE, search = '', sort = '' }: CommonParams) {
  const business_id = await AuthService.getBusinessId();
  return fetchAll<{ data: StaffInfo[]; meta: ResponseMeta }>(
    `${API_URI}/finan-business/api/v2/staff/get-list?${qs.stringify({
      business_id,
      page: page,
      page_size: pageSize,
      search,
      sort,
    })}`,
    {
      authorization: true,
    },
  );
}

const StaffService = {
  confirmInvite,
  getStaffs,
};

export default StaffService;
