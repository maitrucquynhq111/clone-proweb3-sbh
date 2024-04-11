// Add on
export function addToListSku(addon: SkuSelected, listAddon: SkuSelected[], quantity: number): SkuSelected[] {
  const result: SkuSelected[] = [...listAddon];
  const existedIndex = result.findIndex((item) => item.id === addon.id);
  if (existedIndex === -1 && quantity > 0) {
    result.push({ ...addon, quantity: quantity });
    return result;
  }
  const existedOrderItem = { ...result[existedIndex] } as SkuSelected;
  if (existedOrderItem) {
    existedOrderItem.quantity = quantity;
    result[existedIndex] = existedOrderItem;
  }
  if (existedOrderItem && existedOrderItem.quantity === 0) {
    result.splice(existedIndex, 1);
  }
  return result;
}

export function removeSku(addon: SkuSelected, listAddon: SkuSelected[]) {
  const result: SkuSelected[] = [...listAddon];
  return result.filter((item) => item.id !== addon.id);
}
