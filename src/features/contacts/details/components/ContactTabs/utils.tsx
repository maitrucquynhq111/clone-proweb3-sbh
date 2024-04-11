import { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BsInfoCircleFill,
  // BsChatDotsFill,
  BsFillPatchPlusFill,
  BsFileEarmarkTextFill,
  BsFillBookmarksFill,
} from 'react-icons/bs';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { CustomerPermission, OtherPermision, useHasPermissions } from '~app/utils/shield';

const Overview = lazy(() => import('./Overview'));
// const Message = lazy(() => import('./Message'));
const Order = lazy(() => import('./Order'));
const Points = lazy(() => import('./Points'));
const Debt = lazy(() => import('./Debt'));

export enum TabKeyType {
  OVERVIEW = 'Overview',
  // MESSAGE = 'Message',
  ORDER = 'Order',
  POINTS = 'Points',
  DEBT = 'Debt',
}

export const tabs = () => {
  const { t } = useTranslation('contact-details');
  const {
    setting: { bussiness },
  } = useOfflineContext();
  const canViewCustomerPoint = useHasPermissions([CustomerPermission.CUSTOMER_LOYALTY_VIEW]);
  const canViewDebt = useHasPermissions([OtherPermision.DEBT_LIST_ALL_VIEW]);

  return {
    [TabKeyType.OVERVIEW]: {
      name: t('details-tab.overview'),
      icon: <BsInfoCircleFill size={18} />,
      element: Overview,
      isDisplay: true,
    },
    // [TabKeyType.MESSAGE]: {
    //   name: t('details-tab.message'),
    //   icon: <BsChatDotsFill size={18} />,
    //   element: Message,
    //   isDisplay: true,
    // },
    [TabKeyType.ORDER]: {
      name: t('details-tab.order'),
      icon: <BsFileEarmarkTextFill size={18} />,
      element: Order,
      isDisplay: true,
    },
    [TabKeyType.POINTS]: {
      name: t('details-tab.points'),
      icon: <BsFillPatchPlusFill size={18} />,
      element: Points,
      isDisplay: bussiness?.is_customer_point && canViewCustomerPoint,
    },
    [TabKeyType.DEBT]: {
      name: t('details-tab.debt'),
      icon: <BsFillBookmarksFill size={18} />,
      element: Debt,
      isDisplay: canViewDebt,
    },
  };
};
