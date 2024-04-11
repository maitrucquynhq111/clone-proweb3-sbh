import JsBarcode from 'jsbarcode';
import { memo, useEffect } from 'react';
import { numberFormat } from '~app/configs';
import { getFinalPrice } from '~app/utils/helpers';

type PrintSettingProps = {
  setting: BarcodePrintingSetting;
  sku: SkuSelected;
  itemWidth?: number;
  itemHeight?: number;
  barcodeOptions?: { width: number; height: number; fontSize: number };
  nameStyle?: {
    minHeight: number;
    maxHeight: number;
    fontSize: number;
    lineHeight: number;
    sub: number;
  };
  priceStyle?: { fontSize: number; marginTop: number };
  id: string;
};

const BarcodeItem = ({
  setting,
  sku,
  itemWidth,
  itemHeight,
  barcodeOptions,
  nameStyle,
  priceStyle,
  id,
}: PrintSettingProps) => {
  const handleProductName = () => {
    const isVariant = !sku?.product_type.match(/non_variant/) || false;
    const name = isVariant ? `${sku.product_name} (${sku.sku_name})` : sku.product_name;
    if (name.length > 40) {
      return name.substring(0, nameStyle?.sub);
    }
    return name;
  };

  const renderSampleContent = (id: string) => {
    const existed = setting.options.find((option) => option.id === id);
    if (id === 'name') {
      return (
        <span
          className="pw-text-black pw-line-clamp-2"
          style={{
            // maxHeight: nameStyle?.maxHeight || 29,
            maxWidth: `calc(${itemWidth}px - 15px)`,
            minHeight: nameStyle?.minHeight || 23,
            fontSize: nameStyle?.fontSize || 10,
            lineHeight: (nameStyle?.lineHeight || 11) + 'px',
            width: '100%',
            textAlign: 'center',
            overflow: 'hidden',
            fontFamily: 'Roboto',
          }}
        >
          {existed && existed.value ? handleProductName() : ''}
        </span>
      );
    }
    if (id === 'price') {
      return (
        <span
          style={{
            fontSize: priceStyle?.fontSize || 9,
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            marginTop: -1,
          }}
        >
          {existed && existed.value ? `${sku ? numberFormat.format(getFinalPrice(sku)) : '100.000'}VND` : ''}
        </span>
      );
    }
  };

  const renderDisplayValue = () => {
    const existed = setting.options.find((option) => option.id === 'barcode');
    if (existed) {
      return existed.value;
    }
    return true;
  };

  useEffect(() => {
    const el = document.getElementById(`barcode-${id}`);
    if (el) {
      el.style.width = window.innerWidth + 'px';
    }
    JsBarcode(`#barcode-${id}`, sku.sku_code, {
      width: 2,
      height: barcodeOptions?.height || 45,
      displayValue: false,
      format: 'CODE128B',
      marginBottom: 1.2,
      marginTop: 1,
    });
  }, [id]);
  return (
    <div
      className="pw-flex pw-flex-col pw-items-center"
      style={{
        height: itemHeight || 'fit-content',
        width: itemWidth || '100%',
      }}
    >
      {renderSampleContent('name')}
      <div
        style={{
          maxHeight: barcodeOptions?.height || 45,
          width: `calc(${itemWidth}px - 15px)`,
          maxWidth: `calc(${itemWidth}px - 15px)`,
          // width: `calc(${itemWidth}px - 10px)`,
          // maxWidth: `calc(${itemWidth}px - 10px)`,
        }}
      >
        <canvas
          id={`barcode-${id}`}
          style={{
            height: barcodeOptions?.height || 45,
            maxHeight: barcodeOptions?.height || 45,
            width: '100%',
            maxWidth: `calc(${itemWidth}px - 15px)`,
            // width: '110%',
            // maxWidth: `calc(${itemWidth}px - 10px)`,
          }}
        />
      </div>
      {renderDisplayValue() && (
        <span
          style={{
            fontSize: barcodeOptions?.fontSize || 8,
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            marginTop: -5,
          }}
        >
          {sku?.sku_code || 'SP0001'}
        </span>
      )}
      {renderSampleContent('price')}
    </div>
  );
};

export default memo(BarcodeItem);
