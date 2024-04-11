import cx from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsExclamationTriangle } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { AutoResizeInput } from '~app/components';
import { InventoryAdjustment } from '~app/features/products/lists/components';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';

type Props = {
  sku: Sku;
  product: Product;
  onUpdateProduct: (productId: string, sku: Sku, successMessage?: string) => Promise<boolean>;
};

const InventoryCell = ({ sku, product, onUpdateProduct }: Props) => {
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const defaultValue = sku?.po_details?.quantity ? sku?.po_details?.quantity.toString() : '';

  const canUpdateProduct = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_UPDATE]);

  const isStockType = useMemo(() => {
    return sku.sku_type === 'stock';
  }, [sku]);

  const isActive = useMemo(() => sku.is_active, [sku]);

  const isIngredient = useMemo(() => product.has_ingredient, [product]);

  const handleBlur = async (value: string) => {
    try {
      if (!sku) return;
      if (value === defaultValue) return setError(false);
      if (sku.po_details.blocked_quantity > Number(value)) {
        setError(true);
        return toast.error(t('products-form:error.quantity'));
      }
      sku.po_details.quantity = Number(value);
      const isError = await onUpdateProduct(product.id, sku, 'products-form:success.update_inventory');
      if (isError) return setError(true);
      setError(false);
    } catch (error) {
      // TO DO
    }
  };

  const showWarningInventory = useMemo(() => {
    return sku?.po_details?.warning_value > 0 && sku.can_pick_quantity <= sku?.po_details?.warning_value;
  }, [sku]);

  useEffect(() => setError(false), [sku]);

  if (isIngredient) return <div>{t('products-table:apply_recipe')}</div>;

  if (!canUpdateProduct && isStockType) return <span>{defaultValue}</span>;

  if (!canUpdateProduct && !isStockType)
    return (
      <span
        className={cx({
          'pw-text-success-active': isActive,
          'pw-text-error-active': !isActive,
        })}
      >
        {isActive ? t('common:in-stock') : t('common:out-of-stock')}
      </span>
    );

  return (
    <>
      {isStockType ? (
        <div
          className={cx('pw-flex pw-items-center ', {
            'pw-justify-between': showWarningInventory,
            'pw-justify-end': !showWarningInventory,
          })}
        >
          {sku?.po_details?.warning_value > 0 && sku.can_pick_quantity <= sku?.po_details?.warning_value ? (
            <BsExclamationTriangle size={24} className="pw-text-warning-active pw-mr-1" />
          ) : null}
          <AutoResizeInput
            name=""
            defaultValue={defaultValue}
            isDecimal
            placeholder="0"
            isForm={false}
            error={error}
            onBlur={handleBlur}
            className="!pw-text-sm"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : (
        <InventoryAdjustment
          product={product}
          sku={sku}
          onUpdateProduct={onUpdateProduct}
          className="pw-w-full pw-flex pw-justify-end pw-items-center pw-h-full"
        >
          <span
            className={cx({
              'pw-text-success-active': isActive,
              'pw-text-error-active': !isActive,
            })}
          >
            {isActive ? t('common:in-stock') : t('common:out-of-stock')}
          </span>
        </InventoryAdjustment>
      )}
    </>
  );
};

export default InventoryCell;
