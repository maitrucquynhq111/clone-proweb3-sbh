import { memo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { paymentHistoryColumnsConfig } from './config';
import { StaticTable } from '~app/components';

const IngredientTable = () => {
  const { control } = useFormContext();
  const {
    fields: data,
    update,
    remove,
  } = useFieldArray({
    control,
    name: 'data',
  });

  const handleUpdate = (index: number, value: Ingredient) => {
    update(index, value);
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <StaticTable
      className="pw-m-5"
      columnConfig={paymentHistoryColumnsConfig({
        data: (data as Ingredient[]) || [],
        update: handleUpdate,
        remove: handleRemove,
      })}
      data={data}
    />
  );
};

export default memo(IngredientTable);
