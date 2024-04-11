import qs from 'querystring';
import AuthService from './auth';
import { API_URI, DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '~app/configs';
import { fetchData, fetchAll, post, postAsFetchAll, patch, put } from '~app/utils/helpers';

async function getInventory({
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  search,
  sort = 'created_at desc',
  start_time,
  end_time,
  type = [],
  category_name = [],
  staff_id = [],
}: ExpectedAny) {
  const business_id = await AuthService.getBusinessId();
  const params = {
    business_id: business_id,
    search: search || undefined,
    page: page,
    page_size: pageSize,
    sort,
    start_time: start_time || '2020-04-05T17:00:00.000Z',
    end_time: end_time || '2080-04-05T17:23:59.000Z',
    type: type.join(','),
    category_name: category_name.join(','),
    category_other: category_name.includes('other'),
  };
  if (staff_id.length > 0) {
    Object.assign(params, { staff_id: staff_id.join('|') });
  }
  const { data, meta } = await fetchAll<{
    data: Inventory[];
    meta: ResponseMeta;
  }>(`${API_URI}/ms-warehouse-management/api/v1/po-detail/get-list?${qs.stringify(params)}`, { authorization: true });
  return { data, meta };
}

async function getWarehouseDetail(id: string) {
  const business_id = await AuthService.getBusinessId();
  return await fetchData<WarehouseDetail>(
    `${API_URI}/finan-product/api/v2/sku/get-detail/${id}?${qs.stringify({
      business_id,
    })}`,
    {
      authorization: true,
    },
  );
}

async function getInventoryDetail({ po_code, id }: { po_code: string; id: string }) {
  const business_id = await AuthService.getBusinessId();
  return await fetchData<InventoryDetail>(
    `${API_URI}/ms-warehouse-management/api/v1/po/get-detail?${qs.stringify({
      business_id,
      po_code,
      id,
      is_staff: true,
    })}`,
    {
      authorization: true,
    },
  );
}

async function getInventoryCategory({ type }: { type: string }) {
  const business_id = await AuthService.getBusinessId();
  const paymentMethod = await fetchAll<{
    data: PoCategory[];
    meta: ResponseMeta;
  }>(
    `${API_URI}/ms-warehouse-management/api/v1/po-category/get-list?${qs.stringify({
      business_id,
      type: type,
    })}`,
    {
      authorization: true,
    },
  );
  return paymentMethod;
}

async function createImportGoods(params: InventoryCreateForm) {
  const business_id = await AuthService.getBusinessId();
  const inventoryAction = await post<JSONRecord<InventoryCreateForm>>(
    `${API_URI}/ms-warehouse-management/api/v1/po/create-inbound`,
    { ...params, business_id },
    {
      authorization: true,
    },
  );
  return inventoryAction;
}

async function createExportGoods(params: CreateExportGoodsForm) {
  const business_id = await AuthService.getBusinessId();
  const inventoryAction = await post<JSONRecord<CreateExportGoodsForm>>(
    `${API_URI}/ms-warehouse-management/api/v1/po/create-outbound`,
    { ...params, business_id },
    {
      authorization: true,
    },
  );
  return inventoryAction;
}

async function updateExportGoods(id: string, body: CreateExportGoodsForm) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await put<ExpectedAny>(
    `${API_URI}/ms-warehouse-management/api/v1/po/update-outbound/${id}`,
    { ...body, business_id },
    {
      authorization: true,
    },
  );
}

async function purchaseOrderIngredients(params: PurchaseOrderIngredients) {
  const business_id = await AuthService.getBusinessId();
  return await post(
    `${API_URI}/ms-warehouse-management/api/v1/purchase-order-ingredient/create`,
    { ...params, business_id },
    {
      authorization: true,
    },
  );
}

async function getInventoryAnalytics() {
  const business_id = await AuthService.getBusinessId();
  return await fetchData<InventoryAnalytics>(
    `${API_URI}/ms-warehouse-management/api/v2/warehouse/get-summary?${qs.stringify({
      business_id,
      count_out_of_stock: true,
      count_non_stock: true,
    })}`,
    {
      authorization: true,
    },
  );
}

