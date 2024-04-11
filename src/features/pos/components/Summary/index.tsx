import { memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SummaryRetailer from './SummaryRetailer';
import SummaryFnb from './SummaryFnb';
import { initialContactInfo, formatSelectContact } from '~app/features/pos/utils';
import { useSelectedOrderStore, usePosStore } from '~app/features/pos/hooks';
import { useContactDetailQuery } from '~app/services/queries';
import { PosMode } from '~app/features/pos/constants';

type Props = {
  className?: string;
};

const Summary = ({ className }: Props) => {
  const location = useLocation();
  const [, setBuyerInfo] = useSelectedOrderStore((store) => store.buyer_info);
  const [posMode] = usePosStore((store) => store.pos_mode);
  const { data: contactDetail } = useContactDetailQuery(location.state?.contactId || '');

  useEffect(() => {
    if (contactDetail) {
      const { buyer_info, customer_point } = formatSelectContact(contactDetail);
      setBuyerInfo((prevState) => ({ ...prevState, buyer_info, customer_point }));
      window.history.replaceState({}, document.title);
    }
  }, [contactDetail]);

  const removeContact = () => {
    return setBuyerInfo((prevState) => ({ ...prevState, buyer_info: initialContactInfo(), customer_point: 0 }));
  };

  return (
    <div className={className}>
      {posMode === PosMode.FNB ? (
        <SummaryFnb removeContact={removeContact} />
      ) : (
        <SummaryRetailer removeContact={removeContact} />
      )}
    </div>
  );
};

export default memo(Summary);
