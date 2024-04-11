import qs from 'querystring';
import { API_URI, DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '~app/configs';
import { fetchAll } from '~app/utils/helpers';

async function getTables({ sector_id, search }: { sector_id?: string; search: string }) {
  const { data, meta } = await fetchAll<{
    data: Array<Table>;
    meta: ResponseMetaTable;
  }>(
    `${API_URI}/finan-reservation/api/v1/table/get-list?${qs.stringify({
      sector_id,
      search,
    })}`,
    { authorization: true },
  );

  return { data, meta };
}

async function getKitchenTickets({ order_id }: { order_id: string }) {
  const { data } = await fetchAll<{
    data: KitchenTicket;
  }>(
    `${API_URI}/finan-reservation/api/v1/kitchen-ticket/get-list?${qs.stringify({
      order_id,
    })}`,
    { authorization: true },
  );

  return { data };
}

async function getTableZone({
  title,
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  sort,
}: CommonParams & { title?: string }) {
  const { data, meta } = await fetchAll<{
    data: Array<TableZone>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-reservation/api/v1/sector/get-list?${qs.stringify({
      title,
      page,
      page_size: pageSize,
      sort,
    })}`,
    { authorization: true },
  );

  return { data, meta };
}

const TableService = {
  getTables,
  getTableZone,
  getKitchenTickets,
};
export default TableService;
