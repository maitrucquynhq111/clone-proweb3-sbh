import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiChevronDown } from 'react-icons/hi';
import { Popover, Whisper } from 'rsuite';
import CreateCustomerInfo from './create';
import CustomerInfoDetail from './detail';
import SelectCustomerInfo from './SelectCustomerInfo';
import EditableCustomerInfo from './EditableCustomerInfo';
import { CustomerInfo } from './config';
import { getParticipant } from '~app/features/chat-inbox/utils';
import { useCurrentConversation } from '~app/utils/hooks';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { useContactStore } from '~app/features/chat-inbox/hooks';

type Props = {
  error?: boolean;
  setError?(value: boolean): void;
};

const CustomerInfo = ({ error = false, setError }: Props) => {
  const { t } = useTranslation();
  const whisperRef = useRef<ExpectedAny>();
  const [buyerInfo, setSelectedOrderStore] = useSelectedOrderStore((store) => store.buyer_info);
  const [contact] = useContactStore((store) => store.contact);
  const [listContactDelivering] = useContactStore((store) => store.list_contact_delivering);
  const { currentConversation } = useCurrentConversation();
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [customerInfoEdit, setCustomerInfoEdit] = useState<CustomerInfo | null>(null);
  const [selectedContactDelivering, setSelectedContactDelivering] = useState('');

  const otherParticipant = useMemo(() => {
    return getParticipant(currentConversation?.participants || [], false);
  }, [currentConversation]);

  const setDefaultBuyerInfo = useCallback(() => {
    if (listContactDelivering && listContactDelivering.length > 0) {
      const firstContactDelivering = listContactDelivering[0];
      const defaultContactDelivering = listContactDelivering.find((item) => item.is_default);
      if (defaultContactDelivering) {
        setSelectedContactDelivering(defaultContactDelivering.id);
        return setSelectedOrderStore((store) => {
          const buyerInfo = {
            name: defaultContactDelivering.name,
            phone_number: defaultContactDelivering.phone_number,
            address_info: defaultContactDelivering.address_info,
            debt_amount: contact?.debt_amount || 0,
            option: contact?.option || '',
            avatar: contact?.avatar || '',
          };
          return { ...store, buyer_info: buyerInfo, customer_point: contact?.customer_point || 0 };
        });
      }
      if (firstContactDelivering) {
        setSelectedContactDelivering(firstContactDelivering.id);
        return setSelectedOrderStore((store) => {
          const buyerInfo = {
            name: firstContactDelivering.name,
            phone_number: firstContactDelivering.phone_number,
            address_info: firstContactDelivering.address_info,
            debt_amount: contact?.debt_amount || 0,
            option: contact?.option || '',
            avatar: contact?.avatar || '',
          };
          return { ...store, buyer_info: buyerInfo, customer_point: contact?.customer_point || 0 };
        });
      }
    }
    if (contact) {
      return setSelectedOrderStore((store) => {
        const buyerInfo = {
          name: contact.name,
          phone_number: contact.phone_number,
          address_info: contact.address_info,
          debt_amount: contact?.debt_amount || 0,
          option: contact?.option || '',
          avatar: contact?.avatar || '',
        };
        return { ...store, buyer_info: buyerInfo, customer_point: contact?.customer_point || 0 };
      });
    }
    if (otherParticipant) {
      return setSelectedOrderStore((store) => {
        const buyerInfo = {
          name: otherParticipant?.info?.full_name || '',
          phone_number: otherParticipant?.info?.phone_number || '',
          address_info: null,
          debt_amount: 0,
          option: '',
          avatar: '',
        };
        return { ...store, buyer_info: buyerInfo };
      });
    }
  }, [contact, listContactDelivering, otherParticipant, setSelectedOrderStore]);

  const handleClose = () => {
    setIsCreate(false);
    setIsEdit(false);
  };

  const handleShowCreateAddress = useCallback(() => {
    setIsCreate(true);
    setIsEdit(false);
    whisperRef?.current?.close();
  }, []);

  const handleShowEditAddress = useCallback((value: ContactDeliveringAddress) => {
    setIsEdit(true);
    setIsCreate(false);
    setCustomerInfoEdit({
      id: value.id,
      name: value.name,
      phone_number: value.phone_number,
      address_info: value.address_info,
    });
    whisperRef?.current?.close();
  }, []);

  const handleSelectCustomerInfo = useCallback(
    (value: ContactDeliveringAddress) => {
      setSelectedOrderStore((store) => {
        const { buyer_info } = store;
        const newBuyerInfo = {
          ...buyer_info,
          name: value.name,
          phone_number: value.phone_number,
          address_info: value.address_info,
        };
        return { ...store, buyer_info: newBuyerInfo };
      });
      setSelectedContactDelivering(value.id);
      whisperRef?.current?.close();
      setIsCreate(false);
      setIsEdit(false);
    },
    [setSelectedOrderStore],
  );

  useEffect(() => {
    if (selectedContactDelivering) return;
    setDefaultBuyerInfo();
  }, [setDefaultBuyerInfo, selectedContactDelivering]);

  return (
    <div className="pw-py-6 pw-px-5 pw-bg-neutral-white pw-border-b pw-border-l pw-border-solid pw-border-neutral-divider">
      <div className="pw-flex pw-justify-between pw-items-center">
        <h3 className="pw-font-bold pw-text-base pw-text-neutral-primary">{t('orders-form:customer_info')}</h3>
        {contact ? (
          <Whisper
            trigger="click"
            placement="autoVerticalEnd"
            ref={whisperRef}
            speaker={({ left, top, className }, ref) => {
              return (
                <Popover ref={ref} style={{ left, top }} full arrow={false} className={className}>
                  <SelectCustomerInfo
                    selected={selectedContactDelivering}
                    listContactDelivering={listContactDelivering}
                    onCreateAddress={handleShowCreateAddress}
                    onEditAddress={handleShowEditAddress}
                    onSelect={handleSelectCustomerInfo}
                  />
                </Popover>
              );
            }}
          >
            <button className="pw-flex pw-gap-x-1 pw-p-0.5 active:pw-bg-secondary-background">
              <span className="pw-text-secondary-main-blue pw-text-sm pw-font-bold">{t('common:change')}</span>
              <HiChevronDown size={20} className="pw-text-secondary-main-blue" />
            </button>
          </Whisper>
        ) : null}
      </div>
      {isCreate || isEdit ? null : (
        <EditableCustomerInfo
          className="pw-mt-4"
          id={selectedContactDelivering}
          name={buyerInfo?.name || ''}
          phoneNumber={buyerInfo?.phone_number || ''}
          addressInfo={buyerInfo?.address_info}
          error={error}
          setError={setError}
          onClick={() => {
            setCustomerInfoEdit({
              id: selectedContactDelivering,
              name: buyerInfo?.name || '',
              phone_number: buyerInfo?.phone_number || '',
              address_info: buyerInfo?.address_info,
            });
            setIsEdit(true);
          }}
        />
      )}
      {isCreate && contact ? (
        <div className="pw-mt-4">
          <CreateCustomerInfo
            onClose={handleClose}
            contact_id={contact.id}
            onSelectCustomerInfo={handleSelectCustomerInfo}
          />
        </div>
      ) : null}
      {isEdit ? (
        <div className="pw-mt-4">
          <CustomerInfoDetail
            onClose={handleClose}
            defaultCustomerInfo={customerInfoEdit}
            hasContact={!!contact}
            contactId={contact?.id || ''}
            onSelectCustomerInfo={handleSelectCustomerInfo}
          />
        </div>
      ) : null}
    </div>
  );
};

export default memo(CustomerInfo);
