import { v4 } from 'uuid';
import { memo, useCallback, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useDebounce } from 'react-use';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill } from 'react-icons/bs';
import VariantItem from '~app/features/products/components/Variant/VariantItem';
import VariantTable from '~app/features/products/components/Variant/VariantTable';
import { createSku } from '~app/features/products/utils';
import { checkInValidSkuAttributes, createSkusFromAttributes } from '~app/utils/helpers/productHelpers';

const MAX_ATTRIBUTE = 2;

type Props = {
  name: string;
};

const VariantList = ({ name }: Props) => {
  const { t } = useTranslation('products-form');
  const { getValues, setValue, clearErrors, getFieldState, control } = useFormContext();
  const [showTable, setShowTable] = useState(false);

  const sku_attributes = useWatch({
    control,
    name,
    defaultValue: [] as PendingSkuAttribute[],
  }) as PendingSkuAttribute[];

  const handleCreateAttribute = () => {
    setValue(name, [...sku_attributes, { id: v4(), attribute: [], attribute_type: '' }]);
  };

  const handleRemoveAttribute = (index: number) => {
    const sku_attributes = getValues(name) as PendingSkuAttribute[];
    sku_attributes.splice(index, 1);
    clearErrors(`${name}.${index}`);
    setValue(name, sku_attributes);
    if (sku_attributes.length === 0) {
      setValue('skus', [{ ...createSku({}) }]);
      setValue('is_variant', false);
      setShowTable(false);
    }
  };

  const handleSkuAtrributesChange = useCallback((sku_attributes: PendingSkuAttribute[]) => {
    const { error } = getFieldState(name);
    if (error) {
      return setShowTable(false);
    }
    if (checkInValidSkuAttributes(sku_attributes)) {
      return setShowTable(false);
    }
    const skus = createSkusFromAttributes(sku_attributes, getValues('skus'), getValues('is_advance_stock'));
    const invalidSkus = skus.some((sku) => !sku?.attribute_types);
    if (invalidSkus) {
      setShowTable(false);
    } else {
      setShowTable(true);
    }
    setValue('skus', skus);
  }, []);

  useDebounce(
    () => {
      handleSkuAtrributesChange(sku_attributes);
    },
    300,
    [sku_attributes],
  );

  return (
    <>
      {sku_attributes.length > 0 ? (
        <>
          <h3 className="pw-font-bold pw-text-sm pw-text-green-500 pw-mt-4 pw-mb-2">{/* {t('variant')} */}</h3>
        </>
      ) : null}
      <div>
        {sku_attributes.map((attribute, index) => {
          return (
            <VariantItem key={attribute.id} index={index} name={`${name}.${index}`} onRemove={handleRemoveAttribute} />
          );
        })}
      </div>
      {sku_attributes.length < MAX_ATTRIBUTE ? (
        <button
          className="pw-flex pw-items-center pw-justify-center pw-gap-x-2 pw-mt-4"
          type="button"
          onClick={() => {
            setValue('is_variant', true);
            handleCreateAttribute();
          }}
        >
          <BsPlusCircleFill className="pw-fill-secondary-main-blue" size={20} />
          <span className="pw-text-secondary-main-blue pw-text-sm pw-font-bold">{t('action.add_variant')}</span>
        </button>
      ) : null}
      {showTable ? (
        <>
          <h3 className="pw-font-bold pw-text-sm pw-text-green-500 pw-mt-4 pw-mb-2">{/* {t('variant_list')} */}</h3>
          <VariantTable sku_attributes={sku_attributes} />
        </>
      ) : null}
    </>
  );
};

export default memo(VariantList);
