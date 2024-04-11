import cx from 'classnames';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill } from 'react-icons/bs';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import EditableCustomerInfo from '~app/features/chat-inbox/components/CustomerInfo/EditableCustomerInfo';
import { CreateCustomerInfo } from '~app/features/chat-inbox/components';
import { useContactStore } from '~app/features/chat-inbox/hooks';

const CustomerInfo = () => {
  const { t } = useTranslation('chat');
  const [contact] = useContactStore((store) => store.contact);
  const [listContactDelevering] = useContactStore((store) => store.list_contact_delivering);
  const [showCreateCustomerInfo, setShowCreateCustomer] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const renderListContactDelevering = useMemo(() => {
    if (!listContactDelevering) return [];
    return showAll ? listContactDelevering : listContactDelevering.slice(0, 2);
  }, [showAll, listContactDelevering]);

  return (
    <div className="pw-py-6 pw-px-5 pw-bg-neutral-white pw-border-b pw-border-solid pw-border-neutral-divider">
      <div className="pw-flex pw-items-center pw-justify-between ">
        <span className="pw-text-base pw-font-bold pw-text-neutral-primary">
          {t('count_customer_info', { count: listContactDelevering ? listContactDelevering.length : 0 })}
        </span>
        <button
          className="pw-flex pw-items-center pw-justify-center pw-gap-x-2 "
          type="button"
          onClick={() => {
            setShowCreateCustomer(true);
            setSelectedId('');
          }}
        >
          <BsPlusCircleFill className="pw-fill-secondary-main-blue" size={20} />
        </button>
      </div>
      {showCreateCustomerInfo ? (
        <div className="pw-mt-4">
          <CreateCustomerInfo
            contact_id={contact?.id || ''}
            isCreateContactInChat={contact ? false : true}
            onClose={() => setShowCreateCustomer(false)}
          />
        </div>
      ) : null}
      <div className="pw-max-h-82 pw-overflow-y-scroll scrollbar-none">
        {renderListContactDelevering.map((item, index) => {
          return (
            <EditableCustomerInfo
              key={item.id}
              id={item.id}
              name={item.name}
              phoneNumber={item.phone_number}
              addressInfo={item.address_info}
              hasContact={!!contact}
              showForm={selectedId === item.id}
              className={cx('pw-w-full pw-pt-4', {
                'pw-border-t pw-border-solid pw-border-neutral-divider': index !== 0,
                'pw-pb-4': index !== renderListContactDelevering.length - 1,
              })}
              onClick={() => {
                setSelectedId(item.id);
                setShowCreateCustomer(false);
              }}
            />
          );
        })}
      </div>
      {listContactDelevering && listContactDelevering?.length > 2 ? (
        <div className="pw-w-full pw-mt-4 pw-p-0.5">
          <button
            className="pw-mx-auto pw-flex pw-items-center pw-gap-x-1 pw-text-sm pw-font-bold pw-text-secondary-main-blue"
            onClick={() => setShowAll((prevState) => !prevState)}
          >
            {!showAll ? (
              <>
                <span>{t('action.view_more')}</span>
                <HiChevronDown size={24} className="pw-text-inherit" />
              </>
            ) : (
              <>
                <span>{t('action.shortened')}</span>
                <HiChevronUp size={24} className="pw-text-inherit" />
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default memo(CustomerInfo);
