import cx from 'classnames';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill } from 'react-icons/bs';
import CustomerInfo from './CustomerInfo';
import CustomerNote from './CustomerNote';
// import EditContactName from './EditContactName';
// import EditContactPhoneNumber from './EditContactPhoneNumber';
import { PlaceholderImage } from '~app/components';
import { useChatStore, useContactStore } from '~app/features/chat-inbox/hooks';
import { getParticipant } from '~app/features/chat-inbox/utils';
import { ConversationTag, SenderType } from '~app/utils/constants';
import { useCurrentConversation } from '~app/utils/hooks';
import { phoneNumberRegex } from '~app/utils/helpers/regexHelper';
import { formatPhoneWithZero } from '~app/utils/helpers';

type Props = {
  className?: string;
};

const SideBar = ({ className }: Props) => {
  const { t } = useTranslation();
  const { currentConversation } = useCurrentConversation();
  const [contact] = useContactStore((store) => store.contact);
  const [, setStore] = useChatStore((store) => store.showOrderInChat);

  const customerInfo = useMemo(() => {
    return getParticipant(currentConversation?.participants || [], false)?.info;
  }, [currentConversation]);

  const showCreateOrderInChat = useMemo(() => {
    if (currentConversation?.pass_a_day === true) return false;
    const otherParticipant = getParticipant(currentConversation?.participants || [], false);
    if (currentConversation?.tag === ConversationTag.SBH && otherParticipant?.sender_type === SenderType.USER)
      return false;
    return true;
  }, [currentConversation]);

  const defaultPhoneNumber = useMemo(() => {
    if (!contact) return '';
    return contact?.phone_number.match(phoneNumberRegex) ? formatPhoneWithZero(contact?.phone_number) : '';
  }, [contact]);

  return (
    <div className={cx('pw-max-w-full pw-border-l pw-border-neutral-white', className)}>
      <div className="pw-h-18 pw-px-4 pw-bg-neutral-white pw-flex pw-items-center pw-gap-x-4 pw-border-b pw-border-solid pw-border-neutral-divider">
        <PlaceholderImage
          className="!pw-w-10 !pw-h-10 pw-bg-white pw-rounded-full"
          isAvatar={true}
          src={contact?.avatar ? contact?.avatar : customerInfo?.avatar || ''}
          alt={contact?.name ? contact?.name : customerInfo?.full_name || ''}
        />
        <div className="pw-flex pw-flex-col pw-gap-y-1">
          {/* {currentConversation?.tag === ConversationTag.FB_MESSAGE && !contact ? (
            <h4 className="pw-text-base pw-text-neutral-primary pw-font-bold">{customerInfo?.full_name || ''}</h4>
          ) : null}
          {currentConversation?.tag === ConversationTag.FB_MESSAGE && contact ? <EditContactName /> : null}
          {currentConversation?.tag !== ConversationTag.FB_MESSAGE ? <EditContactName /> : null} */}
          <h4 className="pw-text-base pw-text-neutral-primary pw-font-bold">
            {contact?.name ? contact?.name : customerInfo?.full_name || ''}
          </h4>
          {contact ? <h4 className="pw-text-sm pw-text-neutral-secondary pw-font-bold">{defaultPhoneNumber}</h4> : null}
          {/* <EditContactPhoneNumber /> */}
        </div>
      </div>
      {showCreateOrderInChat ? (
        <div className="pw-py-6 pw-px-5 pw-bg-neutral-white pw-flex pw-items-center pw-justify-between pw-border-b pw-border-solid pw-border-neutral-divider">
          <span className="pw-text-base pw-font-bold pw-text-neutral-primary">
            {t('header-button:orders-table.create')}
          </span>
          <button
            className="pw-flex pw-items-center pw-justify-center pw-gap-x-2 "
            type="button"
            onClick={() => setStore((store) => ({ ...store, showOrderInChat: true }))}
          >
            <BsPlusCircleFill className="pw-fill-secondary-main-blue" size={20} />
          </button>
        </div>
      ) : null}
      <CustomerInfo />
      {contact ? <CustomerNote /> : null}
    </div>
  );
};

export default SideBar;
