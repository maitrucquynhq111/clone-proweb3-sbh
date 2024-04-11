import { Outlet } from 'react-router-dom';
import { RouterSuspense } from '~app/components';

const ChatPage = () => {
  return (
    <RouterSuspense >
      <Outlet />
    </RouterSuspense>
  );
};

export default ChatPage;
