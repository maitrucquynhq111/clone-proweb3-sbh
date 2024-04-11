import { useEffect, useState } from 'react';
import { Button } from 'rsuite';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { BsPlus } from 'react-icons/bs';
import ZaloPopup from './ZaloPopup';
import { ConfirmModal } from '~app/components';
import { useGetZaloTokenMutation, useLinkZaloMutation, useLogoutZaloMutation } from '~app/services/mutations';
import { generateZaloCodeChallenge, parseBool } from '~app/utils/helpers';
import { ZALO_APP_ID, IS_UPSELL } from '~app/configs';
import { queryClient } from '~app/configs/client';
import { CURRENT_LINK_PAGE_KEY } from '~app/services/queries';
import { NotConnectModal } from '~app/features/chat-pages/components';

type Props = {
  isCommingSoon?: boolean;
  isReady: boolean;
  onOpenChannel?: () => void;
  block?: boolean;
};

const ZaloBtn = ({ isCommingSoon, isReady, onOpenChannel, block = false }: Props) => {
  const { t } = useTranslation('chat');
  const isUpsell = parseBool(IS_UPSELL);

  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const [openPopup, setOpenPopup] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openDisconnect, setOpenDisconnect] = useState(false);

  const { verifier, challenge } = generateZaloCodeChallenge();
  const { isLoading: isLoadingZalo, mutateAsync: mutateAsyncZalo } = useGetZaloTokenMutation();
  const { mutateAsync: mutateAsyncLogout, isLoading: isLoadingLogout } = useLogoutZaloMutation();
  const { mutateAsync, isLoading } = useLinkZaloMutation();

  const onConnectZalo = async (token: string, refreshToken: string) => {
    await mutateAsync({
      token: token,
      refreshToken: refreshToken,
      isUpsell: isUpsell,
    } as ExpectedAny);
    queryClient.invalidateQueries([CURRENT_LINK_PAGE_KEY], { exact: false });
    onOpenChannel?.();
  };

  const handleLogin = () => {
    setOpenPopup(true);
  };

  const handleAuthCode = () => {
    setOpenPopup(false);
  };

  const onDisconnectZalo = async () => {
    await mutateAsyncLogout();
    setOpenDisconnect(false);
    queryClient.invalidateQueries([CURRENT_LINK_PAGE_KEY], { exact: false });
  };

  (window as ExpectedAny).handleSignInWithZalo = async (code: string, state: string) => {
    try {
      const token = await mutateAsyncZalo({
        code: code,
        verifier: state,
      } as ExpectedAny);
      if (token?.access_token) {
        onConnectZalo(token?.access_token || '', token?.refresh_token || '');
      }
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  // (window as ExpectedAny).handleCallBackFailed = async () => {
  //   console.log('12121212');
  //   setOpenPopup(false);
  //   window.close();
  // };

  useEffect(() => {
    (async function () {
      if (!code || !state) return;
      window.opener.handleSignInWithZalo(code, state);
      setOpenPopup(false);
      window.close();
    })();
  }, [code, state]);

  return (
    <>
      <div className="pw-flex pw-gap-2">
        <Button
          appearance={isReady ? 'ghost' : 'primary'}
          disabled={isCommingSoon || isLoading || isLoadingZalo}
          onClick={handleLogin}
          loading={isLoading || isLoadingZalo}
          size={isReady ? 'sm' : 'md'}
          color={isReady ? 'blue' : 'green'}
          className={cx('!pw-font-bold', {
            '!pw-text-neutral-disable !pw-bg-transparent-4 !pw-opacity-100': isCommingSoon,
          })}
          block={block}
          startIcon={isReady ? <BsPlus size={20} /> : <></>}
        >
          {isReady ? t('action.connect_more') : t('action.connect_page')}
        </Button>
        {isReady && (
          <Button appearance="ghost" onClick={() => setOpenDisconnect(true)} className="pw-button-secondary" size="sm">
            <span className="pw-font-bold pw-text-neutral-primary">{t('action.logout')}</span>
          </Button>
        )}
      </div>
      <ZaloPopup
        open={openPopup}
        requestUrl={`https://oauth.zaloapp.com/v4/oa/permission?app_id=${ZALO_APP_ID}&code_challenge=${challenge}&redirect_uri=${encodeURIComponent(
          window.location.href,
        )}&state=${verifier}`}
        onClose={handleAuthCode}
      />
      {openDisconnect && (
        <ConfirmModal
          open={true}
          title={t('modal.logout_meta_title')}
          description={`${t('modal.logout_zalo_description')} ?`}
          cancelText={t('common:back') || ''}
          confirmText={t('action.logout') || ''}
          onConfirm={onDisconnectZalo}
          isLoading={isLoadingLogout}
          onClose={() => setOpenDisconnect(false)}
        />
      )}
      {openModal && <NotConnectModal open={openModal} onClose={() => setOpenModal(false)} />}
    </>
  );
};

export default ZaloBtn;
