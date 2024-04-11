import { Suspense } from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';
import ModalWrapper from './ModalWrapper';
import { ModalTypes } from './types';

const ModalRendererInline = ({ modal, onClose, ...params }: { modal: ModalTypes; onClose?: () => void }) => {
  return (
    (modal && (
      <Suspense fallback={<TopBarProgress />}>
        <ModalWrapper {...params} onClose={onClose} modal={modal} inline />
      </Suspense>
    )) || <></>
  );
};

export default ModalRendererInline;