async function getInventoryBookAnalytics({ start_time, end_time }: ExpectedAny) {
  const business_id = await AuthService.getBusinessId();
  return await fetchData<InventoryBookAnalytics>(
    `${API_URI}/ms-warehouse-management/api/v1/po/get-period-value?${qs.stringify({
      business_id,
      start_time: start_time || '2020-04-05T17:00:00.000Z',
      end_time: end_time || '2080-04-05T17:23:59.000Z',
    })}`,
    {
      authorization: true,
    },
  );
}

async function getInventoryCategories() {
  return fetchAll<{ data: InventoryCategory[]; meta: ResponseMeta }>(
    `${API_URI}/ms-warehouse-management/api/v2/po-category/get-list`,
    {
      authorization: true,
    },
  );
}

async function getInventoryImportBook({
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  search,
  sort = 'created_at desc',
  start_time,
  end_time,
  is_staff = true,
  po_type = [],
  option = [],
  contact_id = [],
  object_type = [],
  payment_state = [],
  type = 'inbound',
  status,
}: ExpectedAny) {
  const business_id = await AuthService.getBusinessId();
  const params = {
    business_id,
    search: search || undefined,
    page: page,
    page_size: pageSize,
    sort,
    start_time: start_time || null,
    end_time: end_time || null,
    is_staff,
    po_type: po_type.length > 0 ? po_type.join(',') : undefined,
    option: option.length > 0 ? option.join(',') : undefined,
    object_type: object_type.length === 0 ? 'sku|ingredient' : object_type.join('|'),
    payment_state: payment_state.length > 0 ? payment_state.join('|') : undefined,
    type,
    status: status.join('|'),
  };
  if (contact_id.length > 0) {
    Object.assign(params, { contact_id: contact_id.join('|') });
  }
  const { data, meta } = await postAsFetchAll<{
    data: InventoryImportBook[];
    meta: ResponseMeta;
  }>(`${API_URI}/ms-warehouse-management/api/v1/po/get-list`, { ...params }, { authorization: true });
  return { data, meta };
}

async function exportInventoryImportBook({
  start_time,
  end_time,
  search,
}: {
  start_time?: string;
  end_time?: string;
  search?: string;
}) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<string>(
    `${API_URI}/finan-report/api/v1/po/export-inbound`,
    {
      business_id,
      start_time: start_time || '2020-04-05T17:00:00.000Z',
      end_time: end_time || '2080-04-05T17:23:59.000Z',
      search,
    },
    { authorization: true },
  );
}

async function exportInventoryExportBook({
  start_time,
  end_time,
  search,
}: {
  start_time?: string;
  end_time?: string;
  search?: string;
}) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<string>(
    `${API_URI}/finan-report/api/v1/po/export-outbound`,
    {
      business_id,
      start_time: start_time || '2020-04-05T17:00:00.000Z',
      end_time: end_time || '2080-04-05T17:23:59.000Z',
      search,
    },
    { authorization: true },
  );
}

// Stock taking
async function getListStockTaking({
  page,
  pageSize,
  search,
  startTime,
  endTime,
  objectType,
  status,
  staffIds,
}: ExpectedAny) {
  const business_id = await AuthService.getBusinessId();
  const body: ExpectedAny = {
    business_id,
    page,
    page_size: pageSize,
    search,
    is_staff: true,
    type: 'stocktake',
    object_type: objectType,
    status,
    staff_ids: staffIds,
  };
  if (startTime) body.start_time = startTime;
  if (endTime) body.end_time = endTime;
  const { data, meta } = await postAsFetchAll<{
    data: InventoryStockTaking[];
    meta: ResponseMeta & InventoryStockTakingAnalytic;
  }>(`${API_URI}/ms-warehouse-management/api/v1/po/get-list`, { ...body }, { authorization: true });
  return { data, meta };
}

