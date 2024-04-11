import { memo, useEffect, useState } from 'react';
import { AutoResizeInput } from '~app/components';
import { numberFormat } from '~app/configs';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';

type Props = {
  product: Product;
  sku: Sku;
  onUpdateProduct: (productId: string, sku: Sku) => Promise<boolean>;
};

const HistoricalCostCell = ({ product, sku, onUpdateProduct }: Props) => {
  const [error, setError] = useState(false);
  const defaultValue = sku?.historical_cost ? sku?.historical_cost.toString() : '';

  const canUpdateProduct = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_UPDATE]);

  const handleBlur = async (value: string) => {
    try {
      if (!sku) return;
      if (value === defaultValue) return setError(false);

      sku.historical_cost = Number(value);
      const isError = await onUpdateProduct(product.id, sku);
      if (isError) return setError(true);
      setError(false);
    } catch (error) {
      // TO DO
    }
  };

  useEffect(() => setError(false), [sku]);

  if (!canUpdateProduct) return <span>{sku.historical_cost ? numberFormat.format(sku.historical_cost) : ''}</span>;

  return (
    <AutoResizeInput
      name=""
      defaultValue={defaultValue}
      isNumber
      placeholder="0"
      isForm={false}
      error={error}
      onBlur={handleBlur}
      className="!pw-text-sm"
      onClick={(e) => e.stopPropagation()}
    />
  );
};

export default memo(HistoricalCostCell);
