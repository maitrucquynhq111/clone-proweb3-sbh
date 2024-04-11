import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill } from 'react-icons/bs';
import { wholesalePriceColumnsConfig } from './config';
import { ID_EMPTY } from '~app/configs';
import { currencyToString } from '~app/utils/helpers';
import StaticTable from '~app/components/EditableTable/StaticTable';
import { checkRangeWholesalePrice } from '~app/utils/helpers/productHelpers';
import { PackageKey } from '~app/utils/constants';

type Props = {
  name: string;
  currentPackage: string;
  setOpenUpgrade?: (value: string) => void;
  onChange?: (value: RangeWholesalePrice[]) => void;
};

const DEFAULT_WHOLE_SALE_PRICE = {
  id: ID_EMPTY,
  sku_id: ID_EMPTY,
  min_quantity: 0,
  price: 0,
};

const WholesalePrice = ({ name, currentPackage, setOpenUpgrade, onChange }: Props): JSX.Element => {
  const { control, getValues, setValue } = useFormContext();
  const { t } = useTranslation('products-form');
  const [rangeWholesalePrice, setRangeWholesalePrice] = useState<RangeWholesalePrice[]>([]);

  const skuRangeWholesalePrice = useWatch({
    control,
    name: `${name}.range_wholesale_price`,
    defaultValue: [] as RangeWholesalePrice[],
  }) as RangeWholesalePrice[];

  const handleAddWholesalePrice = () => {
    if (currentPackage === PackageKey.FREE) {
      return setOpenUpgrade?.('product_wholesales');
    }
    const sku = name ? getValues(name) : getValues();
    if (rangeWholesalePrice.length === 0) {
      return setRangeWholesalePrice((prevState) => {
        const newWholesalePrice = [
          ...prevState,
          {
            ...DEFAULT_WHOLE_SALE_PRICE,
            sku_id: sku?.id || ID_EMPTY,
            name: `${t('wholesale')} 1`,
          },
        ];
        if (name) {
          setValue(`${name}.range_wholesale_price`, newWholesalePrice);
        } else {
          setValue('range_wholesale_price', newWholesalePrice);
        }
        return newWholesalePrice;
      });
    }
    setRangeWholesalePrice((prevState) => {
      const length = rangeWholesalePrice.length;
      const newWholesalePrice = {
        ...DEFAULT_WHOLE_SALE_PRICE,
        id: ID_EMPTY,
        sku_id: sku?.id || ID_EMPTY,
        name: `${t('wholesale')} ${length + 1}`,
      };
      if (name) {
        setValue(`${name}.range_wholesale_price`, [...prevState, newWholesalePrice]);
      } else {
        setValue('range_wholesale_price', [...prevState, newWholesalePrice]);
      }
      return [...prevState, newWholesalePrice];
    });
  };

  const handleCellChange = useCallback(
    (index: number, key: string, value: string) => {
      if (index === null || index === undefined) return;
      const sku = name ? getValues(name) : getValues();
      setRangeWholesalePrice((prevState) => {
        const newRangeWholesalePrice = [...prevState];
        const wholesalePrice = newRangeWholesalePrice[index];
        if (!wholesalePrice) return prevState;
        if (key === 'min_quantity') {
          wholesalePrice.min_quantity = Number(currencyToString(value));
        }
        if (key === 'price') {
          wholesalePrice.price = Number(currencyToString(value));
        }
        // Check valid
        const result = checkRangeWholesalePrice(sku, newRangeWholesalePrice);
        onChange && onChange(result);
        return result;
      });
    },
    [name],
  );

  const handleRemoveWholesalePrice = useCallback((index: number) => {
    if (currentPackage === PackageKey.FREE) {
      return setOpenUpgrade?.('product_wholesales');
    }
    setRangeWholesalePrice((prevState) => {
      prevState.splice(index, 1);
      const newState = prevState.map((item, index) => ({
        ...item,
        name: `${t('wholesale')} ${index + 1}`,
      }));
      if (name) {
        setValue(`${name}.range_wholesale_price`, newState);
      } else {
        setValue('range_wholesale_price', newState);
      }
      return [...newState];
    });
  }, []);

  const columnConfig = useMemo(() => {
    return wholesalePriceColumnsConfig({
      t,
      currentPackage,
      onRemove: handleRemoveWholesalePrice,
      onCellChange: handleCellChange,
    });
  }, [handleRemoveWholesalePrice]);

  useEffect(() => {
    if (skuRangeWholesalePrice) {
      setRangeWholesalePrice(skuRangeWholesalePrice);
    }
  }, [skuRangeWholesalePrice]);

  return (
    <>
      {rangeWholesalePrice.length > 0 ? (
        <>
          <StaticTable columnConfig={columnConfig} data={rangeWholesalePrice} />
        </>
      ) : null}
      <button
        className={`pw-flex pw-items-center pw-justify-center pw-gap-x-2 ${
          rangeWholesalePrice.length > 0 ? 'pw-mt-4' : null
        } `}
        type="button"
        onClick={() => {
          handleAddWholesalePrice();
        }}
      >
        <BsPlusCircleFill className="pw-fill-secondary-main-blue" size={20} />
        <span className="pw-text-secondary-main-blue pw-text-sm pw-font-bold">{t('action.add_wholesale_price')}</span>
      </button>
    </>
  );
};
export default memo(WholesalePrice);