async function createStockTaking(body: StockTakingBody) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<ExpectedAny>(
    `${API_URI}/ms-warehouse-management/api/v1/po/create-stocktake`,
    { ...body, business_id },
    {
      authorization: true,
    },
  );
}

async function updateStockTaking(id: string, body: StockTakingBody) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await put<ExpectedAny>(
    `${API_URI}/ms-warehouse-management/api/v1/po/update-stocktake/${id}`,
    { ...body, business_id },
    {
      authorization: true,
    },
  );
}

async function exportStockTakingDetail(po_code: string) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<string>(
    `${API_URI}/finan-report/api/v1/po/export-detail-stocktake`,
    {
      business_id,
      po_code,
    },
    { authorization: true },
  );
}

async function exportStockTaking({ start_time, end_time }: { start_time: string; end_time: string }) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<string>(
    `${API_URI}/finan-report/api/v1/po/export-stocktake`,
    {
      business_id,
      start_time,
      end_time,
    },
    { authorization: true },
  );
}

async function exportDetailInbound({ po_code }: { po_code: string }) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<string>(
    `${API_URI}/finan-report/api/v1/po/export-detail-inbound`,
    {
      business_id,
      po_code,
    },
    { authorization: true },
  );
}

async function exportDetailOutbound({ po_code }: { po_code: string }) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<string>(
    `${API_URI}/finan-report/api/v1/po/export-detail-outbound`,
    {
      business_id,
      po_code,
    },
    { authorization: true },
  );
}

async function cancelDetailOutbound(id: string) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await put<ExpectedAny>(
    `${API_URI}/ms-warehouse-management/api/v1/po/cancel-outbound/${id}`,
    { business_id },
    {
      authorization: true,
    },
  );
}

async function cancelPurchaseOrder(id: string, body: PendingCancelPurchaseOrder) {
  return await patch<ExpectedAny>(`${API_URI}/ms-warehouse-management/api/v2/purchase-order/cancel/${id}`, body, {
    authorization: true,
  });
}

async function createInventoryPayment(body: PendingCreateInventoryPayment) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<string>(
    `${API_URI}/ms-warehouse-management/api/v2/payment-po/create`,
    {
      business_id,
      ...body,
    },
    { authorization: true },
  );
}

async function getContactsPurchaseOrder() {
  return fetchAll<{ data: InventoryContactInfo[]; meta: ResponseMeta }>(
    `${API_URI}/ms-warehouse-management/api/v1/purchase-order/get-list-contact`,
    {
      authorization: true,
    },
  );
}

async function exportInventoryBook({ start_time, end_time }: { start_time?: string; end_time?: string }) {
  const business_id = (await AuthService.getBusinessId()) || '';
  return await post<string>(
    `${API_URI}/finan-report/api/v1/po/export-po-detail`,
    {
      business_id,
      start_time: start_time || '2020-04-05T17:00:00.000Z',
      end_time: end_time || '2080-04-05T17:23:59.000Z',
    },
    { authorization: true },
  );
}

async function getPoStaffs(type: string) {
  const params = {
    type,
  };
  return fetchAll<InventoryStaffInfo[]>(
    `${API_URI}/ms-warehouse-management/api/v1/purchase-order/get-list-staff?${qs.stringify(params)}`,
    {
      authorization: true,
    },
  );
}

const InventoryService = {
  getInventory,
  getWarehouseDetail,
  getInventoryDetail,
  getInventoryCategory,
  createImportGoods,
  createExportGoods,
  updateExportGoods,
  purchaseOrderIngredients,
  getInventoryAnalytics,
  getInventoryBookAnalytics,
  getInventoryCategories,
  getInventoryImportBook,
  exportInventoryImportBook,
  exportInventoryExportBook,
  exportDetailInbound,
  exportDetailOutbound,
  cancelDetailOutbound,
  exportInventoryBook,
  cancelPurchaseOrder,
  createInventoryPayment,
  getListStockTaking,
  createStockTaking,
  updateStockTaking,
  exportStockTaking,
  exportStockTakingDetail,
  getContactsPurchaseOrder,
  getPoStaffs,
};
export default InventoryService;
