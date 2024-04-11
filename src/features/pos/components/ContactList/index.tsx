import { useSyncExternalStore, memo, useState, useCallback, useMemo, useRef } from 'react';
import { useClickAway, useNetworkState } from 'react-use';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill } from 'react-icons/bs';
import { Button, Drawer, Modal } from 'rsuite';
import { contactStore } from '~app/features/pos/stores';
import { ContactInfo, DebouncedInput } from '~app/components';
import ContactCreate from '~app/features/contacts/create';
import { ModalPlacement, ModalSize } from '~app/modals';
import { useSelectedOrderStore, usePosStore } from '~app/features/pos/hooks';
import { checkSelectedContact, formatSelectContact, initialContactInfo } from '~app/features/pos/utils';
import { formatPhoneWithZero } from '~app/utils/helpers';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { SyncType } from '~app/features/pos/constants';
import { useHasPermissions, CustomerPermission } from '~app/utils/shield';

const ContactList = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const canCreateCustomer = useHasPermissions([CustomerPermission.CUSTOMER_CUSTOMERLIST_CREATE]);
  const { t } = useTranslation('pos');
  const { online } = useNetworkState();
  const { syncDataByTypes } = useOfflineContext();
  const contacts = useSyncExternalStore(contactStore.subscribe, contactStore.getSnapshot);
  const [, setStore] = useSelectedOrderStore((store) => store);
  const [buyerInfo] = useSelectedOrderStore((store) => store.buyer_info);
  const [showCustomerModal, setPosStore] = usePosStore((store) => store.show_customer_modal);
  const [openCreate, setOpenCreate] = useState(false);
  const [search, setSearch] = useState('');

  useClickAway(ref, () => {
    onClose();
  });

  const data = useMemo(() => {
    if (!search) return contacts;
    const searchLowerCase = search.toLowerCase();
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchLowerCase) ||
        contact.phone_number.toLowerCase().includes(searchLowerCase) ||
        formatPhoneWithZero(contact.phone_number).toLowerCase().includes(searchLowerCase),
    );
  }, [search, contacts]);

  const handleClick = useCallback(
    (contact: Contact) => {
      // reselect
      const checked = checkSelectedContact({ contact, selected: buyerInfo });
      if (checked) {
        return setStore((prevState) => ({ ...prevState, buyer_info: initialContactInfo(), customer_point: 0 }));
      }

      handleSelectBuyerInfo(contact);
    },
    [buyerInfo],
  );
  const onClose = () => setPosStore((prevState) => ({ ...prevState, show_customer_modal: false }));

  const handleSelectBuyerInfo = (contact: Contact) => {
    const { buyer_info, customer_point } = formatSelectContact(contact);
    setStore((prevState) => ({ ...prevState, buyer_info, customer_point }));
  };

  return (
    <>
      <Modal
        open={showCustomerModal}
        keyboard={false}
        className="!pw-flex !pw-absolute !-pw-translate-x-1/2 xl:-pw-translate-y-1/2 xl:pw-top-1/2 pw-left-1/2
        pw-items-center pw-justify-center xl:!pw-my-0 center-modal"
      >
        <div ref={ref}>
          <DebouncedInput
            className="pw-m-4 pw-mb-1"
            value=""
            icon="search"
            onChange={(value) => setSearch(value)}
            placeholder={t('placeholder.search_contact') || ''}
          />
          {canCreateCustomer && online && (
            <Button
              className="!pw-text-blue-600 !pw-font-bold pw-w-full !pw-justify-start !pw-rounded-none"
              appearance="subtle"
              startIcon={<BsPlusCircleFill size={24} />}
              onClick={() => {
                onClose();
                setOpenCreate(true);
              }}
            >
              {`${t('common:create_new')} ${search ? `"${search}"` : ''}`}
            </Button>
          )}
          <div className="pw-overflow-auto pw-max-h-80">
            {data?.length > 0 ? (
              data.map((contact) => (
                <ContactInfo
                  key={contact.id}
                  className="pw-p-3 pw-gap-x-4 pw-cursor-pointer pw-justify-between pw-items-center"
                  avatar={contact.avatar}
                  title={contact.name}
                  titleClassName="pw-text-base pw-font-normal pw-text-black"
                  subTitle={contact.phone_number}
                  subTitleClassName="pw-text-sm pw-font-normal"
                  selected={checkSelectedContact({ contact, selected: buyerInfo })}
                  onClick={() => {
                    handleClick(contact);
                    onClose();
                  }}
                />
              ))
            ) : (
              <div className="pw-overflow-auto pw-max-h-80">
                <div className="pw-p-3 pw-text-sm">{t('error.no_search_contact')}</div>
              </div>
            )}
          </div>
        </div>
      </Modal>
      {openCreate && (
        <Drawer
          backdrop="static"
          keyboard={false}
          placement={ModalPlacement.Right}
          size={ModalSize.Small}
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          className="pw-h-screen"
        >
          <ContactCreate
            onSuccess={(contact) => {
              syncDataByTypes([SyncType.CONTACTS]);
              handleSelectBuyerInfo(contact);
            }}
            onClose={() => setOpenCreate(false)}
            contactNameDefault={search}
          />
        </Drawer>
      )}
    </>
  );
};

export default memo(ContactList);
