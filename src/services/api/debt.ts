import AuthService from './auth';
import { API_URI } from '~app/configs';
import { post } from '~app/utils/helpers';

async function exportData({
  email,
  start_time,
  end_time,
  transaction_type,
  search,
}: {
  email?: string;
  start_time?: string;
  end_time?: string;
  transaction_type?: string;
  search?: string;
}) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<string>(
    `${API_URI}/finan-report/api/v1/export-contact-transaction`,
    {
      business_id,
      email,
      start_time,
      end_time,
      transaction_type,
      search,
    },
    { authorization: true },
  );
}

const DebtService = {
  exportData,
};
export default DebtService;
