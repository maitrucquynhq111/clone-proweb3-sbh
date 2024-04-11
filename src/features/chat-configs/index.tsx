import { Outlet } from 'react-router-dom';
import { MenuConfigs } from './components';
import { RouterSuspense } from '~app/components';

const ChatConfigs = () => {
  return (
    <div className="pw-flex pw-h-full">
      <MenuConfigs />
      <div className="pw-flex-1 pw-h-full">
        <RouterSuspense>
          <Outlet />
        </RouterSuspense>
      </div>
    </div>
  );
};

export default ChatConfigs;
