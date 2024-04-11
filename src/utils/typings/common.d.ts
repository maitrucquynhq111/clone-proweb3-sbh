declare module 'animated-number-react';

type Permission = {
  canView?: boolean;
  canCreate?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  canViewDetail?: boolean;
};

interface ISyncRecord {
  id: string;
  updated_at: number;
  deleted_at: number;
  created_at: number;
}

type JSONRecord<T> = Omit<T, 'updated_at' | 'created_at' | 'deleted_at'> & {
  updated_at: string;
  created_at: string;
  deleted_at: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExpectedAny = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Unused = any;

type SorterProps = {
  id: string;
  direction: string;
};

type OrderDirection = 'asc' | 'desc' | null;

type OrderBy = string | null;

type ConfirmState<T> = { confirming: T | false };

type ResponseMeta = { page?: number; total_rows: number; total_pages: number };
type ResponseMetaTable = { count_table_empty: number; count_table_using: number };

type PendingUploadImage = {
  name: string;
  type: string;
  url: string;
  content: ArrayBuffer;
} & File;

type IPending = { client_id: string };

type OrdersParams = {
  id?: string | '';
  orderBy?: OrderBy;
  order?: OrderDirection;
  state?: string;
  search?: string;
  start_time?: string;
  end_time?: string;
  order_number?: string;
  po_type?: string;
  staff_creator_ids?: string[];
  contact_id?: string;
} & CommonParams;

type CashbooksParams = {
  start_time?: string;
  end_time?: string;
  category_id?: string;
  search?: string;
  transaction_type?: string;
  status?: string;
} & CommonParams;

type PNLParams = {
  start_time?: string;
  end_time?: string;
  option?: string;
  search?: string;
} & CommonParams;

type PaymentSourceParams = {
  start_time?: string;
  end_time?: string;
} & CommonParams;

type CommonParams = {
  page: number;
  pageSize: number;
  sort?: string;
  name?: string;
  search?: string;
};

type JWT = { exp: number };

type SelectTab = { id: string; label: string };

type SvgImageProperties = {
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
};

type Column = {
  id: string;
  label: string;
  checked: boolean;
};

type TableColumns = {
  [key: string]: Column[];
};
