export const defaultImportGoods = ({ action_type }: { action_type: string }): PendingInventoryCreate => ({
  po_type: action_type,
  contact_id: '',
  contact_phone: '',
  contact_name: '',
  contact_avatar: '',
  contact_debt_amount: 0,
  note: '',
  po_details: [],
  po_detail_ingredient: [],
  total_discount: 0,
  sur_charge: 0,
  buyer_pay: 0,
  option: 'create_po',
  media: [],
  payment_state: 'paid',
  payment_source_id: '',
  payment_source_name: '',
  is_debit: false,
});

export const defaultExportGoods = ({ detail }: { detail?: InventoryDetail }): PendingCreateExportGoods => ({
  status: detail?.status || StatusInventory.COMPLETED,
  type: detail?.type || 'outbound',
  po_type: detail?.po_type || 'out',
  note: detail?.note || '',
  media: (detail?.media as ExpectedAny) || [],
  po_details:
    (detail?.list_item?.map((detail) => ({
      ...detail,
      historical_cost: detail.pricing,
    })) as ExpectedAny) || [],
  po_detail_ingredient: (detail?.list_ingredient as ExpectedAny) || [],
});

export const isDeepEqualExportGoods = ({
  currentData,
  defaultData,
}: {
  currentData: ExpectedAny;
  defaultData: ExpectedAny;
}) => {
  return JSON.stringify(currentData) !== JSON.stringify(defaultData);
};

export const INVENTORY_TYPE = { out: 'out', in: 'in' };

export const NAME_IMPORT_GOODS = 'Nhập hàng';

export enum PaymentStateInventory {
  PAID = 'paid',
  UNPAID = 'un_paid',
  PARTIAL_PAID = 'partial_paid',
  IN_DEBIT = 'in_debit',
  EMPTY = '',
}

export enum StatusInventory {
  EMPTY = '',
  COMPLETED = 'completed',
  PROCESSING = 'processing',
  CANCELLED = 'cancelled',
}

export enum SelectionGoodsTab {
  PRODUCT = 'product',
  INGREDIENT = 'ingredient',
}
