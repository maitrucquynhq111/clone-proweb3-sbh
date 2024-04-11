import { Outlet } from 'react-router-dom';
import { RouterSuspense, PageContainer } from '~app/components';

const StaffPage = () => {
  return (
    <PageContainer>
      <RouterSuspense>
        <Outlet />
      </RouterSuspense>
    </PageContainer>
  );
};

export default StaffPage;
