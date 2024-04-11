import FnbLayout from './FnbLayout';
import RetailerLayout from './RetailerLayout';
import { usePosStore } from '~app/features/pos/hooks/usePos';
import { PosMode } from '~app/features/pos/constants';

const PosLayout = () => {
  const [posMode] = usePosStore((store) => store.pos_mode);
  return <>{posMode === PosMode.FNB ? <FnbLayout /> : <RetailerLayout />}</>;
};

export default PosLayout;
