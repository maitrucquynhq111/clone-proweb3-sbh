import { Badge } from 'rsuite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MainRouteKeys } from '~app/routes/enums';
import { useCurrentConversation } from '~app/utils/hooks';
import { useMarkReadMessageMutation } from '~app/services/mutations';
import { AuthService } from '~app/services/api';
import { useChatStore } from '~app/features/chat-inbox/hooks';
import { updateCacheConversationDefaultList, updateCacheConversationList } from '~app/features/chat-inbox/utils';
import { CustomerPermission, useHasPermissions } from '~app/utils/shield';
import { ConversationType } from '~app/utils/constants';
import { useCacheMeQuery } from '~app/services/queries';

type Props = { conversation: Conversation; name: string; avatar: JSX.Element };

const Items = ({ conversation, name, avatar }: Props) => {
  const { t } = useTranslation('chat');
  const navigate = useNavigate();
  const [filter, setChatStore] = useChatStore((store) => store.filter);
  const [pageIds] = useChatStore((store) => store.pageIds);
  const canViewConversation = useHasPermissions([CustomerPermission.CUSTOMER_CHAT_ALL_VIEW]);
  const { mutateAsync: markSeenMessage } = useMarkReadMessageMutation();
  const { setCurrentConversation } = useCurrentConversation();
  const businessId = AuthService.getBusinessId();
  const { data: user } = useCacheMeQuery();

  const handleClick = useCallback(async () => {
    if (conversation?.unseen_message > 0) {
      const body = {
        conversation_ids: [conversation.id],
        msg_id: null,
        sender_id: conversation?.type === ConversationType.NOTIFICATION ? user?.user_info?.id : businessId || '',
        sender_type: conversation?.type === ConversationType.NOTIFICATION ? 'user' : 'business',
      };
      await markSeenMessage(body);
      if (canViewConversation) {
        updateCacheConversationList(conversation, { ...filter, pageIds }, conversation.id);
      }
      updateCacheConversationDefaultList(conversation, conversation.id);
    }
    setChatStore((store) => ({ ...store, showOrderInChat: false }));
    navigate(MainRouteKeys.ChatInboxDetails.replace(':pageId', conversation.id), {
      replace: true,
    });
    setCurrentConversation(conversation);
  }, [conversation, user, businessId]);

  return (
    <div
      className="pw-relative pw-col-span-1 pw-flex pw-flex-col pw-items-center pw-cursor-pointer"
      onClick={handleClick}
    >
      <div>{avatar}</div>
      <div className="pw-text-neutral-secondary pw-text-xs pw-mt-1">{t(name)}</div>
      {conversation?.unseen_message > 0 && (
        <Badge
          content={conversation.unseen_message}
          className="pw-absolute pw-top-0 pw-right-2.5 !pw-text-2xs !pw-font-semibold"
        />
      )}
    </div>
  );
};

export default Items;
