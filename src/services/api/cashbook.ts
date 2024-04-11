import qs from 'querystring';
import AuthService from './auth';
import { API_URI, DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '~app/configs';
import { fetchAll, post, put, deleteMethod, fetchData } from '~app/utils/helpers';

async function getCashbooks({
  start_time,
  end_time,
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  sort = 'day desc',
  search,
  transaction_type,
  status,
}: CashbooksParams) {
  const business_id = await AuthService.getBusinessId();
  const { data, meta } = await fetchAll<{
    data: Array<Cashbook>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-transaction/api/v1/business-transaction/get-detail?${qs.stringify({
      business_id,
      start_time,
      end_time,
      transaction_type,
      page: page,
      page_size: pageSize,
      sort,
      search,
      status,
    })}`,
    { authorization: true },
  );

  return { data, meta };
}
// thu chi
async function getCashbookTotalAmount({ start_time, end_time }: { start_time?: string; end_time?: string }) {
  const business_id = await AuthService.getBusinessId();
  const { data } = await fetchAll<{
    data: CashbookTotalAmount;
  }>(
    `${API_URI}/finan-transaction/api/v1/business-transaction/get-amount-total?${qs.stringify({
      business_id,
      start_time,
      end_time,
    })}`,
    { authorization: true },
  );

  return data;
}
// so no
async function getTransactionTotalAmount({ start_time, end_time }: { start_time?: string; end_time?: string }) {
  const business_id = await AuthService.getBusinessId();
  const { data } = await fetchAll<{
    data: CashbookTotalAmount;
  }>(
    `${API_URI}/finan-transaction/api/v1/contact-transaction/get-amount-total?${qs.stringify({
      business_id,
      start_time,
      end_time,
    })}`,
    { authorization: true },
  );

  return data;
}

async function getCashbook(id: string) {
  const cashbook = await fetchData<Cashbook>(`${API_URI}/finan-transaction/api/v1/business-transaction/get-one/${id}`, {
    authorization: true,
  });
  return cashbook;
}

async function createCashbook(cashbook: PendingCashbook) {
  const business_id = await AuthService.getBusinessId();
  return await post<JSONRecord<Cashbook>>(
    `${API_URI}/finan-transaction/api/v1/business-transaction/create`,
    { ...cashbook, business_id },
    { authorization: true },
  );
}

async function updateCashbook(id: string, cashbook: PendingCashbook) {
  return await put<JSONRecord<Cashbook>>(
    `${API_URI}/finan-transaction/api/v1/business-transaction/update/${id}`,
    { ...cashbook },
    { authorization: true },
  );
}

async function deleteCashbook(id: string) {
  return await deleteMethod(
    `${API_URI}/finan-transaction/api/v1/business-transaction/delete/${id}`,
    {},
    { authorization: true },
  );
}

async function deleteMultiCashbook({ data, bussiness_id }: { data: Array<string>; bussiness_id: string }) {
  return await deleteMethod(
    `${API_URI}/finan-transaction/api/v1/business-transaction/delete-multi`,
    {
      bussiness_id,
      data,
    },
    {
      method: 'DELETE',
      authorization: true,
    },
  );
}

async function deleteMultiTransaction({ ids }: { ids: Array<string> }) {
  return await deleteMethod(
    `${API_URI}/finan-transaction/api/v2/business-transaction/batch-delete`,
    {
      ids,
    },
    {
      method: 'DELETE',
      authorization: true,
    },
  );
}

type GetCashbookCategoriesProps = {
  type?: string;
  page: number;
  page_size: number;
  sort?: string;
};

async function getCashbookCategories({ type, page, page_size, sort }: GetCashbookCategoriesProps) {
  const business_id = await AuthService.getBusinessId();
  const data = await fetchAll<{
    data: CashbookCategory[];
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-transaction/api/v2/category-transaction/get-list?${qs.stringify({
      business_id,
      page,
      page_size,
      type,
      sort: sort || 'priority asc',
    })}`,
    { authorization: true },
  );
  return data;
}

async function createCashbookCategory(data: PendingCashbookCategory) {
  const business_id = await AuthService.getBusinessId();
  return await post<CashbookCategory>(
    `${API_URI}/finan-transaction/api/v1/category-transaction/create`,
    { ...data, business_id },
    { authorization: true },
  );
}

async function setReminder({
  contact_ids,
  reminder_day,
  action = 'update',
}: {
  contact_ids: string[];
  reminder_day: string;
  action: string;
}) {
  const business_id = await AuthService.getBusinessId();
  return await post<JSONRecord<Cashbook>>(
    `${API_URI}/ms-business-management/api/business-has-contact/v2/set-reminder-multi-contact`,
    { reminder_day, contact_ids, business_id, action },
    { authorization: true },
  );
}

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
    `${API_URI}/finan-report/api/v1/export-business-transaction`,
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

async function exportPDFTransactions({ contact_id }: { contact_id: string }) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<ExpectedAny>(
    `${API_URI}/finan-transaction/api/v1/generate/generate-pdf`,
    {
      business_id,
      contact_id,
      pdf_type: 'one_contact_transaction',
    },
    { authorization: true },
  );
}

async function getTransactions({ start_time, end_time, search, page, pageSize }: CashbooksParams) {
  const { data, meta } = await fetchAll<{
    data: Array<Cashbook>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-transaction/api/v1/aggregation/recent-transaction?${qs.stringify({
      start_time,
      end_time,
      search,
      page,
      page_size: pageSize,
    })}`,
    { authorization: true },
  );

  return { data, meta };
}

const CashbookService = {
  getCashbooks,
  getCashbookTotalAmount,
  getTransactionTotalAmount,
  getCashbook,
  createCashbook,
  updateCashbook,
  deleteCashbook,
  deleteMultiCashbook,
  getCashbookCategories,
  createCashbookCategory,
  deleteMultiTransaction,
  setReminder,
  exportData,
  exportPDFTransactions,
  getTransactions,
};
export default CashbookService;
