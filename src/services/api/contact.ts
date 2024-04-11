import qs from 'qs';
import AuthService from './auth';
import MediaService from './media';
import { fetchAll, fetchData, post, put, deleteMethod, fetchStreamData } from '~app/utils/helpers';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, API_URI } from '~app/configs';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getNewContacts({
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  sort = '',
  search = '',
  option = '',
  options = [],
  contact_group_ids = [],
  tag_ids = [],
  has_analytic = false,
  option_analytic,
}: {
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
  option?: string;
  options?: string[];
  contact_group_ids?: string[];
  tag_ids?: string[];
  has_analytic?: boolean;
  option_analytic?: string;
}) {
  const business_id = await AuthService.getBusinessId();
  return fetchAll<{ data: Contact[]; meta: ResponseMeta }>(
    `${API_URI}/finan-business/api/v1/contact/get-list?${qs.stringify({
      business_id,
      page: page,
      page_size: pageSize,
      sort: sort,
      search: search,
      state: 'complete',
      option,
      options: options.join(','),
      contact_group_ids: contact_group_ids.join(','),
      tag_ids: tag_ids.join(','),
      has_analytic,
      option_analytic,
    })}`,
    {
      authorization: true,
    },
  );
}

async function createContact(contact: PendingContact) {
  return await post<Contact>(
    `${API_URI}/finan-business/api/v2/contact/create`,
    { ...contact },
    { authorization: true },
  );
}

async function getContact(id: string, field?: string) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await fetchData<Contact>(
    `${API_URI}/finan-business/api/v2/contact/get-detail/${id}?${qs.stringify({
      business_id,
      field,
    })}`,
    { authorization: true },
  );
}

async function getContactPointUsed(id: string) {
  return await fetchData<number>(`${API_URI}/finan-order/api/v1/get-used-point/${id}`, {
    authorization: true,
  });
}

async function deleteContact(id: string) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post(
    `${API_URI}/finan-business/api/v1/contact/update-is-customer-active`,
    { business_id, contact_id: id },
    { authorization: true },
  );
}

async function exportContact(contact_group_ids?: string) {
  const business_id = (await AuthService.getBusinessId()) || '';
  const res = await fetchStreamData(
    `${API_URI}/finan-business/api/v1/contact/export?${qs.stringify({
      business_id,
      contact_group_ids,
    })}`,
    { authorization: true },
  );
  return res.arrayBuffer();
}

async function deleteMultiContactTransaction({ ids }: { ids: Array<string> }) {
  return await deleteMethod(
    `${API_URI}/finan-transaction/api/v1/contact-transaction/batch-delete`,
    {
      ids,
    },
    {
      method: 'DELETE',
      authorization: true,
    },
  );
}

async function getContactGroups({ page, pageSize, search }: CommonParams & { search: string }) {
  const business_id = (await AuthService.getBusinessId()) || '';
  const { data } = await fetchAll<{
    data: {
      data: Array<ContactGroup>;
      meta: ResponseMeta;
    };
  }>(
    `${API_URI}/finan-business/api/v1/business/${business_id}/get-list-group-info?${qs.stringify({
      page: page,
      page_size: pageSize,
      search,
      sort: 'updated_at desc',
    })}`,
    {
      authorization: true,
    },
  );
  return { data: data.data, meta: data.meta };
}

async function getContactGroupDetail(id: string) {
  return await fetchData<ContactGroup>(`${API_URI}/finan-business/api/v1/business/group-of-contact/${id}`, {
    authorization: true,
  });
}

async function createContactGroup(contact: PendingContactGroup) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<ContactGroup>(
    `${API_URI}/finan-business/api/v1/business/group-of-contact/create`,
    { ...contact, business_id },
    { authorization: true },
  );
}

async function updateContactGroup({ contact, id }: { contact: PendingContactGroup; id: string }) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await put<ContactGroup>(
    `${API_URI}/finan-business/api/v1/business/group-of-contact/update/${id}`,
    { ...contact, business_id },
    { authorization: true },
  );
}

async function deleteContactGroup(id: string) {
  return await fetchData(`${API_URI}/finan-business/api/v1/business/group-of-contact/delete/${id}`, {
    method: 'DELETE',
    authorization: true,
  });
}

