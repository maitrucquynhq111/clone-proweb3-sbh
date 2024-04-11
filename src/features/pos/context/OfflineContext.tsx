import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { useLocation } from 'react-router-dom';
import { useNetworkState } from 'react-use';
import SyncProgressItem from '../components/SyncProgressItem';
import { useOfflineMode } from '~app/features/pos/hooks/useOfflineMode';
import { ResponseType, SyncType } from '~app/features/pos/constants';
import {
  categoryStore,
  productStore,
  productSearchStore,
  paymentSourceStore,
  orderStore,
  contactStore,
  locationStore,
  defaultFilterProduct,
} from '~app/features/pos/stores';
import { MainRouteKeys } from '~app/routes/enums';
import { useGetInvoiceSetting, useGetBusinessById, useGetPosSetting } from '~app/services/queries';
import { Loading } from '~app/components';

export const OfflineContext = createContext<{
  offlineModeWorker: ExpectedAny;
  setting: {
    invoice: ExpectedAny;
    bussiness: ExpectedAny;
    pos: ExpectedAny;
  };
  syncDataByTypes: ExpectedAny;
}>({
  offlineModeWorker: null,
  setting: {
    invoice: null,
    bussiness: null,
    pos: null,
  },
  syncDataByTypes: null,
});

export const OfflineProvider = ({ children }: ExpectedAny) => {
  const location = useLocation();
  const { online } = useNetworkState();
  const { t } = useTranslation('pos');
  const { data: invoiceSettings, isLoading: isLoadingSetting } = useGetInvoiceSetting();
  const { data: bussinessSettings, isLoading: isLoadingBussiness } = useGetBusinessById();
  const { data: posSettings, isLoading: isLoadingPos } = useGetPosSetting();
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  const isPos = location.pathname.includes(MainRouteKeys.Pos);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const { initDb, synchData, offlineModeWorker } = useOfflineMode({
    callbackFunc: (data: ExpectedAny) => {
      switch (data.action) {
        case ResponseType.ALL_CATEGORY:
          categoryStore.setCategories(data.result);
          break;
        case ResponseType.ALL_CONTACT:
          contactStore.setContacts(data.result);
          break;
        case ResponseType.SEARCH_LOCATION:
          locationStore.setLocations(data.result);
          break;
        case ResponseType.ALL_PAYMENT_SOURCE:
          paymentSourceStore.setPaymentSources(data.result);
          break;
        case ResponseType.ALL_ORDER:
          orderStore.setOrders(data.result);
          break;
        case ResponseType.DELETE_ORDER:
          orderStore.setOrders(data.result);
          break;
        case ResponseType.FILTER_PRODUCT:
          productStore.setProducts(data.result);
          break;
        case ResponseType.SEARCH_PRODUCT:
          productSearchStore.setProducts(data.result);
          break;
        case ResponseType.SYNCING:
          // setIsLoading(false);
          setIsSyncing(true);
          break;
        case ResponseType.SYNC_SUCCESS:
          // setIsLoading(false);
          setIsSyncing(false);
          break;
        default:
          break;
      }
    },
  });

  useEffect(() => {
    initDb();
    setTimeout(() => {
      synchData(defaultFilterProduct);
    }, 500);
  }, []);

  const syncDataByTypes = (types: SyncType[] = []) => {
    types.forEach((type) => {
      offlineModeWorker.postMessage({
        action: `sync-${type}`,
        data: null,
        value: null,
      });
    });
  };

  return (
    <OfflineContext.Provider
      value={{
        offlineModeWorker: offlineModeWorker,
        setting: {
          invoice: invoiceSettings,
          bussiness: bussinessSettings,
          pos: posSettings,
        },
        syncDataByTypes: syncDataByTypes,
      }}
    >
      {children}
      <div
        className={cx({
          'pw-hidden': (!isSyncing && !isLoadingSetting && !isLoadingBussiness && !isLoadingPos) || !isPos,
        })}
      >
        <Loading
          backdrop
          size="md"
          content={
            <div
              className={cx('process-sync-wrapper pw-flex pw-py-2 pw-flex-col pw-items-center', {
                'pw-hidden': !isSyncing,
              })}
            >
              <>
                <div>
                  {Object.values(SyncType).map((item) => {
                    return <SyncProgressItem key={item} name={item} />;
                  })}
                </div>

                <div
                  className={cx('!pw-text-sm pw-font-bold pw-py-4', {
                    'pw-text-red-500': !online,
                  })}
                >
                  {online ? t('sync.sync-progress-text') : t('sync.sync-error-no-network')}
                </div>
              </>
            </div>
          }
        />
      </div>
    </OfflineContext.Provider>
  );
};

export const useOfflineContext = () => useContext(OfflineContext);
