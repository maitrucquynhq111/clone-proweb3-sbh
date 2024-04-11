import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { changeLanguage, Language } from '~app/i18n';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, BUSINESS_KEY, BUSINESS_DOMAIN, PENDING_ORDERS } from '~app/configs';
import { getAccessToken, shouldRefresh, handleLogin } from '~app/utils/helpers';
import { Loading } from '~app/components';
import { permissionStore, subscriptionPlanStore, packageStore } from '~app/utils/shield';
import {
  useMeQuery,
  useGetCurrentPermission,
  useGetTrainerInfo,
  useSubscriptionPlan,
  useUserInfoQuery,
} from '~app/services/queries';
import { useSwitchBussinessMutation } from '~app/services/mutations';
import {
  productStore,
  productSearchStore,
  categoryStore,
  locationStore,
  contactStore,
  paymentSourceStore,
  orderStore,
} from '~app/features/pos/stores';
import { queryClient } from '~app/configs/client';
import { PackageKey } from '~app/utils/constants';

const withAuth = (WrappedComponent: ExpectedAny) => {
  const Auth = () => {
    const [searchParams] = useSearchParams();
    const step = searchParams.get('step');
    const lng = searchParams.get('lng');
    const refreshToken = searchParams.get('token');

    const { isLoading, data, isLoadingError, isFetching } = useMeQuery();
    const { data: userInfo } = useUserInfoQuery();
    const { data: trainerInfo } = useGetTrainerInfo();
    const { mutateAsync } = useSwitchBussinessMutation();

    const {
      data: permissionsData,
      isLoading: isLoadingPermissions,
      isLoadingError: isLoadingErrorPermissions,
      isFetching: isFetchingPermissions,
    } = useGetCurrentPermission(data?.user_info?.id || '');
    const { data: subscriptionPlan } = useSubscriptionPlan();

    const handleSwitchBusiness = useCallback(async (business_id: string) => {
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
        }
      }
    }, []);

    useEffect(() => {
      if (data) {
        const localBusinessId = localStorage.getItem(BUSINESS_KEY);
        const currentBusiness = data.business_info?.current_business;

        // If local businessid not equal current bussiessid -> switch business
        if (localBusinessId && currentBusiness?.id && currentBusiness.id !== localBusinessId) {
          handleSwitchBusiness(currentBusiness.id);
          return;
        }

        if (currentBusiness) {
          localStorage.setItem(BUSINESS_KEY, currentBusiness.id);
          localStorage.setItem(BUSINESS_DOMAIN, currentBusiness.domain);
        }
      }
    }, [data, handleSwitchBusiness]);

    useEffect(() => {
      if (permissionsData) {
        if (permissionsData?.permissions) {
          permissionStore.updatePermission({
            ...permissionsData?.permissions,
            comission_all_view: trainerInfo ? true : false,
          });
        }
      }
    }, [permissionsData]);

    useEffect(() => {
      if (subscriptionPlan) {
        subscriptionPlanStore.setSubscriptionPlan(subscriptionPlan);
      }
    }, [subscriptionPlan]);

    useEffect(() => {
      if (userInfo && userInfo?.history_registration_pro) {
        packageStore.setPackage({
          package_key: userInfo.history_registration_pro.package_key || PackageKey.FREE,
          expire_time: userInfo.history_registration_pro?.expire_time || '',
        });
      }
    }, [userInfo]);

    useEffect(() => {
      if (lng) {
        changeLanguage(lng as Language);
      }
    }, []);

    useEffect(() => {
      async function verifyLogin() {
        if (step && refreshToken) {
          if (typeof step !== 'string') {
            throw new Error('URL_IS_INVALID');
          }
          if (step === 'success' && refreshToken) {
            if (typeof refreshToken !== 'string') {
              throw new Error('REFRESH_TOKEN_IS_INVALID');
            }
            if (refreshToken) {
              // if (data?.business_info.current_role.is_owner) {
              localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
              localStorage.setItem(ACCESS_TOKEN_KEY, refreshToken);
              // }
            }
          }
        } else {
          const token = await getAccessToken();
          if (!token || shouldRefresh(token)) {
            handleLogin();
          }
        }
      }
      verifyLogin();
    }, []);

    if (
      isLoading ||
      isLoadingError ||
      isFetching ||
      isLoadingPermissions ||
      isLoadingErrorPermissions ||
      isFetchingPermissions
    )
      return <Loading backdrop={true} vertical={true} />;

    return <WrappedComponent />;
  };

  return Auth;
};

export default withAuth;
