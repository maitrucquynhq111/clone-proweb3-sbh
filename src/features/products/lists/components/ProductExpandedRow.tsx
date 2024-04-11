import cx from 'classnames';
import { memo, useCallback } from 'react';
import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NormalPriceCell from './NormalPriceCell';
import InventoryCell from './InventoryCell';
import HistoricalCostCell from './HistoricalCostCell';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { useUpdateProductMutation } from '~app/services/mutations/useUpdateProductMutation';
import { handleUpdateProduct } from '~app/features/products/utils';
import { dataMenuAction } from '~app/features/products/lists/config';
import { ActionMenu, PlaceholderImage } from '~app/components';
import { ModalTypes } from '~app/modals';
import { useTableColumnsStore } from '~app/utils/hooks';
import { TableColumnsKey } from '~app/utils/constants';
import { acronymName } from '~app/utils/helpers';

type Props = {
  rowData: Product;
  queryKey?: ExpectedAny;
};

const ProductExpandedRow = ({ rowData, queryKey }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { syncDataByTypes } = useOfflineContext();
  const { mutateAsync } = useUpdateProductMutation();

  const canView = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_VIEW]);
  const canViewInventory = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_INVENTORY_VIEW]);
  const canViewHistoricalCost = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);

  const [filteredColumns] = useTableColumnsStore((store) => store?.table_columns?.[TableColumnsKey.PRODUCT_LIST]);

  const onRowClick = (skuId: string) => {
    if (canView) {
      navigate({
        pathname: location.pathname,
        search: `?${createSearchParams({
          modal: ModalTypes.ProductDetails,
          id: rowData.id,
          sku_id: skuId || '',
        })}`,
      });
    }
  };

  const onUpdateProduct = useCallback((productId: string, sku: Sku) => {
    return handleUpdateProduct(
      productId,
      sku,
      queryKey,
      mutateAsync,
      syncDataByTypes,
      t,
      'products-form:success.update_inventory',
    );
  }, []);

  return (
    <>
      {rowData.list_sku.map((sku) => {
        const showImage = filteredColumns
          ? filteredColumns?.some((item) => item.id === 'product_image' && item.checked)
          : true;
        const showSkuCode = filteredColumns
          ? filteredColumns?.some((item) => item.id === 'product_code' && item.checked)
          : true;
        const showUom = filteredColumns ? filteredColumns?.some((item) => item.id === 'uom' && item.checked) : true;
        const showNormalPrice = filteredColumns
          ? filteredColumns?.some((item) => item.id === 'normal_price' && item.checked)
          : true;
        const showCanPick = filteredColumns
          ? filteredColumns?.some((item) => item.id === 'can_pick_quantity' && item.checked)
          : true;
        const showInventory = filteredColumns
          ? filteredColumns?.some((item) => item.id === 'inventory' && item.checked)
          : true;
        const showHistoricalCost = filteredColumns
          ? filteredColumns?.some((item) => item.id === 'historical_cost' && item.checked)
          : true;
        return (
          <tr key={sku.id} onClick={() => onRowClick(sku.id)} className="pw-cursor-pointer">
            <td colSpan={showSkuCode ? 2 : 1} />
            <td>
              <div className="pw-flex pw-items-center">
                {sku?.sku_code && showSkuCode ? <div className="pw-p-2 pw-w-4/12 ">{sku?.sku_code || ''}</div> : null}
                <div
                  className={cx('pw-p-2 !pw-w-8/12 pw-flex pw-items-center pw-gap-3', {
                    'pw-pr-0 pw-border-l pw-border-solid pw-border-gray-300': sku?.sku_code && showSkuCode,
                  })}
                >
                  {showImage ? (
                    <>
                      {sku?.media?.[0] ? (
                        <PlaceholderImage
                          className="pw-bg-cover pw-rounded-md !pw-w-10 pw-h-10 pw-object-cover"
                          src={sku?.media?.[0]}
                          alt={sku.name}
                          isAvatar={false}
                        />
                      ) : (
                        <div className="pw-h-9 pw-rounded pw-bg-neutral-divider pw-font-semibold pw-p-2 pw-text-xs pw-flex pw-items-center pw-justify-center pw-text-primary-main">
                          {acronymName(sku.name).substring(0, 3)}
                        </div>
                      )}
                    </>
                  ) : null}
                  <div className="pw-overflow-hidden pw-flex-1 pw-text-ellipsis pw-text-justify">{sku.name}</div>
                </div>
              </div>
            </td>
            {showUom ? (
              <td>
                <div className="pw-overflow-hidden pw-line-clamp-1 pw-w-full pw-px-2">{sku.uom}</div>
              </td>
            ) : null}
            {showHistoricalCost ? (
              <td align="right">
                {canViewHistoricalCost ? (
                  <div className="pw-w-full pw-px-2">
                    <HistoricalCostCell onUpdateProduct={onUpdateProduct} product={rowData} sku={sku} />
                  </div>
                ) : null}
              </td>
            ) : null}
            {showNormalPrice ? (
              <td align="right">
                <div className="pw-w-full pw-px-2">
                  <NormalPriceCell onUpdateProduct={onUpdateProduct} product={rowData} sku={sku} />
                </div>
              </td>
            ) : null}
            {showCanPick ? (
              <td align="right">
                <div className="pw-overflow-hidden pw-line-clamp-1 pw-w-full pw-px-2">
                  {sku.sku_type === 'stock' ? sku.can_pick_quantity : null}
                </div>
              </td>
            ) : null}
            {showInventory ? (
              <td align="right">
                {canViewInventory ? (
                  <div onClick={(e) => e.stopPropagation()} className="pw-w-full">
                    <InventoryCell product={rowData} sku={sku} onUpdateProduct={onUpdateProduct} />
                  </div>
                ) : null}
              </td>
            ) : null}
            <td>
              <div onClick={(e) => e.stopPropagation()} className="pw-w-full pw-flex pw-items-center pw-justify-center">
                <ActionMenu
                  data={dataMenuAction(
                    rowData,
                    {
                      canDelete: false,
                      canView,
                    },
                    location,
                    navigate,
                    syncDataByTypes,
                    sku.id,
                  )}
                />
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default memo(ProductExpandedRow);
