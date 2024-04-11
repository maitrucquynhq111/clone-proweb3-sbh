import cx from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AutoResizeInput } from '~app/components';
import { AutoResizeInputRef } from '~app/components/FormControls/Input/AutoResizeInput';
import { queryClient } from '~app/configs/client';
import { defaultAddressInfo } from '~app/features/chat-inbox/components/CustomerInfo/config';
import DuplicateContactModal from '~app/features/chat-inbox/details/components/DuplicateContactModal';
import SyncOldContactModal from '~app/features/chat-inbox/details/components/SyncOldContactModal';
import { useContactStore } from '~app/features/chat-inbox/hooks';
import { getParticipant } from '~app/features/chat-inbox/utils';
import { ContactService } from '~app/services/api';
import { useUpdateContactMutation } from '~app/services/mutations';
import { CONTACT_IN_CHAT_KEY } from '~app/services/queries';
import { ConversationTag, SourceKey } from '~app/utils/constants';
import { formatPhoneWithZero } from '~app/utils/helpers';
import { phoneNumberRegex } from '~app/utils/helpers/regexHelper';
import { useCurrentConversation } from '~app/utils/hooks';

const EditContactPhoneNumber = () => {
  const { t } = useTranslation('contact-form');
  const autoResizeInputRef = useRef<AutoResizeInputRef>(null);
  const [contact] = useContactStore((store) => store.contact);
  const { currentConversation } = useCurrentConversation();
  const { mutateAsync: updateContact } = useUpdateContactMutation();
  const [error, setError] = useState('');
  const [openSyncModal, setOpenSyncModal] = useState(false);
  const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
  const [syncContact, setSyncContact] = useState<{
    contact_name: string;
    contact_id: string;
  }>({
    contact_name: '',
    contact_id: '',
  });

  const defaultPhoneNumber = useMemo(() => {
    if (!contact) return '';
    return contact?.phone_number.match(phoneNumberRegex) ? formatPhoneWithZero(contact?.phone_number) : '';
  }, [contact]);

  const otherParticipant = useMemo(() => {
    return getParticipant(currentConversation?.participants || [], false);
  }, [currentConversation]);

  const handleCreateOrderUpdate = async (value: string) => {
    try {
      if (value && !value.match(phoneNumberRegex)) {
        return setError(t('common:error_phone') || '');
      }
      setError('');
      if (!currentConversation) return;
      if (!contact) {
        const body: CreateContactInChatBody = {
          avatar: otherParticipant?.info?.avatar || '',
          name: otherParticipant?.info?.full_name || '',
          phone_number: value,
          address_info: defaultAddressInfo,
          sender_id: otherParticipant?.sender_id || '',
          sender_type: otherParticipant?.sender_type || '',
          source_key: SourceKey[currentConversation.tag as keyof typeof SourceKey],
        };
        await ContactService.createContactInChat(body);
        queryClient.invalidateQueries([
          CONTACT_IN_CHAT_KEY,
          {
            sender_id: otherParticipant?.sender_id || '',
            sender_type: otherParticipant?.sender_type || '',
          },
        ]);
      } else {
        if (value === defaultPhoneNumber) return;
        const body: PendingContact = {
          name: contact.name,
          address_info: contact.address_info,
          phone_number: value,
        };
        await updateContact({ id: contact.id, contact: body });
        queryClient.invalidateQueries([
          CONTACT_IN_CHAT_KEY,
          {
            sender_id: otherParticipant?.sender_id || '',
            sender_type: otherParticipant?.sender_type || '',
          },
        ]);
      }
    } catch (error) {
      if (
        !contact &&
        (currentConversation?.tag === ConversationTag.FB_MESSAGE ||
          currentConversation?.tag === ConversationTag.ZALO_MESSAGE)
      ) {
        const result = await ContactService.getOneByPhoneName(value);
        if (result) {
          setSyncContact({
            contact_id: result.id,
            contact_name: result.name,
          });
          setOpenSyncModal(true);
        }
        return;
      }
      if (!contact && currentConversation?.tag === ConversationTag.SBH) {
        const result = await ContactService.getOneByPhoneName(value);
        if (result) {
          setSyncContact({
            contact_id: result.id,
            contact_name: result.name,
          });
          setOpenDuplicateModal(true);
        }
        return;
      }
    }
  };

  useEffect(() => {
    if (!defaultPhoneNumber) autoResizeInputRef?.current?.handleReset();
  }, [currentConversation, defaultPhoneNumber]);

  return (
    <div>
      <AutoResizeInput
        name=""
        defaultValue={defaultPhoneNumber}
        isForm={false}
        placeholder={t('empty_phone_number') || ''}
        error={Boolean(error)}
        onBlur={(value) => handleCreateOrderUpdate(value)}
        className={cx('!pw-text-sm ', {
          '!pw-text-neutral-secondary': Boolean(error) === false,
        })}
        ref={autoResizeInputRef}
      />
      {error ? <p className="pw-text-error-active pw-text-xs pw-font-semibold pw-pt-1">{error}</p> : null}
      {openSyncModal ? (
        <SyncOldContactModal
          open={openSyncModal}
          setOpen={setOpenSyncModal}
          participant={otherParticipant}
          contactId={syncContact.contact_id}
          contactName={syncContact.contact_name}
        />
      ) : null}
      {openDuplicateModal ? (
        <DuplicateContactModal
          open={openDuplicateModal}
          setOpen={setOpenDuplicateModal}
          contactName={syncContact.contact_name}
        />
      ) : null}
    </div>
  );
};

export default EditContactPhoneNumber;
