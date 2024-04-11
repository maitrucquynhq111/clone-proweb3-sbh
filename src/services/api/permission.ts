import AuthService from './auth';
import { API_URI } from '~app/configs';
import { fetchData } from '~app/utils/helpers';

async function getCurrentPermissions({ userId }: { userId: string }) {
  const business_id = await AuthService.getBusinessId();

  return fetchData<ExpectedAny>(`${API_URI}/finan-business/api/v1/permission-v2/get-current-permission`, {
    authorization: true,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
      'x-business-id': business_id,
    } as ExpectedAny,
  });
}

async function getSubscriptionPlan() {
  return await fetchData<SubscriptionPlan>(
    `${API_URI}/finan-subscription-plan/api/v3/sub-package/get-list?type=primary`,
    { authorization: true },
  );
}

const PermissionService = { getCurrentPermissions, getSubscriptionPlan };

export default PermissionService;
