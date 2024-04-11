import { useTranslation } from 'react-i18next';
import { HiChevronRight } from 'react-icons/hi';
import { useSyncExternalStore } from 'react';
import { checkDateBeforeNow } from '~app/utils/helpers';
import { PackageKey } from '~app/utils/constants';
import { packageStore } from '~app/utils/shield';

function useUserInfo() {
  const { t } = useTranslation('common');
  const packageInfo = useSyncExternalStore(packageStore.subscribe, packageStore.getSnapshot);

  const getCurrentPackage = () => {
    const isExpired = packageInfo.expire_time ? checkDateBeforeNow(packageInfo.expire_time) : false;
    return !isExpired ? packageInfo.package_key : PackageKey.FREE;
  };

  const getPackageTag = () => {
    const currentPackage = getCurrentPackage();
    switch (currentPackage) {
      case PackageKey.PLUS:
      case PackageKey.PLUS_ADVANCE:
        return (
          <div
            className="pw-relative pw-rounded-md pw-flex pw-items-center pw-justify-between
           pw-bg-gradient-to-r pw-from-[#33DAFF] pw-to-[#612ECF] pw-py-0.5 pw-px-2 pw-max-w-fit pw-overflow-hidden"
          >
            <span className="pw-text-xs pw-font-semibold pw-text-white">
              {currentPackage === PackageKey.PLUS ? t('package.plus') : t('package.plus_advance')}
            </span>
            <HiChevronRight className="pw-text-white pw-font-bold" />
            <div className="pw-absolute pw-top-0 pw-left-0 pw-h-8 pw-w-20 pw-bg-gradient-to-r pw-from-white/[.2] pw-to-white/[0] -pw-skew-y-12 pw-rotate-[-32deg]" />
          </div>
        );
      case PackageKey.PRO:
        return (
          <div
            className="pw-relative pw-rounded-md pw-flex pw-items-center pw-justify-between
           pw-bg-gradient-to-r pw-from-[#FFDB20] pw-to-[#C93535] pw-py-0.5 pw-px-2 pw-max-w-fit pw-overflow-hidden"
          >
            <span className="pw-text-xs pw-font-semibold pw-text-white">{t('package.pro')}</span>
            <HiChevronRight className="pw-text-white pw-font-bold" />
            <div className="pw-absolute pw-top-0 pw-left-0 pw-h-8 pw-w-20 pw-bg-gradient-to-r pw-from-white/[.2] pw-to-white/[0] -pw-skew-y-12 pw-rotate-[-32deg]" />
          </div>
        );
      default:
        return <></>;
    }
  };

  return { getPackageTag, getCurrentPackage };
}

export { useUserInfo };
