import React, { memo, useMemo } from 'react';
import { AutoResizeInput } from '~app/components';
import { queryClient } from '~app/configs/client';
import { defaultAddressInfo } from '~app/features/chat-inbox/components/CustomerInfo/config';
import { useContactStore } from '~app/features/chat-inbox/hooks';
import { getParticipant } from '~app/features/chat-inbox/utils';
import { useCreateContactInChat, useUpdateContactMutation } from '~app/services/mutations';
import { CONTACT_IN_CHAT_KEY } from '~app/services/queries';
import { SourceKey } from '~app/utils/constants';
import { useCurrentConversation } from '~app/utils/hooks';

const EditContactName = () => {
  const [contact] = useContactStore((store) => store.contact);
  const { currentConversation } = useCurrentConversation();
  const { mutateAsync: updateContact } = useUpdateContactMutation();
  const { mutateAsync: createContactInchat } = useCreateContactInChat();

  const customerInfo = useMemo(() => {
    return getParticipant(currentConversation?.participants || [], false)?.info;
  }, [currentConversation]);

  const handleCreateOrderUpdate = async (value: string) => {
    try {
      const otherParticipant = getParticipant(currentConversation?.participants || [], false);
      if (!currentConversation) return;
      if (!contact) {
        const body: CreateContactInChatBody = {
          avatar: customerInfo?.avatar || '',
          name: value,
          phone_number: '',
          address_info: defaultAddressInfo,
          sender_id: otherParticipant?.sender_id || '',
          sender_type: otherParticipant?.sender_type || '',
          source_key: SourceKey[currentConversation.tag as keyof typeof SourceKey],
        };
        await createContactInchat(body);
        queryClient.invalidateQueries([
          CONTACT_IN_CHAT_KEY,
          {
            sender_id: otherParticipant?.sender_id || '',
            sender_type: otherParticipant?.sender_type || '',
          },
        ]);
      } else {
        if (contact.name === value) return;
        const body: PendingContact = {
          name: value,
          address_info: contact.address_info,
          phone_number: contact.phone_number,
        };
        await updateContact({ id: contact.id, contact: body });
      }
    } catch (error) {
      // TO DO
    }
  };

  return (
    <AutoResizeInput
      name=""
      defaultValue={contact?.name ? contact?.name : customerInfo?.full_name || ''}
      isForm={false}
      className="!pw-text-base !pw-text-neutral-primary !pw-font-bold"
      onBlur={(value) => handleCreateOrderUpdate(value)}
    />
  );
};

export default memo(EditContactName);
