import cx from 'classnames';
import { Avatar, Dropdown } from 'rsuite';
import { useNavigate, useLocation } from 'react-router';
import { useSwitchBussinessMutation } from '~app/services/mutations';
import { useCacheMeQuery } from '~app/services/queries';
import { BUSINESS_KEY, ACCESS_TOKEN_KEY, PENDING_ORDERS, BUSINESS_DOMAIN } from '~app/configs';
import { MainRouteKeys } from '~app/routes/enums';
import { queryClient } from '~app/configs/client';
import {
  productStore,
  productSearchStore,
  categoryStore,
  locationStore,
  contactStore,
  paymentSourceStore,
  orderStore,
} from '~app/features/pos/stores';

export default function Business() {
  const { data } = useCacheMeQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync } = useSwitchBussinessMutation();

  const { business_info } = data || {};

  const availableBusinesses = business_info?.list_business || [];

  const currentBusiness = business_info?.current_business;

  const handleSwitchBusiness = async (business_id: string, isOwner: boolean) => {
    const result = await mutateAsync({
      business_id: business_id,
    } as ExpectedAny);
    if (result) {
      const newBusinessId = result?.current_business?.id;
      const newToken = result?.refresh_token;
      if (newBusinessId && newToken) {
        localStorage.setItem(BUSINESS_KEY, newBusinessId);
        localStorage.setItem(BUSINESS_DOMAIN, result?.current_business?.domain);
        localStorage.setItem(ACCESS_TOKEN_KEY, newToken);
        localStorage.removeItem(PENDING_ORDERS);
        queryClient.invalidateQueries();
        productStore.setProducts([]);
        productSearchStore.setProducts([]);
        categoryStore.setCategories([]);
        locationStore.setLocations([]);
        contactStore.setContacts([]);
        paymentSourceStore.setPaymentSources([]);
        orderStore.setOrders([]);
        if (!isOwner) {
          return navigate(MainRouteKeys.Root, {
            replace: true,
          });
        }
        if (location.pathname.includes(MainRouteKeys.ChatInbox)) {
          navigate(MainRouteKeys.ChatInbox, {
            replace: true,
          });
        }
      }
    }
  };

  return (
    (availableBusinesses.length > 0 && (
      <>
        {availableBusinesses.map((item: ShortenBusiness) => {
          const isActive = currentBusiness?.id === item.business_id;
          return (
            <Dropdown.Item
              key={item.business_id}
              disabled={isActive}
              className={cx('!pw-flex pw-items-center pw-gap-2 pw-w-full', {
                ['pw-bg-gray-100']: isActive,
              })}
              onClick={() => !isActive && handleSwitchBusiness(item.business_id, item.is_owner)}
            >
              <div className="pw-w-8 pw-h-8">
                <Avatar
                  circle
                  key={item.business_id}
                  src={item?.avatar}
                  size="sm"
                  alt={item.user_name}
                  className="pw-w-full pw-h-full"
                />
              </div>
              <div className="pw-text-sm line-clamp-1">{item.user_name}</div>
            </Dropdown.Item>
          );
        })}
      </>
    )) || <></>
  );
}
