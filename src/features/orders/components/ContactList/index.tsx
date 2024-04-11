import { memo, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { BsChevronDown, BsPlusCircleFill, BsPencilFill } from 'react-icons/bs';
import { Button, Divider, Drawer, Popover, Whisper } from 'rsuite';
import { ContactInfo, DebouncedInput, DeptWithContact, InfiniteScroll, LocationSelect } from '~app/components';
import ContactCreate from '~app/features/contacts/create';
import { queryClient } from '~app/configs/client';
import { ModalPlacement, ModalSize } from '~app/modals';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import {
  checkSelectedContact,
  DeliveryMethodType,
  formatSelectContact,
  initialContactInfo,
} from '~app/features/pos/utils';
import { formatPhoneWithZero } from '~app/utils/helpers';
import { CONTACTS_KEY, useContactDetailQuery, useContactsQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';
import { NoDataImage } from '~app/components/Icons';

const ContactList = () => {
  const { t } = useTranslation('pos');
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isEdit] = usePosStore((store) => store.is_edit_order);
  const [deliveryMethod] = useSelectedOrderStore((store) => store.delivery_method);
  const [buyerInfo, setBuyerInfo] = useSelectedOrderStore((store) => store.buyer_info);
  const [contactId] = useSelectedOrderStore((store) => store.contact_id);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [list, setList] = useState<Contact[]>([]);
  const { data } = useContactsQuery({ page, pageSize: 20, search });
  const { data: contactDetail } = useContactDetailQuery(contactId || '');

  const handleClick = useCallback(
    (contact: Contact) => {
      // reselect
      const checked = checkSelectedContact({ contact, selected: buyerInfo });
      if (checked) return setBuyerInfo((prevState) => ({ ...prevState, buyer_info: initialContactInfo() }));

      handleSelectBuyerInfo(contact);
    },
    [buyerInfo],
  );

  const handleSelectBuyerInfo = (contact: Contact) => {
    const { buyer_info, customer_point } = formatSelectContact(contact);
    setBuyerInfo((prevState) => ({ ...prevState, buyer_info, customer_point }));
    setSelectedContact(contact);
  };

  const next = useCallback(() => setPage((prevState) => prevState + 1), []);
  const isLastPage = useMemo(() => page >= (data?.meta.total_pages || 1), [data?.meta.total_pages, page]);

  useEffect(() => {
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...(data?.data || [])], 'id'));
    } else {
      setList(data?.data || []);
    }
  }, [data, page]);

  useEffect(() => {
    if (!contactDetail) return;
    const { updated_at, created_at, deleted_at, ...contact } = contactDetail;
    const { buyer_info, customer_point } = formatSelectContact(contact as Contact);
    setBuyerInfo((prevState) => ({
      ...prevState,
      buyer_info: {
        ...prevState.buyer_info,
        debt_amount: buyer_info.debt_amount,
      },
      customer_point,
    }));
    setSelectedContact(contact as Contact);
  }, [contactDetail, setBuyerInfo]);

  return (
    <>
      <Whisper
        placement="autoVerticalEnd"
        trigger="click"
        speaker={({ onClose, left, top, className }, ref) => {
          return (
            <Popover
              ref={ref}
              className={cx('!pw-rounded-none pw-w-96', className, {
                '!pw-hidden': !isEdit,
              })}
              style={{ left, top }}
              arrow={false}
              full
            >
              <DebouncedInput
                className="pw-m-4 pw-mb-1"
                value=""
                icon="search"
                onChange={(value) => {
                  page > 1 && setPage(1);
                  contentRef?.current?.scroll({ top: 0 });
                  setSearch(value);
                }}
                placeholder={t('placeholder.search_contact') || ''}
              />
              <Button
                className="!pw-text-blue-600 !pw-font-bold pw-ml-1"
                appearance="subtle"
                startIcon={<BsPlusCircleFill size={24} />}
                onClick={() => {
                  onClose();
                  setOpenCreate(true);
                }}
              >
                {t('common:create_new')}
              </Button>
              <div ref={contentRef} className="pw-overflow-auto pw-max-h-80">
                {list.length > 0 ? (
                  <InfiniteScroll next={next} hasMore={!isLastPage}>
                    {list.map((contact) => (
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
                    ))}
                  </InfiniteScroll>
                ) : (
                  <div className="pw-h-[30vh] pw-flex pw-flex-col pw-items-center pw-justify-center">
                    <NoDataImage width={120} height={120} />
                    <div className="pw-text-base">{t('common:no-data')}</div>
                  </div>
                )}
              </div>
            </Popover>
          );
        }}
      >
        {buyerInfo.name ? (
          <div
            className={cx('pw-cursor-pointer', {
              'pw-flex pw-items-center pw-justify-between': isEdit,
            })}
          >
            <ContactInfo
              className={cx('pw-gap-x-4 pw-items-center', {
                'pw-mr-2': isEdit,
              })}
              avatar={buyerInfo.avatar}
              title={buyerInfo.name}
              subTitle={
                <div className="pw-flex pw-flex-wrap">
                  <div>{formatPhoneWithZero(buyerInfo.phone_number)}</div>
                  {selectedContact && selectedContact.debt_amount !== null && selectedContact.debt_amount !== 0 && (
                    <div className="pw-flex pw-items-center">
                      <Divider vertical className="md:!pw-hidden lg:!pw-block" />
                      <DeptWithContact debtAmount={selectedContact.debt_amount || 0} />
                    </div>
                  )}
                </div>
              }
              titleClassName="pw-text-base pw-font-normal pw-text-black line-clamp-1"
              subTitleClassName="pw-text-sm pw-font-normal"
            />
            {isEdit ? (
              <div className="pw-text-blue-600">
                <BsPencilFill size={22} />
              </div>
            ) : null}
          </div>
        ) : (
          <div
            className="pw-py-2 pw-px-3.5 pw-border pw-border-neutral-border
           pw-rounded pw-flex pw-items-center pw-justify-between pw-cursor-pointer"
          >
            <div className="pw-text-neutral-placeholder">{t('placeholder.input_name_phone')}</div>
            <BsChevronDown />
          </div>
        )}
      </Whisper>
      {deliveryMethod === DeliveryMethodType.SELLER_DELIVERY && isEdit && (
        <>
          <div className="pw-font-bold pw-text-neutral-secondary pw-mt-4 pw-mb-1">{t('address')}</div>
          <LocationSelect
            value={buyerInfo.address_info}
            onChange={(value: PendingAddressLocation) =>
              setBuyerInfo((prevState) => ({
                ...prevState,
                buyer_info: { ...prevState.buyer_info, address_info: value },
              }))
            }
          />
        </>
      )}
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
              queryClient.invalidateQueries([CONTACTS_KEY], { exact: false });
              handleSelectBuyerInfo(contact);
            }}
            onClose={() => setOpenCreate(false)}
          />
        </Drawer>
      )}
    </>
  );
};

export default memo(ContactList);
