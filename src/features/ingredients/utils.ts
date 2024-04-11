export const defaultIngredient = () => ({
  name: '',
  price: 0,
  total_quantity: 0,
  uom_id: '',
  uom_name: '',
  warning_quantity: 0,
  is_warning: false,
});

export const toPendingIngredient = ({
  data,
  id,
}: {
  data: ReturnType<typeof defaultIngredient>;
  id?: string;
}): PendingIngredient => {
  const { is_warning, uom_name, ...body } = data;
  const nextData = {
    ...body,
    name: data.name?.trim(),
    warning_quantity: is_warning ? body.warning_quantity : 0,
  };
  if (id) Object.assign(nextData, { id });

  return nextData;
};

export const toDefaultIngredient = (detail: Ingredient) => {
  return {
    name: detail.name,
    price: detail.price,
    total_quantity: detail.total_quantity,
    uom_id: detail.uom_id,
    uom_name: detail.uom.name,
    warning_quantity: detail.warning_quantity,
    is_warning: detail.warning_quantity > 0 ? true : false,
  };
};
