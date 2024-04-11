import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { formatCurrency, formatDateToString } from '~app/utils/helpers';
import { INVENTORY_TYPE } from '~app/features/warehouse/utils';

const GoodsTicket = ({ inventoryDetail }: { inventoryDetail?: InventoryDetail }) => {
  const { t } = useTranslation('purchase-order');

  const renderUomName = (item: IngredientInventoryDetail) => {
    if (item.uom_id === item.uom.id) return item.uom.name;
    return item.uom?.sub_uom?.name || item.uom.name;
  };

  const getAmountPaid = () => {
    if (inventoryDetail?.is_debit) return 0;
    return (inventoryDetail?.payment_purchase_order || []).reduce((prev: number, curr: PaymentPurchaseOrder) => {
      return prev + curr.amount;
    }, 0);
  };

  const getSkusTable = () => {
    if (!inventoryDetail?.list_item || inventoryDetail?.list_item.length === 0) return;
    return (
      <>
        <tr className="pw-border-t pw-border-solid pw-border-black">
          <td colSpan={3} className="pw-text-left pw-text-2xs pw-font-bold pw-font-roboto pw-p-1 pw-pt-2 pw-uppercase">
            {t('sku-table.product')} ({inventoryDetail?.list_item.length})
          </td>
        </tr>
        {inventoryDetail?.list_item.map((item: ItemInventoryDetail, index: number) => {
          const isVariant = item?.product_type === 'variant' ? true : false;
          return inventoryDetail?.po_type === INVENTORY_TYPE.in ? (
            <>
              <tr className="pw-border-none">
                <td colSpan={3} className="pw-text-left pw-text-2xs pw-font-roboto pw-p-1">
                  {index + 1}. {item?.product_name} {item && isVariant ? <span> - {`${item.sku_name}`}</span> : null}
                </td>
              </tr>
              <tr className="pw-border-none">
                <td className="pw-text-left pw-text-2xs pw-font-roboto pw-p-1">{formatCurrency(item.pricing)}</td>
                <td className="pw-text-center pw-text-2xs pw-font-roboto pw-p-1">{formatCurrency(item.quantity)}</td>
                <td className="pw-text-right pw-text-2xs pw-font-roboto pw-p-1">
                  {formatCurrency(item.pricing * item.quantity)}
                </td>
              </tr>
            </>
          ) : (
            <tr className="pw-border-none">
              <td className="pw-text-left pw-text-2xs pw-font-roboto pw-p-1">
                {index + 1}. {item?.product_name} {item && isVariant ? <span> - {`${item.sku_name}`}</span> : null}
              </td>
              <td className="pw-text-right pw-text-2xs pw-font-roboto pw-p-1">{formatCurrency(item.quantity)}</td>
            </tr>
          );
        })}
      </>
    );
  };

  const getIngredientTable = () => {
    if (!inventoryDetail?.list_ingredient || inventoryDetail?.list_ingredient.length === 0) return;
    return (
      <>
        <tr
          className={cx('pw-border-t pw-border-black pw-border-dashed', {
            '!pw-border-solid': !inventoryDetail?.list_item || inventoryDetail?.list_item.length === 0,
          })}
        >
          <td colSpan={3} className="pw-text-left pw-text-2xs pw-font-bold pw-font-roboto pw-p-1 pw-pt-2 pw-uppercase">
            {t('ingredient-table.ingredient')} ({inventoryDetail?.list_ingredient.length})
          </td>
        </tr>
        {inventoryDetail?.list_ingredient.map((item: IngredientInventoryDetail, index: number) => {
          return inventoryDetail?.po_type === INVENTORY_TYPE.in ? (
            <>
              <tr className="pw-border-none">
                <td colSpan={3} className="pw-text-left pw-text-2xs pw-font-roboto pw-p-1">
                  {index + 1}. {item.name} - {renderUomName(item)}
                </td>
              </tr>
              <tr className="pw-border-none">
                <td className="pw-text-left pw-text-2xs pw-font-roboto pw-p-1">{formatCurrency(item.pricing)}</td>
                <td className="pw-text-center pw-text-2xs pw-font-roboto pw-p-1">{formatCurrency(item.quantity)}</td>
                <td className="pw-text-right pw-text-2xs pw-font-roboto pw-p-1">
                  {formatCurrency(item.pricing * item.quantity)}
                </td>
              </tr>
            </>
          ) : (
            <tr className="pw-border-none">
              <td className="pw-text-left pw-text-2xs pw-font-roboto pw-p-1">
                {index + 1}. {item?.name} - {renderUomName(item)}
              </td>
              <td className="pw-text-right pw-text-2xs pw-font-roboto pw-p-1">{formatCurrency(item.quantity)}</td>
            </tr>
          );
        })}
      </>
    );
  };

  return (
    <div className="pw-max-w-full pw-bg-white pw-pr-5">
      <div className="pw-p-1">
        <p className="pw-text-2xs pw-text-black pw-font-roboto pw-text-center pw-uppercase">
          {inventoryDetail?.contact_info.address}
        </p>
        <p className="pw-text-2xs pw-mt-2 pw-font-bold pw-text-black pw-font-roboto pw-text-center pw-uppercase">
          {inventoryDetail?.po_type === INVENTORY_TYPE.in
            ? t('ticket.import_goods_ticket')
            : t('ticket.export_goods_ticket')}
        </p>
        <p className="pw-text-2xs pw-mt-2 pw-text-black pw-font-roboto pw-text-center pw-uppercase">
          {inventoryDetail?.po_code}
        </p>
        <p className="pw-text-2xs pw-mt-2 pw-text-black pw-font-roboto">
          {t('ticket.creator')}:{' '}
          <span className="pw-text-2xs">
            {inventoryDetail?.staff_info?.staff_name || inventoryDetail?.staff_info?.phone_number}
          </span>
        </p>
        {inventoryDetail?.po_type === INVENTORY_TYPE.in && (
          <p className="pw-text-2xs pw-mt-2 pw-text-black pw-font-roboto">
            {t('supplier')}: <span className="pw-text-2xs">{inventoryDetail.contact_info.name}</span>
          </p>
        )}
        <div className="pw-flex pw-justify-between pw-mt-2">
          <span className="pw-text-2xs pw-text-black pw-font-roboto">
            {inventoryDetail?.po_type === INVENTORY_TYPE.in ? t('ticket.date_import') : t('ticket.date_export')}:{' '}
            <span className="pw-text-2xs">
              {formatDateToString(inventoryDetail?.created_at || new Date(), 'dd/MM/yyyy')}
            </span>
          </span>
          <span className="pw-text-2xs pw-text-black pw-font-robot pw-text-right">
            {t('ticket.time')}:{' '}
            <span className="pw-text-2xs">
              {formatDateToString(inventoryDetail?.created_at || new Date(), 'HH:mm ')}
            </span>
          </span>
        </div>
        <p className="pw-text-2xs pw-mt-2 pw-text-black pw-font-roboto">
          {t('ticket.note')}: <span className="pw-text-2xs">{inventoryDetail?.note}</span>
        </p>
      </div>

      <table className="pw-border-collapse pw-text-black pw-w-full pw-m-0 pw-box-border pw-bg-white pw-mt-2">
        {inventoryDetail?.po_type === INVENTORY_TYPE.in ? (
          <tr className="pw-border-t pw-border-dashed pw-border-black">
            <th className=" pw-text-left pw-text-2xs pw-font-bold pw-font-roboto pw-p-1">{t('ticket.pricing')}</th>
            <th className=" pw-text-center pw-text-2xs pw-font-bold pw-font-roboto pw-p-1">{t('ticket.quantity')}</th>
            <th className=" pw-text-right pw-text-2xs pw-font-bold pw-font-roboto pw-p-1">
              {t('ticket.pricing-total')}
            </th>
          </tr>
        ) : (
          <tr className="pw-border-t pw-border-dashed pw-border-black">
            <th className="pw-text-left pw-text-2xs pw-font-bold pw-font-roboto pw-p-1">{t('ticket.name')}</th>
            <th className=" pw-text-right pw-text-2xs pw-font-bold pw-font-roboto pw-p-1">{t('ticket.quantity')}</th>
          </tr>
        )}
        {getSkusTable()}
        {getIngredientTable()}
      </table>
      {inventoryDetail?.po_type === INVENTORY_TYPE.in ? (
        <div className="pw-border-t pw-border-dashed pw-border-black pw-p-1">
          <div className="pw-flex pw-justify-between pw-mt-2">
            <span className="pw-text-2xs pw-text-black pw-font-roboto">
              {t('total-price-product')} ({formatCurrency(inventoryDetail?.total_items || 0)})
            </span>
            <span className="pw-text-2xs pw-text-black pw-font-roboto pw-text-right">
              {formatCurrency(inventoryDetail?.total_amount || 0)}
            </span>
          </div>
          {inventoryDetail?.sur_charge ? (
            <div className="pw-flex pw-justify-between pw-mt-2">
              <span className="pw-text-2xs pw-text-black pw-font-roboto">{t('surcharge')}</span>
              <span className="pw-text-2xs pw-text-black pw-font-roboto pw-text-right">
                {formatCurrency(inventoryDetail?.sur_charge || 0)}
              </span>
            </div>
          ) : null}
          {inventoryDetail?.total_discount ? (
            <div className="pw-flex pw-justify-between pw-mt-2">
              <span className="pw-text-2xs pw-text-black pw-font-roboto">{t('total-discount')}</span>
              <span className="pw-text-2xs pw-text-black pw-font-roboto pw-text-right">
                {formatCurrency(inventoryDetail?.total_discount || 0)}
              </span>
            </div>
          ) : null}{' '}
          <div className="pw-flex pw-justify-between pw-mt-2">
            <span className="pw-text-2xs pw-text-black pw-font-roboto">{t('grand-total-price')}</span>
            <span className="pw-text-2xs pw-text-black pw-font-roboto pw-text-right">
              {inventoryDetail
                ? formatCurrency(
                    inventoryDetail.total_amount + inventoryDetail.sur_charge - inventoryDetail.total_discount,
                  )
                : 0}
            </span>
          </div>
        </div>
      ) : (
        <div className="pw-border-t pw-border-dashed pw-border-black pw-p-1">
          <div className="pw-flex pw-justify-between pw-mt-2">
            <span className="pw-text-2xs pw-text-black pw-font-roboto">{t('total-quantity')}</span>
            <span className="pw-text-2xs pw-text-black pw-font-roboto pw-text-right">
              {formatCurrency(inventoryDetail?.total_quantity || 0)}
            </span>
          </div>
        </div>
      )}
      {inventoryDetail?.po_type === INVENTORY_TYPE.in && (
        <div className="pw-border-t pw-border-dashed pw-border-black pw-mt-2 pw-p-1">
          <div className="pw-flex pw-justify-between pw-mt-2">
            <span className="pw-text-2xs pw-text-black pw-font-roboto">{t('ticket.need_to_pay_supplier')}</span>
            <span className="pw-text-2xs pw-text-black pw-font-roboto pw-text-right">
              {inventoryDetail
                ? formatCurrency(
                    inventoryDetail.total_amount + inventoryDetail.sur_charge - inventoryDetail.total_discount,
                  )
                : 0}
            </span>
          </div>
          <div className="pw-flex pw-justify-between pw-mt-2">
            <span className="pw-text-2xs pw-text-black pw-font-roboto">{t('ticket.paid_supplier')}</span>
            <span className="pw-text-2xs pw-text-black pw-font-roboto pw-text-right">
              {formatCurrency(getAmountPaid())}
            </span>
          </div>
          <div className="pw-flex pw-justify-between pw-mt-2">
            <span className="pw-text-2xs pw-text-black pw-font-roboto">{t('ticket.paid_remaining_supplier')}</span>
            <span className="pw-text-2xs pw-text-black pw-font-roboto pw-text-right">
              {inventoryDetail
                ? formatCurrency(
                    inventoryDetail.total_amount +
                      inventoryDetail.sur_charge -
                      inventoryDetail.total_discount -
                      getAmountPaid(),
                  )
                : 0}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoodsTicket;
