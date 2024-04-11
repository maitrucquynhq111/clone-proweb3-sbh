import cx from 'classnames';
import useWebSocket from 'react-use-websocket';
import { Outlet, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ConversationMenu } from './components';
import Default from './default';
import { ChatProvider, ContactProvider, useChatStore } from './hooks';
import {
  updateCacheConversationDefaultList,
  updateCacheConversationList,
  updateContentCacheConversation,
} from './utils';
import { CONVERSATION_DETAIL_KEY, useCacheMeQuery } from '~app/services/queries';
import { ACCESS_TOKEN_KEY, SOCKET_URI } from '~app/configs';
import { RouterSuspense } from '~app/components';
import { CurrentConversationProvider } from '~app/utils/hooks';
import { AuthService } from '~app/services/api';
import { useMarkReadMessageMutation } from '~app/services/mutations';
import { ConversationType } from '~app/utils/constants';
import { isJsonString } from '~app/utils/helpers';
import { queryClient } from '~app/configs/client';
import { PosProvider, SelectedOrderProvider } from '~app/features/pos/hooks';

const ChatInbox = () => {
  const [filter] = useChatStore((store) => store.filter);
  const [pageIds] = useChatStore((store) => store.pageIds);
  const [showOrderInChat] = useChatStore((store) => store.showOrderInChat);
  const { pageId } = useParams();
  const businessId = AuthService.getBusinessId();
  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const { mutateAsync: markSeenMessage } = useMarkReadMessageMutation();
  const { data: user } = useCacheMeQuery();

  const { sendMessage } = useWebSocket(SOCKET_URI, {
    onOpen: () => {
      sendMessage(
        JSON.stringify({
          auth: {
            token: `Bearer ${token}`,
          },
        }),
      );
    },
    onMessage: async (e) => {
      const message = e?.data;
      const parseMsg = JSON.parse(message);
      if (parseMsg?.deliver) {
        const {
          deliver: { body, id },
        } = parseMsg;
        const parseBody = JSON.parse(body);
        const isSameConversation = parseBody?.conversation_id ? parseBody.conversation_id === pageId : false;
        const messageContent =
          parseBody?.type === ConversationType.SYSTEM && isJsonString(parseBody?.content)
            ? JSON.parse(parseBody?.content)?.message
            : parseBody?.content;
        const newMessage = {
          ...parseBody,
          id: id,
          message: messageContent,
          message_type: parseBody?.type,
          updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS+07:00"),
          created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS+07:00"),
        };
        const converstationFilter = {
          ...filter,
          pageIds,
        };
        if (isSameConversation) {
          const currentConversation: ExpectedAny = queryClient.getQueryData([CONVERSATION_DETAIL_KEY, { id: pageId }]);
          const senderInfo = (currentConversation?.participants || []).find(
            (participant: ExpectedAny) => participant.sender_id === parseBody.sender_id,
          );
          updateContentCacheConversation({ ...newMessage, sender_id: senderInfo?.id || newMessage.sender_id }, pageId);
          const body = {
            conversation_ids: [pageId || parseBody?.conversation_id || ''],
            msg_id: null,
            sender_id:
              currentConversation?.type === ConversationType.NOTIFICATION ? user?.user_info?.id : businessId || '',
            sender_type: currentConversation?.type === ConversationType.NOTIFICATION ? 'user' : 'business',
          };
          await markSeenMessage(body);
        }
        updateCacheConversationList(newMessage, converstationFilter, pageId);
        updateCacheConversationDefaultList(newMessage, pageId);
      }
    },
    shouldReconnect: () => true,
    reconnectInterval: 1000,
    reconnectAttempts: 1000,
    retryOnError: true,
    share: true,
  });

  return (
    <div className="pw-flex pw-h-full pw-overflow-hidden">
      <CurrentConversationProvider>
        <>
          <div
            className={cx('pw-transition-all', {
              'pw-w-16 pw-flex pw-flex-col pw-h-full pw-flex-wrap pw-overflow-x-hidden': showOrderInChat,
              'pw-w-84 pw-h-[calc(100vh-56px)]': !showOrderInChat,
            })}
          >
            <ConversationMenu />
          </div>
          <div className="pw-flex-1 pw-h-full">
            {(pageId && (
              <RouterSuspense>
                <ContactProvider>
                  <PosProvider>
                    <SelectedOrderProvider>
                      <Outlet />
                    </SelectedOrderProvider>
                  </PosProvider>
                </ContactProvider>
              </RouterSuspense>
            )) || <Default />}
          </div>
        </>
      </CurrentConversationProvider>
    </div>
  );
};

const ChatInboxWrapper = () => {
  return (
    <ChatProvider>
      <ChatInbox />
    </ChatProvider>
  );
};

export default ChatInboxWrapper;
