import { PackageKey } from '~app/utils/constants/index';

export function getLimitLinkedPageFb(packageKey: string) {
  switch (packageKey) {
    case PackageKey.PRO:
      return Infinity;
    case PackageKey.PLUS:
    case PackageKey.PLUS_ADVANCE:
      return 3;
    case PackageKey.FREE:
    default:
      return 1;
  }
}

export const validateCanAccess = ({
  linkedPages,
  currentPackage,
}: {
  linkedPages: ExpectedAny;
  currentPackage: string;
}) => {
  const countFBPages = linkedPages.reduce(
    (acc: ExpectedAny, curr: ExpectedAny) => acc + (curr.provider === Provider.Meta ? 1 : 0),
    0,
  );
  // Allow Free connect 1 Meta fanpage & Plus/Plus+ connect 3 Meta fanpage
  if (
    (countFBPages >= 1 && currentPackage === PackageKey.FREE) ||
    (countFBPages >= 3 && (currentPackage === PackageKey.PLUS || currentPackage === PackageKey.PLUS_ADVANCE))
  ) {
    return false;
  }
  return true;
};

export enum Provider {
  Meta = 'meta',
  Zalo = 'zalo',
  Shopee = 'shopee',
  Tiktok = 'tiktok',
}
