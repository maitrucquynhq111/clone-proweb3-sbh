import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CommentConfigDetail from './detail';
import { useCurrentPage } from '~app/features/chat-configs/hooks';
import { Header } from '~app/features/chat-configs/components';
import { EmptyStateConnectFB } from '~app/components/Icons';
import { EmptyState } from '~app/components';
import { MainRouteKeys } from '~app/routes/enums';

const CommentConfig = () => {
  const { t } = useTranslation('chat');
  const navigate = useNavigate();
  const { isEmpty, linkedPages, activePage, setActivePage } = useCurrentPage();

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
    <div className="pw-rounded">
      <Header linkedPages={linkedPages} activePage={activePage} onClick={setActivePage} />
      <div className="pw-border pw-border-t-0 pw-border-solid pw-border-neutral-divider">
        {activePage ? <CommentConfigDetail activePage={activePage} /> : null}
      </div>
    </div>
  );
};

export default CommentConfig;
