import { Outlet } from 'react-router-dom';
import { RouterSuspense, PageContainer } from '~app/components';

const CashbookPage = () => {
  return (
    <PageContainer>
      <RouterSuspense>
        <Outlet />
      </RouterSuspense>
    </PageContainer>
  );
};

export default CashbookPage;
