import { Outlet } from 'react-router-dom';
import { PageContainer, RouterSuspense } from '~app/components';

const ContactsPage = () => (
  <PageContainer>
    <RouterSuspense>
      <Outlet />
    </RouterSuspense>
  </PageContainer>
);

export default ContactsPage;
