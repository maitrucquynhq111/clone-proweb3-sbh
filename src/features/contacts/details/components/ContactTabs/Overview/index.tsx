import {
  ContactInfo,
  TopBoughtProducts,
  LastOrder,
  ContactLabel,
  ContactGroup,
  CustomerPoint,
  ContactNote,
  ContactAnalytics,
  ActivitiesHistory,
} from '~app/features/contacts/details/components';
import { CustomerPermission, useHasPermissions } from '~app/utils/shield';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';

const Overview = () => {
  const {
    setting: { bussiness },
  } = useOfflineContext();
  const canViewCustomerPoint = useHasPermissions([CustomerPermission.CUSTOMER_LOYALTY_VIEW]);
  return (
    <div className="pw-grid pw-grid-cols-12 pw-gap-6">
      <div className="pw-col-span-12">
        <ContactAnalytics />
      </div>
      <div className="pw-col-span-9">
        <ContactInfo />
        <TopBoughtProducts />
        <LastOrder />
        <ActivitiesHistory />
      </div>
      <div className="pw-col-span-3">
        <ContactLabel />
        <ContactGroup />
        {bussiness?.is_customer_point && canViewCustomerPoint && <CustomerPoint />}
        <ContactNote />
      </div>
    </div>
  );
};

export default Overview;
