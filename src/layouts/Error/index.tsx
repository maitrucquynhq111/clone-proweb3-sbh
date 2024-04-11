import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { Loading } from '~app/components';

const ErrorLayout = (): JSX.Element => {
  return (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  );
};

export default ErrorLayout;
