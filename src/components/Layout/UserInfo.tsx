import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Popover, IconButton, Avatar, Whisper } from 'rsuite';
import { BsChevronDown, BsGift } from 'react-icons/bs';
// import SettingIcon from '@rsuite/icons/Setting';
import ExitIcon from '@rsuite/icons/Exit';
import Business from './Business';
import { useCacheMeQuery, useGetTrainerInfo } from '~app/services/queries';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  BUSINESS_KEY,
  REACT_QUERY_OFFLINE_CACHE,
  PENDING_ORDERS,
  BUSINESS_DOMAIN,
} from '~app/configs';
import { handleLogout } from '~app/utils/helpers';
import { MainRouteKeys } from '~app/routes/enums';
import { useUserInfo } from '~app/utils/hooks';
import { PackageKey } from '~app/utils/constants';

const renderMenu = ({ onClose, left, top, className }: ExpectedAny, ref: ExpectedAny) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { data: trainerInfo } = useGetTrainerInfo();

  const onLogout = async () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(BUSINESS_KEY);
    localStorage.removeItem(BUSINESS_DOMAIN);
    localStorage.removeItem(REACT_QUERY_OFFLINE_CACHE);
    localStorage.removeItem(PENDING_ORDERS);
    handleLogout();
  };

  const handleSelect = () => {
    onClose();
  };

  return (
    <Popover ref={ref} className={className} style={{ left, top }} full>
      <Dropdown.Menu className="pw-w-56" onSelect={handleSelect}>
        {/* <Dropdown.Item icon={<SettingIcon />}>{t('setting')}</Dropdown.Item> */}
        {trainerInfo ? (
          <>
            <Dropdown.Item className="!pw-flex !pw-items-center" onClick={() => navigate(MainRouteKeys.Commission)}>
              <BsGift className="rs-icon" />
              {t('route:commission.title')}
            </Dropdown.Item>
            <Dropdown.Item divider className="!pw-mb-0" />
          </>
        ) : null}
        <div className="pw-max-h-96 pw-overflow-auto">
          <Business />
        </div>
        <Dropdown.Item divider className="!pw-mt-0" />
        <Dropdown.Item onClick={onLogout} icon={<ExitIcon />} className="pw-text-red-600">
          {t('logout')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  );
};

export default function UserInfo() {
  const { data } = useCacheMeQuery();
  const { user_info, business_info } = data || {};
  const { getPackageTag, getCurrentPackage } = useUserInfo();
  return (
    <Whisper placement="bottomEnd" trigger="click" speaker={renderMenu}>
      <IconButton
        appearance="subtle"
        icon={
          <div className="pw-flex pw-items-center">
            <Avatar size="md" src={business_info?.current_business?.avatar} circle alt="avatar" className="pw-mr-4" />
            <div className="pw-flex pw-items-start">
              <div className="pw-max-w-[112px]">
                <p className="pw-text-left pw-text-sm pw-font-semibold pw-text-neutral-secondary pw-mb-0.5 line-clamp-1">
                  {business_info?.current_business?.name || user_info?.full_name}
                </p>
                {getCurrentPackage() === PackageKey.FREE ? (
                  <p className="pw-text-sm pw-text-neutral-secondary pw-mt-0 pw-text-left">{user_info?.full_name}</p>
                ) : (
                  getPackageTag()
                )}
              </div>
              <span className="pw-ml-2 pw-mt-1">
                <BsChevronDown />
              </span>
            </div>
          </div>
        }
      />
    </Whisper>
  );
}
