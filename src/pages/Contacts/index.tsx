import { Outlet } from 'react-router-dom';
import { RouterSuspense, PageContainer } from '~app/components';

const ContactsPage = () => {
  return (
    <PageContainer>
      <RouterSuspense>
        <Outlet />
      </RouterSuspense>
    </PageContainer>
  );
};

export default ContactsPage;