async function generateContactGroupCode(group_name: string) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await fetchData<string>(
    `${API_URI}/finan-business/api/v1/business/generate-group-code?${qs.stringify({
      business_id,
      group_name,
    })}`,
    { authorization: true },
  );
}

// CONTACT LABEL
async function getContactLabels({ page, pageSize, name }: CommonParams) {
  return await fetchAll<{
    data: Array<ContactLabel>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-business/api/v1/contact-tag/get-list?${qs.stringify({
      page: page,
      page_size: pageSize,
      name,
      sort: 'updated_at desc',
    })}`,
    {
      authorization: true,
    },
  );
}

async function createContactLabel(body: PendingContactLabel) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<ContactLabel>(
    `${API_URI}/finan-business/api/v1/contact-tag/create`,
    { ...body, business_id },
    { authorization: true },
  );
}

async function updateContactLabel(body: PendingContactLabel) {
  return await put<ContactLabel>(
    `${API_URI}/finan-business/api/v1/contact-tag/update/${body.id}`,
    { name: body.name },
    {
      authorization: true,
    },
  );
}

async function deleteContactLabel(id: string) {
  return await fetchData(`${API_URI}/finan-business/api/v1/contact-tag/delete/${id}`, {
    method: 'DELETE',
    authorization: true,
  });
}

async function getNotes({ contact_id, page, page_size }: ParamsFetchContact) {
  return await fetchAll<{ data: Note[]; meta: ResponseMeta }>(
    `${API_URI}/finan-business/api/v1/contact-note/get-list?${qs.stringify({
      contact_id,
      page: page,
      page_size,
      sort: 'updated_at desc',
    })}`,
    { authorization: true },
  );
}

async function getOneNote({ id }: { id: string }) {
  const res = await fetchData<JSONRecord<Note[]>>(`${API_URI}/finan-business/api/v1/contact-note/get-one/?${id}`, {
    authorization: true,
  });
  return res;
}

async function createNote({ body }: { body: PendingNote }) {
  return await post(
    `${API_URI}/finan-business/api/v1/contact-note/create`,
    { ...body },
    {
      authorization: true,
    },
  );
}

async function updateNote({ id, body }: { id: string; body: PendingNote }) {
  const res = await put(`${API_URI}/finan-business/api/v1/contact-note/update/${id}`, body, {
    authorization: true,
  });
  return res;
}

async function deleteNote(id: string) {
  return await fetchData(`${API_URI}/finan-business/api/v1/contact-note/delete/${id}`, {
    method: 'DELETE',
    authorization: true,
  });
}

async function createContactTransaction(body: PendingContactTransaction) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<ContactTransaction>(
    `${API_URI}/finan-transaction/api/v1/contact-transaction/create`,
    { ...body, business_id },
    {
      authorization: true,
    },
  );
}

async function updateContactTransaction(id: string, body: PendingContactTransaction) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await put<ContactTransaction>(
    `${API_URI}/finan-transaction/api/v1/contact-transaction/update/${id}`,
    { ...body, business_id },
    {
      authorization: true,
    },
  );
}

async function getContactTransactions({
  contact_id,
  page,
  page_size,
}: {
  contact_id: string;
  page: number;
  page_size: number;
}) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await fetchAll<{ data: ContactTransaction[]; meta: ResponseMeta }>(
    `${API_URI}/finan-transaction/api/v2/contact-transaction/get-list?${qs.stringify({
      business_id,
      contact_id,
      page,
      page_size,
      sort: 'start_time desc',
    })}`,
    { authorization: true },
  );
}

async function updateContact({ id, contact }: { id: string; contact: PendingContact }) {
  const business_id = (await AuthService.getBusinessId()) || '';
  const res = await put<Contact>(
    `${API_URI}/finan-business/api/v1/contact/update/${id}`,
    { ...contact, business_id },
    {
      authorization: true,
    },
  );
  return res;
}

async function updateCustomerPoint({ customer_point, id }: PedingCustomerPoint) {
  return await put<Contact>(
    `${API_URI}/finan-business/api/v1/contact/update-customer-point/${id}`,
    { customer_point },
    { authorization: true },
  );
}

async function transactionContact({ body }: { body: PendingTransaction }) {
  return await post(
    `${API_URI}/finan-transaction/api/v1/contact-transaction/create`,
    { ...body },
    {
      authorization: true,
    },
  );
}

async function getDebtDetail(id: string) {
  const cashbook = await fetchData<ContactTransaction>(
    `${API_URI}/finan-transaction/api/v1/contact-transaction/get-one/${id}`,
    {
      authorization: true,
    },
  );
  return cashbook;
}

async function getTransactionContacts({
  transaction_type,
  page_size = 10,
  filter = 'today',
}: {
  transaction_type: string;
  page_size?: number;
  filter?: string;
}) {
  const business_id = await AuthService.getBusinessId();
  const { data, meta } = await fetchAll<{
    data: Array<DebtReminderContact>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-business/api/v1/business-has-contact/get-list-reminder?${qs.stringify({
      business_id,
      page: 1,
      page_size,
      transaction_type,
      filter,
    })}`,
    { authorization: true },
  );

  return { data, meta };
}

