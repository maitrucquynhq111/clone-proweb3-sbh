import { Outlet } from 'react-router-dom';
import { RouterSuspense, PageContainer } from '~app/components';

const ReportPage = () => {
  return (
    <PageContainer>
      <RouterSuspense>
        <Outlet />
      </RouterSuspense>
    </PageContainer>
  );
};

export default ReportPage;
