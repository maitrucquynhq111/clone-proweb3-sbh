import { API_URI } from '~app/configs';
import { put, post, fetchData } from '~app/utils/helpers';
import AuthService from './auth';

async function getInvoiceSetting({ phone_number }: { phone_number: string }) {
  return await post<ExpectedAny>(
    `${API_URI}/finan-business/api/v1/invoice/get-one-or-create`,
    {
      phone_number,
    },
    { authorization: true },
  );
}

async function getPosSetting() {
  return await fetchData<ExpectedAny>(`${API_URI}/finan-metadata/api/v1/pos-setting/get-one`, { authorization: true });
}

async function getSetting() {
  const business_id = await AuthService.getBusinessId();
  return await post<SettingDisplay>(
    `${API_URI}/finan-metadata/api/v1/per-setting/buyer/get-one-or-create`,
    {
      setting_key: 'apply_common',
      sort: 'priority asc',
      object_type: 'business',
      object_id: business_id,
      type: 'buyer_view',
      json_value: [
        {
          key: 'ui_buyer',
          active: 'default',
        },
      ],
    },
    { authorization: true },
  );
}

export async function updateSetting({ id, data }: { id: string; data: SettingDisplay }) {
  return await put(`${API_URI}/finan-metadata/api/v1/per-setting/update/${id}`, data, { authorization: true });
}

async function getBackupData() {
  return await fetchData<BackupData>(`${API_URI}/finan-report/api/v1/get-detail-backup-info`, { authorization: true });
}

async function updateBackupData(data: BackupDataForm) {
  const business_id = await AuthService.getBusinessId();
  return await post<SettingDisplay>(
    `${API_URI}/finan-report/api/v1/create-or-update-backup-info`,
    { ...data, business_id },
    { authorization: true },
  );
}

async function getCustomerPointRatio(id: string) {
  return await fetchData<BackupData>(`${API_URI}/finan-business/api/v2/business/get-one/${id}`, {
    authorization: true,
  });
}

export async function updateBusiness(data: ExpectedAny) {
  const business_id = await AuthService.getBusinessId();
  return await put(`${API_URI}/finan-business/api/v1/business/update/${business_id}`, data, { authorization: true });
}

const SettingService = {
  getSetting,
  updateSetting,
  getBackupData,
  updateBackupData,
  getCustomerPointRatio,
  updateBusiness,
  getInvoiceSetting,
  getPosSetting,
};

export default SettingService;
