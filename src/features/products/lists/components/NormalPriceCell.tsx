import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { AutoResizeInput } from '~app/components';
import { numberFormat } from '~app/configs';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';

type Props = {
  product: Product;
  sku: Sku;
  onUpdateProduct: (productId: string, sku: Sku) => Promise<boolean>;
};

const NormalPriceCell = ({ product, sku, onUpdateProduct }: Props) => {
  const { t } = useTranslation('products-form');
  const [error, setError] = useState(false);
  const defaultValue = sku?.normal_price.toString() || '';
  const canUpdateProduct = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_UPDATE]);

  const handleBlur = async (value: string) => {
    try {
      if (!sku) return;
      if (!value || value === '0') {
        setError(true);
        return toast.error(t('error.min_normal_price'));
      }
      if (value === defaultValue) return setError(false);
      sku.normal_price = Number(value);
      const isError = await onUpdateProduct(product.id, sku);
      if (isError) return setError(true);
      setError(false);
    } catch (error) {
      // TO DO
    }
  };

  useEffect(() => setError(false), [sku]);

  if (!canUpdateProduct) return <span>{numberFormat.format(sku.normal_price)}</span>;

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

export default memo(NormalPriceCell);
