import { Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import ModalWrapper from './ModalWrapper';
import { ModalTypes } from './types';

const ModalRenderer = () => {
  const [searchParams] = useSearchParams();

  const params: ExpectedAny = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const modal = searchParams.get('modal') as ModalTypes;

  return (
    (modal && (
      <Suspense fallback={<TopBarProgress />}>
        <ModalWrapper {...params} modal={modal} />
      </Suspense>
    )) || <></>
  );
};

export default ModalRenderer;
