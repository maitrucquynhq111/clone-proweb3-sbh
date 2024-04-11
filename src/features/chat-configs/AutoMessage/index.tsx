import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AutoMessageDetails from './details';
import { Header } from '~app/features/chat-configs/components';
import { EmptyStateConnectFB } from '~app/components/Icons';
import { useGetAutoMessage } from '~app/services/queries';
import { EmptyState } from '~app/components';
import { MainRouteKeys } from '~app/routes/enums';
import { useCurrentPage } from '~app/features/chat-configs/hooks';

const AutoMessage = () => {
  const { t } = useTranslation('chat');
  const navigate = useNavigate();
  const { isEmpty, linkedPages, activePage, setActivePage } = useCurrentPage();
  const { data } = useGetAutoMessage({ business_has_page_id: activePage?.id || '' });

  if (isEmpty) {
    return (
      <EmptyState
        icon={<EmptyStateConnectFB />}
        description1={t('empty_state_connect_fb')}
        textBtn={t('action.connect_now') || ''}
        onClick={() => navigate(MainRouteKeys.ChatConfigsPages)}
      />
    );
  }

  return (
    <div className="pw-border pw-rounded pw-border-neutral-divider">
      <Header linkedPages={linkedPages} activePage={activePage} onClick={setActivePage} />
      <div className="pw-p-6 pw-gap-4">
        {activePage && <AutoMessageDetails activePage={activePage} detail={data} setActivePage={setActivePage} />}
      </div>
    </div>
  );
};

export default AutoMessage;
