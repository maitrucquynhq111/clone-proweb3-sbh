import { useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { Button } from 'rsuite';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useTranslation } from 'react-i18next';
import { ConfirmModal, UpgradePackageModal } from '~app/components';
import { UPSELL_FB_APP_ID, SBH_FB_APP_ID, IS_UPSELL } from '~app/configs';
import { queryClient } from '~app/configs/client';
import { useLinkMetaMutation, useLogoutMetaMutation } from '~app/services/mutations';
import { CURRENT_LINK_PAGE_KEY } from '~app/services/queries';
import { parseBool } from '~app/utils/helpers';
import { NotConnectModal } from '~app/features/chat-pages/components';
import { PackageKey } from '~app/utils/constants';
import { usePackage } from '~app/utils/shield/usePackage';
import { validateCanAccess } from '~app/features/chat-pages/utils';

type Props = {
  isCommingSoon?: boolean;
  isReady: boolean;
  block?: boolean;
  linkedPages?: ExpectedAny;
  onOpenChannel?: () => void;
};

const FacebookBtn = ({ isCommingSoon, isReady, block = false, linkedPages = [], onOpenChannel }: Props) => {
  const { t } = useTranslation('chat');
  const isUpsell = parseBool(IS_UPSELL);

  const [openDisconnect, setOpenDisconnect] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openUpgrade, setOpenUpgrade] = useState(false);
  const { mutateAsync, isLoading } = useLinkMetaMutation();
  const { currentPackage, description } = usePackage(
    [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
    'customer_connect_fanpage',
  );
  const { mutateAsync: mutateAsyncLogout, isLoading: isLoadingLogout } = useLogoutMetaMutation();

  const onConnectMeta = async (token: string) => {
    await mutateAsync({
      token: token,
      isUpsell: isUpsell,
    } as ExpectedAny);
    queryClient.invalidateQueries([CURRENT_LINK_PAGE_KEY], { exact: false });
    onOpenChannel?.();
  };

  const onDisconnectMeta = async () => {
    await mutateAsyncLogout();
    setOpenDisconnect(false);
    queryClient.invalidateQueries([CURRENT_LINK_PAGE_KEY], { exact: false });
  };

  return (
    <>
      <div className="pw-flex pw-gap-2">
        <FacebookLogin
          appId={isUpsell ? UPSELL_FB_APP_ID : SBH_FB_APP_ID}
          scope="pages_show_list,pages_messaging,pages_read_engagement,pages_manage_metadata,pages_read_user_content"
          callback={(response: ExpectedAny) => {
            if (response?.accessToken) {
              const token = response.accessToken as string;
              onConnectMeta(token);
            } else {
              setOpenModal(true);
            }
          }}
          version="8.0"
          render={(renderProps: ExpectedAny) => (
            <Button
              onClick={() => {
                const canAccess = validateCanAccess({ linkedPages, currentPackage });
                if (!canAccess) return setOpenUpgrade(true);
                renderProps.onClick();
              }}
              appearance={isReady ? 'ghost' : 'primary'}
              disabled={isLoading || isLoadingLogout || isCommingSoon}
              loading={isLoading}
              size={isReady ? 'sm' : 'md'}
              color={isReady ? 'blue' : 'green'}
              block={block}
              startIcon={isReady ? <BsPlus size={20} /> : <></>}
            >
              <span className="pw-font-bold">{isReady ? t('action.connect_more') : t('action.connect_page')}</span>
            </Button>
          )}
        />
        {isReady && (
          <Button appearance="ghost" onClick={() => setOpenDisconnect(true)} className="pw-button-secondary" size="sm">
            <span className="pw-font-bold pw-text-neutral-primary">{t('action.logout')}</span>
          </Button>
        )}
      </div>

      {openDisconnect && (
        <ConfirmModal
          open={true}
          title={t('modal.logout_meta_title')}
          description={`${t('modal.logout_meta_description')} ?`}
          cancelText={t('common:back') || ''}
          confirmText={t('action.logout') || ''}
          onConfirm={onDisconnectMeta}
          isLoading={isLoadingLogout}
          onClose={() => setOpenDisconnect(false)}
        />
      )}
      {openUpgrade && (
        <UpgradePackageModal
          description={description}
          onConfirm={() => setOpenUpgrade(false)}
          onClose={() => setOpenUpgrade(false)}
        />
      )}
      {openModal && <NotConnectModal open={openModal} onClose={() => setOpenModal(false)} />}
    </>
  );
};

export default FacebookBtn;
