import { useTranslation } from 'react-i18next';
import { formatCurrency } from '~app/utils/helpers/stringHelpers';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';

type Props = {
  inventoryDetail: InventoryDetail | null;
};

const Payment = ({ inventoryDetail }: Props): JSX.Element => {
  const { t } = useTranslation('purchase-order');
  const canUpdateHistoricalCost = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);

  return (
    <div className="pw-flex">
      <div className="pw-flex-1"></div>
      <div className="pw-flex pw-flex-col pw-gap-y-3 pw-flex-1">
        <div className="pw-flex pw-justify-between">
          <span className="pw-text-base">{t('total-quantity')}</span>
          <span className="pw-text-base pw-font-semibold">
            {formatCurrency(inventoryDetail?.po_details?.length || 0)}
          </span>
        </div>
        <div className="pw-flex pw-justify-between pw-ml-6">
          <span className="pw-text-base">{t('sku-table.product')}</span>
          <span className="pw-text-base pw-font-semibold">
            {formatCurrency(inventoryDetail?.list_item?.length || 0)}
          </span>
        </div>
        <div className="pw-flex pw-justify-between pw-ml-6">
          <span className="pw-text-base">{t('ingredient-table.ingredient')}</span>
          <span className="pw-text-base pw-font-semibold">
            {formatCurrency(inventoryDetail?.list_ingredient?.length || 0)}
          </span>
        </div>
        <div className="pw-flex pw-justify-between">
          <span className="pw-text-base">{t('total-price-product')}</span>
          <span className="pw-text-base pw-font-semibold">
            {canUpdateHistoricalCost ? formatCurrency(inventoryDetail?.total_amount || 0) : 0}đ
          </span>
        </div>
        {inventoryDetail?.total_discount ? (
          <div className="pw-flex pw-justify-between">
            <span className="pw-text-base">{t('total-discount')}</span>
            <span className="pw-text-base pw-font-semibold">
              {formatCurrency(inventoryDetail?.total_discount || 0)}đ
            </span>
          </div>
        ) : null}
        {inventoryDetail?.sur_charge ? (
          <div className="pw-flex pw-justify-between">
            <span className="pw-text-base">{t('surcharge')}</span>
            <span className="pw-text-base pw-font-semibold">{formatCurrency(inventoryDetail?.sur_charge || 0)}đ</span>
          </div>
        ) : null}
        <div className="pw-border-b pw-border-solid pw-border-neutral-border" />
        <div className="pw-flex pw-justify-between pw-text-base">
          <span>{t('grand-total-price')}</span>
          <span className="pw-text-secondary-main pw-font-semibold">
            {canUpdateHistoricalCost && inventoryDetail
              ? formatCurrency(
                  inventoryDetail.total_amount + inventoryDetail.sur_charge - inventoryDetail.total_discount,
                )
              : 0}
            đ
          </span>
        </div>
      </div>
    </div>
  );
};

export default Payment;