async function getCustomerPointHistory({ contact_id, page, page_size }: ParamsFetchContact) {
  const { data, meta } = await fetchAll<{
    data: Array<CustomerPointHistory>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-business/api/v1/customer-point/get-list?${qs.stringify({
      contact_id,
      page,
      page_size,
      type: 'all',
      sort: 'created_at desc',
    })}`,
    { authorization: true },
  );
  return { data, meta };
}

async function getActivitiesHistory({ page, pageSize, contact_id }: CommonParams & { contact_id: string }) {
  return await fetchAll<{
    data: Array<ActivityHistory>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-business/api/v1/activity-history/get-list?${qs.stringify({
      page: page,
      page_size: pageSize,
      contact_id,
    })}`,
    {
      authorization: true,
    },
  );
}

async function exportData({ search }: { search?: string }) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<string>(
    `${API_URI}/finan-report/api/v1/export-business-transaction`,
    {
      business_id,
      search: search,
    },
    { authorization: true },
  );
}

// search location tree
async function getLocationTreeBySearch({ name, page, pageSize }: CommonParams) {
  const { data, meta } = await fetchAll<{
    data: Array<AddressLocation>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-location-tree/api/v2/location/search?${qs.stringify({
      name,
      page,
      page_size: pageSize,
    })}`,
    { authorization: true },
  );
  return { data, meta };
}

async function geContactMassUploads({ page, pageSize }: CommonParams) {
  return fetchData<Array<MassUpload>>(
    `${API_URI}/finan-mass-upload/api/v1/mass-upload-data/get-list?${qs.stringify({
      page,
      page_size: pageSize,
      sort: 'created_at desc',
      data_type: 'contact',
      file_type: 'EXCEL',
    })}`,
    {
      authorization: true,
    },
  );
}

async function getContactMassUploadsFailed({ page, pageSize, id }: CommonParams & { id: string }) {
  return fetchAll<{ data: MassUploadFailed[]; meta: ResponseMeta }>(
    `${API_URI}/finan-mass-upload/api/v1/detail-fail-data/get-list?${qs.stringify({
      page: page,
      page_size: pageSize,
      mass_upload_id: id,
      sort: 'row asc',
    })}`,
    {
      authorization: true,
    },
  );
}

async function commitMassUpload(body: CommitMassUploadContactBody) {
  return await post<{ data: string }>(`${API_URI}/finan-business/api/v2/contact/import`, body, {
    authorization: true,
  });
}

async function uploadContactFile(file: { name: string; mime_type: string; content: ArrayBuffer }) {
  const { file_name, file_name_origin, link } = await MediaService.createMassUploadLink({
    media_type: 'excel',
    name: file.name,
  });
  await MediaService.upload(link, {
    mime_type: file.mime_type,
    content: file.content,
  });

  const { upload_url } = await MediaService.commitUploadLink({
    media_type: 'excel',
    name: file_name,
  });

  const result = await commitMassUpload({
    file_name,
    file_name_origin,
    file_type: 'EXCEL',
    limit: 0,
    link: upload_url,
  });

  return result;
}

async function getContactInChat(sender_id: string, sender_type: string) {
  const business_id = await AuthService.getBusinessId();
  const params = {
    business_id,
    sender_id,
    sender_type,
  };
  return await fetchData<Contact>(`${API_URI}/finan-business/api/v1/contact/get-in-chat?${qs.stringify(params)}`, {
    authorization: true,
  });
}

// Contact Delivering Address
async function getListContactDeliveringAddress(contact_id: string) {
  return await fetchData<ContactDeliveringAddress[]>(
    `${API_URI}/finan-business/api/v1/contact-delivering-address/get-list?${qs.stringify({ contact_id })}`,
    {
      authorization: true,
    },
  );
}

async function updateContactDeliveringAddress(id: string, body: ContactDeliveringAddressBody) {
  return await put<ContactDeliveringAddress>(
    `${API_URI}/finan-business/api/v1/contact-delivering-address/update/${id}`,
    body,
    { authorization: true },
  );
}

async function createContactDeliveringAddress(contact_id: string, body: ContactDeliveringAddressBody) {
  return await post<ContactDeliveringAddress>(
    `${API_URI}/finan-business/api/v1/contact-delivering-address/create`,
    { contact_id, ...body },
    { authorization: true },
  );
}

async function getContactAnalytic(option: string) {
  return await fetchData<ContactAnalytic>(
    `${API_URI}/finan-business/api/v1/contact/get-analytic?${qs.stringify({ option })}`,
    {
      authorization: true,
    },
  );
}

// Create in chat
async function createContactInChat(body: CreateContactInChatBody) {
  const business_id = await AuthService.getBusinessId();
  return await post<Contact>(
    `${API_URI}/finan-business/api/v1/contact/create-in-chat`,
    { business_id, ...body },
    { authorization: true },
  );
}

async function getOneByPhoneName(phoneNumber: string) {
  return await fetchData<Contact>(
    `${API_URI}/finan-business/api/v1/contact/get-one-by-phone-name?${qs.stringify({ phone_number: phoneNumber })}`,
    {
      authorization: true,
    },
  );
}

async function syncContactChat(body: SyncContactChatBody) {
  const business_id = await AuthService.getBusinessId();
  return await post<ExpectedAny>(
    `${API_URI}/finan-business/api/v1/contact/sync-contact-chat`,
    { ...body, business_id },
    {
      authorization: true,
    },
  );
}

async function getOrCreateGroupOfContactSetting(group_contact_id: string) {
  return await fetchData<ContactGroupSetting>(
    `${API_URI}/finan-business/api/v1/group-of-contact-setting/get-or-create?group_contact_id=${group_contact_id}`,
    {
      authorization: true,
    },
  );
}

async function updateGroupOfContactSetting(body: UpdateContactGroupSettingBody) {
  return await put<ExpectedAny>(`${API_URI}/finan-business/api/v1/group-of-contact-setting/update`, body, {
    authorization: true,
  });
}

async function revalidateGroupOfContactSetting(group_contact_id: string) {
  return await fetchData<ExpectedAny>(
    `${API_URI}/finan-business/api/v1/group-of-contact-setting/revalidate?group_of_contact_id=${group_contact_id}`,
    {
      authorization: true,
    },
  );
}

const ContactService = {
  getNewContacts,
  createContact,
  getContact,
  deleteContact,
  exportContact,
  getNotes,
  createNote,
  getOneNote,
  updateNote,
  deleteNote,
  createContactTransaction,
  updateContactTransaction,
  getContactTransactions,
  getContactGroups,
  getContactGroupDetail,
  createContactGroup,
  updateContactGroup,
  deleteContactGroup,
  generateContactGroupCode,
  getContactLabels,
  createContactLabel,
  updateContactLabel,
  deleteContactLabel,
  updateContact,
  updateCustomerPoint,
  transactionContact,
  getTransactionContacts,
  getCustomerPointHistory,
  getActivitiesHistory,
  deleteMultiContactTransaction,
  exportData,
  getLocationTreeBySearch,
  getDebtDetail,
  geContactMassUploads,
  getContactMassUploadsFailed,
  uploadContactFile,
  getContactInChat,
  getListContactDeliveringAddress,
  updateContactDeliveringAddress,
  createContactDeliveringAddress,
  getContactAnalytic,
  createContactInChat,
  getOneByPhoneName,
  syncContactChat,
  getContactPointUsed,
  getOrCreateGroupOfContactSetting,
  updateGroupOfContactSetting,
  revalidateGroupOfContactSetting,
};
export default ContactService;
