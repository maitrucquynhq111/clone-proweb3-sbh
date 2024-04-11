import cx from 'classnames';
import { ReactNode, useEffect } from 'react';
import { BsX, BsGrid3X2, BsLayoutTextSidebar } from 'react-icons/bs';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Nav, Tooltip, Whisper } from 'rsuite';
import OfflineStatus from '../OfflineStatus';
import { MainRouteKeys } from '~app/routes/enums';
import { TabKeyType, tabs, getPosMode } from '~app/features/pos/utils';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import { PosMode } from '~app/features/pos/constants';
import { POS_MODE } from '~app/configs';
import { useHasPermissions, TablePermission } from '~app/utils/shield';
import { getFinalPrice } from '~app/utils/helpers';

const Navbar = ({
  appearance,
  className = '',
}: {
  appearance: 'default' | 'subtle' | 'tabs';
  className?: string;
}): JSX.Element => {
  const canViewTableList = useHasPermissions([TablePermission.TABLE_TABLELIST_VIEW]);
  const allTabs = canViewTableList
    ? Object.values(TabKeyType)
    : Object.values(TabKeyType).filter((item) => item !== TabKeyType.TABLE);
  return (
    <Nav appearance={appearance} className={cx('pw-flex pw-items-end', className)}>
      {allTabs.map((item: TabKeyType, index: number) => {
        const { icon, name, path } = tabs()?.[item] || {};
        return (
          <NavLink
            key={`${name}-${path}`}
            to={path}
            className={({ isActive }) =>
              cx('pw-px-4 !pw-py-3 !pw-rounded-none !pw-rounded-t !pw-no-underline !pw-text-base', {
                '!pw-text-base !pw-text-black !pw-bg-white': isActive,
                '!pw-text-white !pw-bg-green-950': !isActive,
                '!pw-mr-4': index === 0,
              })
            }
          >
            <div className="pw-font-normal pw-flex pw-items-center pw-justify-center pw-gap-2">
              {icon}
              {name}
            </div>
          </NavLink>
        );
      })}
    </Nav>
  );
};

type HeaderProps = {
  children?: ReactNode;
  reservationInfo?: ReservationMeta | null;
  deliveryMethod?: string;
  classNameNavbar?: string;
};

const Header = ({ children, classNameNavbar }: HeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('pos');
  const [posMode, setPosStore] = usePosStore((store) => store.pos_mode);
  const [isWholesalePrice, setSelectedOrder] = useSelectedOrderStore((store) => store.is_wholesale_price);

  useEffect(() => {
    if (getPosMode() !== posMode) {
      return setPosStore((store) => ({ ...store, pos_mode: getPosMode() }));
    }
  }, []);

  const changeMode = () => {
    if (posMode === PosMode.FNB) {
      window.localStorage.setItem(POS_MODE, PosMode.RETAILER);
      return setPosStore((store) => ({ ...store, pos_mode: PosMode.RETAILER }));
    }
    if (isWholesalePrice) {
      setSelectedOrder((store) => {
        const newListOrderItem = store.list_order_item.map((item) => {
          const price = getFinalPrice({
            normal_price: item.product_normal_price,
            selling_price: item.product_selling_price,
          });
          return { ...item, price };
        });
        return { ...store, list_order_item: newListOrderItem, is_wholesale_price: false };
      });
    }
    window.localStorage.setItem(POS_MODE, PosMode.FNB);
    return setPosStore((store) => ({ ...store, pos_mode: PosMode.FNB }));
  };

  return (
    <div className="pw-bg-primary-main pw-flex pw-items-center pw-gap-4 pw-py-2 pw-px-3">
      <Navbar appearance="default" className={cx(`-pw-mb-2`, classNameNavbar)} />
      <div className="pw-flex-1 pw-flex pw-items-center">{children && children}</div>
      <Whisper
        placement="autoVertical"
        trigger="hover"
        speaker={
          <Tooltip className="pw-absolute" arrow={false}>
            {posMode === PosMode.FNB ? t('change-retail-mode') : t('change-fnb-mode')}
          </Tooltip>
        }
      >
        <div className="pw-p-2 pw-bg-primary-green5 pw-rounded pw-cursor-pointer pw-relative" onClick={changeMode}>
          {posMode === PosMode.FNB ? (
            <BsGrid3X2 size={24} className="pw-text-neutral-white" />
          ) : (
            <BsLayoutTextSidebar size={24} className="pw-text-neutral-white" />
          )}
        </div>
      </Whisper>
      <OfflineStatus />
      <div className="pw-text-white pw-text-3xl pw-cursor-pointer" onClick={() => navigate(MainRouteKeys.Root)}>
        <BsX />
      </div>
    </div>
  );
};

export default Header;
