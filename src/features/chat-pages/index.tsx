import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Provider } from './utils';
import { ChatConnect, Loading, ConnectPages } from './components';
import { Loading as LoadingPage } from '~app/components';
import { useGetAllCurrentLinkPage } from '~app/services/queries';
import { CustomerPermission, useHasPermissions } from '~app/utils/shield';
// import { CustomerPermission, useHasPermissions } from '~app/utils/shield';

const ChatPages = () => {
  const [searchParams] = useSearchParams();

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const { data, refetch, isLoading, isError } = useGetAllCurrentLinkPage();
  const [showInital, setShowInital] = useState<boolean>(false);

  const canEditFanpage = useHasPermissions([CustomerPermission.CUSTOMER_CONNECT_FANPAGE_VIEW]);

  const handleShowInital = () => {
    refetch();
    setShowInital(true);
  };

  const handleOpenChannel = () => {
    setShowInital(false);
  };

  const isFacebookReady = data && (data || []).find((item) => item.provider === Provider.Meta);
  const isZaloReady = data && (data || []).find((item) => item.provider === Provider.Zalo);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : isError || !data || showInital || (code && state) ? (
        <ChatConnect
          isHaveConnected={!!isFacebookReady || !!isZaloReady}
          isFacebookReady={!!isFacebookReady}
          isZaloReady={!!isZaloReady}
          canEdit={canEditFanpage}
          linkedPages={data || []}
          onOpenChannel={handleOpenChannel}
        />
      ) : (
        <ConnectPages
          refetch={refetch}
          providers={data || []}
          isLoading={isLoading}
          canEdit={canEditFanpage}
          handleShowInital={handleShowInital}
        />
      )}
      {code && state ? <LoadingPage backdrop={true} /> : <></>}
    </>
  );
};

export default ChatPages;
