import { memo, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { BsPlusSquareFill } from 'react-icons/bs';
import { Toggle, IconButton } from 'rsuite';
import { PlaceholderImage } from '~app/components';
import QuantityControl from '~app/components/QuantityControl';
import { QuantityControlSize } from '~app/utils/constants';

type Props = {
  data: OutOfStockItem[];
  setValue: (name: string, value: ExpectedAny) => void;
};

const ListProduct = ({ data, setValue }: Props) => {
  const { t } = useTranslation('products-form');
  const [showQuantity, setShowQuantity] = useState<boolean>(false);
  return (
    <div className="pw-flex pw-flex-col">
      {data.map((product, index) => {
        const isAdvance = product.sku_type === 'stock';
        return (
          <div
            key={`product-out-of-stock-${product.product_id}`}
            className={cx('pw-flex pw-p-4 ', {
              'pw-border-t pw-border-solid pw-border-neutral-divider': index !== 0,
            })}
          >
            <PlaceholderImage
              src={product?.media?.[0] || ''}
              className="!pw-w-16 !pw-h-16 pw-border pw-border-solid pw-border-neutral-divider pw-rounded-md"
            />
            <div className="pw-flex pw-flex-1 pw-flex-col pw-justify-between pw-ml-4">
              <span className="pw-text-neutral-primary pw-text-base">{product.product_name}</span>
              <div className="pw-flex pw-items-center pw-justify-between">
                <div className="pw-flex pw-flex-col">
                  <span className="pw-text-neutral-secondary pw-text-sm ">{product.sku_name || ''}</span>
                  {isAdvance && (
                    <span className="pw-text-neutral-secondary pw-text-sm ">{`${t('missing_inventory')}: ${
                      product.missing_quantity
                    }`}</span>
                  )}
                </div>
                {isAdvance && showQuantity ? (
                  <QuantityControl
                    size={QuantityControlSize.Small}
                    defaultValue={String(product.missing_quantity)}
                    onChange={(value) => {
                      if (+value === product.missing_quantity - 1) {
                        setShowQuantity(false);
                        setValue(`data[${index}].po_details.quantity`, 0);
                      }
                      setValue(`data[${index}].po_details.quantity`, +value);
                    }}
                    placeholder="0"
                    className="!pw-w-auto"
                  />
                ) : isAdvance && !showQuantity ? (
                  <IconButton
                    onClick={() => {
                      setShowQuantity(true);
                      setValue(`data[${index}].po_details.quantity`, product.missing_quantity);
                    }}
                    className="!pw-bg-transparent !pw-overflow-visible !pw-w-max !py-0 !px-2 pw-h-9"
                    icon={<BsPlusSquareFill size={40} className="pw-text-green-700" />}
                  />
                ) : (
                  <div className="pw-flex">
                    <span className="pw-mr-1 pw-text-neutral-primary pw-text-base">{t('product_already')}</span>
                    <div className="blue-toggle">
                      <Toggle
                        onChange={(value) => {
                          setValue(`data[${index}].is_active`, value);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(ListProduct);
