export function removeDuplicates(array: ExpectedAny, key: string) {
  return array.reduce((arr: ExpectedAny, item: ExpectedAny) => {
    const removed = arr.filter((i: ExpectedAny) => i[key] !== item[key]);
    return [...removed, item];
  }, []);
}

export function sortArrayByKey<T>(array: Array<T>, key: keyof T) {
  return array.sort((a: T, b: T) => {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  });
}

export function sortArrayDescByKey<T>(array: Array<T>, key: keyof T) {
  return array.sort((a: T, b: T) => {
    if (a[key] < b[key]) {
      return 1;
    }
    if (a[key] > b[key]) {
      return -1;
    }
    return 0;
  });
}
export function removeItemString(array: Array<string>, value: string) {
  const index = array.indexOf(value);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}
