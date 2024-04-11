import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { BsPlusCircleFill } from 'react-icons/bs';
import { linkedProductsConfig } from './config';
import { StaticTable } from '~app/components';

type Props = {
  setOpen(value: boolean): void;
};

const LinkedProductsTable = ({ setOpen }: Props) => {
  const { t } = useTranslation('product-addon-form');
  const { control, setValue, getValues } = useFormContext<PendingProductAddOnGroup>();
  const { fields: linked_products, remove } = useFieldArray({
    control,
    name: 'linked_products',
  });

  const handleRemove = useCallback((index: number, id: string) => {
    remove(index);
    const product_ids_add = getValues('product_ids_add');
    setValue('product_ids_add', [...product_ids_add.filter((item) => item !== id)]);
  }, []);

  const columnConfig = useMemo(() => {
    return linkedProductsConfig({
      t,
      onRemove: handleRemove,
    });
  }, [handleRemove]);

  return (
    <>
      {linked_products.length > 0 ? (
        <div className="pw-max-h-80 pw-overflow-auto scrollbar-sm">
          <StaticTable columnConfig={columnConfig} data={linked_products} rowKey="id" />
        </div>
      ) : null}
      <button
        className={`pw-flex pw-items-center pw-justify-center pw-gap-x-2 ${
          linked_products.length > 0 ? 'pw-mt-4' : ''
        } `}
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        <BsPlusCircleFill className="pw-fill-secondary-main-blue" size={20} />
        <span className="pw-text-secondary-main-blue pw-text-sm pw-font-bold">{t('action.add_product')}</span>
      </button>
    </>
  );
};

export default LinkedProductsTable;
