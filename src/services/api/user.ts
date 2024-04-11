import { API_URI, PERMISSIONS } from '~app/configs';
import { fetchData } from '~app/utils/helpers';

const getUserProfile = async () => {
  return {
    ...(await fetchData<AuthInfo>(`${API_URI}/ms-user-management/api/auth/v2`, {
      authorization: true,
    })),
    permissions: [PERMISSIONS.DEFAULT],
  };
};

const UserService = { getUserProfile };

export default UserService;
