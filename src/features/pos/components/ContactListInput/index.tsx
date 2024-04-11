import { useSyncExternalStore, memo, useState, useCallback, useMemo, useEffect } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill, BsPersonFill, BsXCircle } from 'react-icons/bs';
import { Button, Drawer, Popover, Whisper } from 'rsuite';
import { useNetworkState } from 'react-use';
import { useLocation } from 'react-router-dom';
import { contactStore } from '~app/features/pos/stores';
import { ContactInfo, DebouncedInput } from '~app/components';
import ContactCreate from '~app/features/contacts/create';
import { ModalPlacement, ModalSize } from '~app/modals';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { checkSelectedContact, formatSelectContact, initialContactInfo } from '~app/features/pos/utils';
import { formatPhoneWithZero } from '~app/utils/helpers';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { SyncType } from '~app/features/pos/constants';
import { useHasPermissions, CustomerPermission } from '~app/utils/shield';
import { useContactDetailQuery } from '~app/services/queries';

type Props = {
  className?: string;
  removeContact?(): void;
};

const ContactListInput = ({ removeContact, className }: Props) => {
  const location = useLocation();
  const canCreateCustomer = useHasPermissions([CustomerPermission.CUSTOMER_CUSTOMERLIST_CREATE]);
  const { t } = useTranslation('pos');
  const { online } = useNetworkState();
  const { syncDataByTypes } = useOfflineContext();
  const contacts = useSyncExternalStore(contactStore.subscribe, contactStore.getSnapshot);
  const { data: contactDetail } = useContactDetailQuery(location.state?.contactId || '');
  const [, setStore] = useSelectedOrderStore((store) => store);
  const [buyerInfo] = useSelectedOrderStore((store) => store.buyer_info);
  const [openCreate, setOpenCreate] = useState(false);
  const [search, setSearch] = useState('');

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

  useEffect(() => {
    if (contactDetail) {
      handleSelectBuyerInfo(contactDetail);
      window.history.replaceState({}, document.title);
    }
  }, [contactDetail]);

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

  const handleSelectBuyerInfo = (contact: Contact) => {
    const { buyer_info, customer_point } = formatSelectContact(contact);
    setStore((prevState) => ({ ...prevState, buyer_info, customer_point }));
  };

  useEffect(() => {
    if (contactDetail) {
      handleSelectBuyerInfo(contactDetail);
      window.history.replaceState({}, document.title);
    }
  }, [contactDetail]);

  return (
    <>
      <Whisper
        placement="autoVerticalEnd"
        className={className}
        trigger="click"
        speaker={({ onClose, left, top, className }, ref) => {
          return (
            <Popover
              ref={ref}
              className={cx('!pw-rounded-none pw-w-96', className)}
              style={{ left, top }}
              arrow={false}
              full
            >
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
            </Popover>
          );
        }}
      >
        {buyerInfo.name ? (
          <div
            className={cx(
              'pw-flex pw-items-center pw-justify-between pw-cursor-pointer pw-p-2 pw-rounded pw-border pw-border-neutral-border',
              className,
            )}
          >
            <div className="pw-flex pw-items-center pw-gap-2">
              <BsPersonFill size={20} className="pw-text-neutral-placeholder" />
              <div>
                <span className="pw-text-sm pw-font-normal pw-text-black line-clamp-1 pw-text-left">
                  {buyerInfo.name}
                </span>
              </div>
            </div>
            <button
              className="pw-text-neutral-secondary"
              onClick={(e) => {
                e.stopPropagation();
                removeContact?.();
              }}
            >
              <BsXCircle size={20} className="pw-fill-neutral-secondary" />
            </button>
          </div>
        ) : (
          <div className={cx(className)}>
            <DebouncedInput
              value=""
              icon="search"
              onChange={(value) => setSearch(value)}
              placeholder={t('placeholder.search_contact') || ''}
            />
          </div>
        )}
      </Whisper>
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

export default memo(ContactListInput);
