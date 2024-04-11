export const buildSortByQuery = (orderBy: SorterProps) => {
  return orderBy?.direction
    ? {
        sort: orderBy?.id || '',
        order: orderBy.direction || null,
      }
    : { sort: '' };
};

export function isDeepEqual<T>(value: T, other: T): ExpectedAny {
  if (value === undefined) value = other;
  if (Array.isArray(value) && Array.isArray(other)) {
    let result = true;
    for (let i = 0; i < (value.length + other.length) / 2; i++) {
      if (isDeepEqual(value[i], other[i]) === false) {
        result = false;
        break;
      }
    }
    return result;
  }
  if (value !== null && typeof value == 'object' && other !== null && typeof other == 'object') {
    let result = true;
    for (const key of new Set([...Object.keys(value), ...Object.keys(other)])) {
      const firstValue = value[key as keyof typeof value];
      const secondValue = other[key as keyof typeof other];
      if (isDeepEqual(firstValue, secondValue) === false) {
        result = false;
      }
    }
    return result;
  }
  return value === other;
}

type IError = {
  message: string;
};

function isErrorLike(ex: unknown): ex is IError {
  return !!ex && typeof ex === 'object' && 'message' in ex;
}

export function getErrorMessage(ex: unknown) {
  if (isErrorLike(ex)) {
    return ex.message;
  }

  if (typeof ex === 'object') {
    // NOT EXPECTED
    return JSON.stringify(ex);
  }

  return String(ex);
}

export function generateFullLocation({
  location,
  showAddress = true,
}: {
  location: ExpectedAny;
  showAddress?: boolean;
}) {
  if (!location) return '';
  if (typeof location === 'string') return location;
  const array = [location.province_name, location.district_name, location.ward_name];
  let result = array.reduce((acc, curr) => {
    return curr ? `, ${curr}` + acc : acc;
  }, '');
  if (!location.address || !showAddress) {
    result = result.slice(1);
  }
  return showAddress ? `${location.address}${result}` : result;
}

export function memoize<R, T extends (...args: ExpectedAny[]) => R>(f: T): T {
  const memory = new Map<string, R>();

  const g = (...args: ExpectedAny[]) => {
    if (!memory.get(args.join())) {
      memory.set(args.join(), f(...args));
    }

    return memory.get(args.join());
  };

  return g as T;
}

export function createTableColumn(id: string, label: string): Column {
  return { id, label, checked: true };
}
