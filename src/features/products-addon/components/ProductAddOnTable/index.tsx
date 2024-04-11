import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { BsPlusCircleFill } from 'react-icons/bs';
import { productAddOnListConfig } from './config';
import { defaultProductAddOn } from '~app/features/products-addon/utils';
import { StaticTable } from '~app/components';

const ProductAddOnTable = () => {
  const { t } = useTranslation('product-addon-form');

  const { control, setValue, getValues } = useFormContext<PendingProductAddOnGroup>();
  const { fields: list_product_add_on, update } = useFieldArray({
    control,
    name: 'list_product_add_on',
  });

  const handleAddProductAddOn = () => {
    const list_product_add_on = getValues('list_product_add_on');
    setValue('list_product_add_on', [...list_product_add_on, defaultProductAddOn]);
  };

  const handleRemoveProductAddon = useCallback((index: number) => {
    const list_product_add_on = getValues('list_product_add_on');
    setValue('list_product_add_on', [...list_product_add_on.filter((_, itemIndex) => itemIndex !== index)]);
  }, []);

  const handleStatusChange = useCallback((index: number, value: boolean) => {
    const addon = getValues(`list_product_add_on.${index}`);
    update(index, { ...addon, is_active: value });
    setValue(`list_product_add_on.${index}.is_active`, value);
  }, []);

  const columnConfig = useMemo(() => {
    return productAddOnListConfig({
      t,
      onStatusChange: handleStatusChange,
      onRemove: handleRemoveProductAddon,
    });
  }, [handleStatusChange, handleRemoveProductAddon]);

  return (
    <div className="pw-mt-6">
      <h4 className="pw-font-bold pw-text-base pw-text-black">{t('addon_option')}</h4>
      {list_product_add_on.length > 0 ? (
        <div className="pw-mt-4 pw-max-h-80 pw-overflow-auto">
          <StaticTable columnConfig={columnConfig} data={list_product_add_on} rowKey="id" />
        </div>
      ) : null}
      <button
        className="pw-flex pw-items-center pw-justify-center pw-gap-x-2 pw-mt-4"
        type="button"
        onClick={() => {
          handleAddProductAddOn();
        }}
      >
        <BsPlusCircleFill className="pw-fill-secondary-main-blue" size={20} />
        <span className="pw-text-secondary-main-blue pw-text-sm pw-font-bold">{t('action.add_addon_option')}</span>
      </button>
    </div>
  );
};

export default ProductAddOnTable;
