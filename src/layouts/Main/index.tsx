import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import { ModalRenderer } from '~app/modals';
import { useCurrentPath } from '~app/utils/hooks';
import { Header, SideBar, PageHeader } from '~app/components';
import { OfflineProvider } from '~app/features/pos/context/OfflineContext';
import { OfflineMode } from '~app/features/pos/components';
import withAuth from '~app/layouts/Main/callback';

const MainLayout = (): JSX.Element => {
  const { currentPage } = useCurrentPath();
  const { hideHeader, hidePageHeader, hideSideBar, hidePageTitle, hideNavHeader } = currentPage || {};

  return (
    <OfflineProvider>
      <main className="pw-flex">
        {!hideSideBar && <SideBar />}
        <div className="pw-flex-1 pw-flex pw-flex-col pw-max-w-full pw-overflow-x-auto">
          {!hideHeader && <Header />}
          {!hideHeader && <OfflineMode />}
          <PageHeader hidePageHeader={hidePageHeader} hidePageTitle={hidePageTitle} hideNavHeader={hideNavHeader} />
          <div className="pw-flex-1">
            <Suspense fallback={<TopBarProgress />}>
              <>
                <Outlet />
                <ModalRenderer />
              </>
            </Suspense>
          </div>
        </div>
      </main>
    </OfflineProvider>
  );
};

export default withAuth(MainLayout);
