export function renderListSelectUom(ingredient: Ingredient) {
  return [
    {
      value: ingredient.uom.id,
      label: ingredient.uom.name,
      is_standard: ingredient.uom.is_standard,
    },
    {
      ...ingredient.uom?.sub_uom,
      label: ingredient.uom?.sub_uom?.name,
      value: ingredient.uom.sub_uom?.to_uom_id || '',
    },
  ];
}

export function getExistedSelect(selected: ExpectedAny, ingredientId: string) {
  let existed: ExpectedAny = null;
  let existedIndex = -1;
  selected.forEach((s: ExpectedAny, index: number) => {
    if (s?.ingredient_id === ingredientId || s.id === ingredientId) {
      existed = s;
      existedIndex = index;
    }
  });
  return { existed, existedIndex };
}
