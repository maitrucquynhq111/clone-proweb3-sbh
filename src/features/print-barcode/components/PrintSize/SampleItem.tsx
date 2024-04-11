import JsBarcode from 'jsbarcode';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { memo, useEffect } from 'react';
import { numberFormat } from '~app/configs';
import { getFinalPrice } from '~app/utils/helpers';

type PrintSettingProps = {
  setting: BarcodePrintingSetting;
  sku?: SkuSelected;
};

const SampleItem = ({ setting, sku }: PrintSettingProps) => {
  const { t } = useTranslation('barcode');
  const renderSampleContent = (id: string) => {
    const existed = setting.options.find((option) => option.id === id);

    if (id === 'name') {
      const isVariant = !sku?.product_type.match(/non_variant/) || false;
      const productName = sku
        ? isVariant
          ? `${sku?.product_name} (${sku?.sku_name})`
          : sku?.product_name
        : t('print_size.product_name');
      return (
        <span
          className={cx('pw-text-sm pw-text-center pw-line-clamp-2 pw-font-roboto pw-font-medium pw-w-full', {
            'pw-opacity-0': !existed?.value,
          })}
        >
          {productName}
        </span>
      );
    }

    if (id === 'price') {
      return (
        <span
          className={cx('pw-text-sm pw-font-roboto pw-font-bold', {
            'pw-opacity-0': !existed?.value,
          })}
        >
          {sku ? numberFormat.format(getFinalPrice(sku)) : '100.000'}VND
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
    JsBarcode('#barcode-sample', sku?.sku_code || 'SP0001', {
      width: 1,
      height: 45,
      displayValue: false,
      fontSize: 11,
    });
  }, [sku?.sku_code]);

  return (
    <div className="pw-flex pw-flex-col pw-items-center pw-w-52 pw-h-fit pw-p-2 pw-mt-2 pw-border pw-border-dashed pw-border-black">
      {renderSampleContent('name')}
      <div className="pw-w-full -pw-mt-1">
        <canvas id="barcode-sample" style={{ maxHeight: 45, width: '100%' }} />
      </div>
      <span
        className={cx('pw-text-xs pw-font-roboto pw-font-bold -pw-mt-1.5', {
          'pw-opacity-0': !renderDisplayValue(),
        })}
      >
        {sku?.sku_code || 'SP0001'}
      </span>
      {renderSampleContent('price')}
    </div>
  );
};

export default memo(SampleItem);
