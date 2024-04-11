import { useState, useSyncExternalStore } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from 'rsuite';
import { useTranslation, Trans } from 'react-i18next';
import { BsXCircleFill } from 'react-icons/bs';
import { orderStore } from '../../stores';
import { useCreateOrderMutation } from '~app/services/mutations';
import { MainRouteKeys } from '~app/routes/enums';
import { IconOffline } from '~app/components/Icons';

const OnlineState = () => {
  const { t } = useTranslation('pos');
  const [searchParams] = useSearchParams();
  const isOffline = searchParams.get('mode') === 'offline';
  const orders = useSyncExternalStore(orderStore.subscribe, orderStore.getSnapshot);
  const syncing = useSyncExternalStore(orderStore.subscribe, orderStore.getSnapshotSyncing);
  const { mutateAsync } = useCreateOrderMutation();
  const [progress, setProgress] = useState<number>(0);
  const [syncSuccess, setSyncSuccess] = useState<PendingOrderForm[]>([]);
  const [syncFailed, setSyncFailed] = useState<PendingOrderForm[]>([]);

  const ordersCount = orders?.length || 0;

  const handleSyncAll = async () => {
    // orderStore.setSyncing(true);
    // await Promise.all(
    //   orders.map(async (data) => {
    //     const { id, ...orderForsubmit } = data;
    //     try {
    //       const response = await mutateAsync({ ...orderForsubmit });
    //       if (response?.status) {
    //         setSyncFailed((prevState) => [...prevState, data]);
    //       } else {
    //         setSyncSuccess((prevState) => [...prevState, data]);
    //       }
    //       setProgress((prev) => prev + 1);
    //     } catch (error) {
    //       setSyncFailed((prevState) => [...prevState, data]);
    //       setProgress((prev) => prev + 1);
    //     }
    //   }),
    // );
    // setProgress(0);
    // orderStore.setSyncing(false);
  };

  return (
    (ordersCount > 0 && (
      <div className="pw-px-4 pw-shadow pw-py-3 pw-bg-warning-background">
        <div className="pw-flex pw-items-center pw-text-red5 pw-justify-between">
          <div className="pw-flex pw-font-bold pw-text-base pw-items-center pw-gap-2">
            {syncFailed.length > 0 ? <BsXCircleFill size={24} color="#D92B2B" /> : <IconOffline />}
            <span>
              {syncing ? (
                <Trans
                  i18nKey="pos:offline-mode.online.number-orders-syncing"
                  values={{
                    progress: progress,
                    count: ordersCount,
                  }}
                />
              ) : syncFailed.length > 0 ? (
                <Trans i18nKey="pos:offline-mode.online.have-orders-out-of-stock" />
              ) : (
                <Trans
                  i18nKey="pos:offline-mode.online.number-orders-sync"
                  values={{
                    number: ordersCount,
                  }}
                />
              )}
            </span>
          </div>
          {!syncing && syncFailed.length === 0 && (
            <div className="pw-p-1 pw-flex pw-gap-1">
              {!isOffline && (
                <Button
                  as={Link}
                  className="!pw-border-blue-primary !pw-text-blue-primary"
                  to={`${MainRouteKeys.Orders}?mode=offline`}
                  appearance="ghost"
                  size="sm"
                >
                  <span className="pw-font-bold">{t('offline-mode.online.view-details')}</span>
                </Button>
              )}
              {/* <Button onClick={handleSyncAll} appearance="primary" className="!pw-bg-blue-primary" size="sm">
                <span className="pw-font-bold">{t('offline-mode.online.sync-all')}</span>
              </Button> */}
            </div>
          )}
        </div>
        <div className="pw-pl-8 pw-text-sm">
          {syncing ? (
            <div className="pw-py-2">
              <div className="pw-w-full pw-bg-neutral-white pw-rounded-full pw-h-2">
                <div
                  className="pw-bg-blue-primary pw-h-2 pw-rounded-full"
                  style={{
                    width: `${(progress / ordersCount) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ) : syncFailed.length === 0 ? (
            <div className="pw-text-red5">{t('offline-mode.online.notice-sync')}</div>
          ) : (
            <></>
          )}
        </div>
      </div>
    )) || <></>
  );
};

export default OnlineState;
