import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { EmptyState } from '~app/components';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { useContactDetails } from '~app/features/contacts/hooks/useContactDetails';
import { ContactUpdateInline } from '~app/features/contacts/details/components';
import CustomerPointModal from '~app/features/contacts/details/components/CustomerPoint/CustomerPointModal';
import { EmptyStateContact } from '~app/components/Icons';
import {
  HeaderAction,
  CustomerPointHistory,
} from '~app/features/contacts/details/components/ContactTabs/Points/components';
import { OpenType } from '~app/features/contacts/details/components/CustomerPoint';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  order?: Order | null;
  orderId?: string;
  id?: string;
  amount?: number;
  onSuccess?(): void;
};

const Points = (): JSX.Element => {
  const { t } = useTranslation('contact-details');
  const { data: contactDetail } = useContactDetails();

  const [openType, setOpenType] = useState<OpenType | ''>('');
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const onClickOrderNumber = (orderNumber: string) => {
    const modalData: ModalData = {
      modal: ModalTypes.OrderDetails,
      size: ModalSize.Full,
      placement: ModalPlacement.Top,
      id: orderNumber,
      onSuccess: () => {
        setModalData(null);
        return;
      },
    };
    return setModalData(modalData);
  };

  return (
    <div>
      {!contactDetail || !contactDetail.phone_number ? (
        <EmptyState
          icon={<EmptyStateContact size="120" />}
          description1={t('empty_state.customer_point')}
          hiddenButton={false}
          hidePlusIcon={true}
          textBtn={t('action.add_phone_number') || ''}
          onClick={() => setOpenType(OpenType.CONTACT_UPDATE)}
        />
      ) : (
        <>
          <HeaderAction contactDetail={contactDetail} onClick={() => setOpenType(OpenType.CUSTOMER_POINT)} />
          <CustomerPointHistory onClickOrderNumber={onClickOrderNumber} />
        </>
      )}
      {openType === OpenType.CONTACT_UPDATE && <ContactUpdateInline onClose={() => setOpenType('')} />}
      {openType === OpenType.CUSTOMER_POINT && contactDetail && (
        <CustomerPointModal detail={contactDetail} onClose={() => setOpenType('')} />
      )}
      {modalData && (
        <ModalRendererInline
          onClose={() => {
            setModalData(null);
          }}
          {...modalData}
        />
      )}
    </div>
  );
};

export default Points;
