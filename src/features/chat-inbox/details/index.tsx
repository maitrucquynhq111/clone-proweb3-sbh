import cx from 'classnames';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  getParticipant,
  isShowInputSection,
  isShowLabelSection,
  isShowMessageSuggest,
  updateCacheConversationList,
  updateContentCacheConversation,
  isPostComment,
  getRepliedMessageId,
} from '../utils';
import { useChatStore, useContactStore } from '../hooks';
import OrderInChat from '../order-in-chat';
import {
  ChatInput,
  ChatLabels,
  Header,
  Conversation,
  MessageSuggest,
  DisabledMessage,
  PostComment,
  SideBar,
} from './components';
import { ConversationTag, ConversationType, MessageType, SUPPORT_NAME } from '~app/utils/constants';
import { useCreateMessageMutation } from '~app/services/mutations';
import { useCurrentConversation } from '~app/utils/hooks';
import { useGetContactInChatQuery } from '~app/services/queries';
import { useGetListContactDeliveringAddress } from '~app/services/queries/useGetListContactDeliveringAddress';

const Details = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filter] = useChatStore((store) => store.filter);
  const [pageIds] = useChatStore((store) => store.pageIds);
  const [, setContactStore] = useContactStore((store) => store.contact?.id);
  const [showOrderInChat] = useChatStore((store) => store.showOrderInChat);

  const { currentRepliedMessageContent, setCurrentRepliedMessageContent, currentConversation } =
    useCurrentConversation();
  const { mutateAsync } = useCreateMessageMutation();
  const { pageId } = useParams();
  const senderInfo = getParticipant(currentConversation?.participants || [], true);

  const handleSendMessage = useCallback(
    async (message: ExpectedAny, messageType: MessageType) => {
      let newMessage;
      const temp_id = uuidv4().toString();
      const repliedMessageId = getRepliedMessageId({
        currentConversation,
        currentRepliedMessageContent,
      });
      switch (messageType) {
        case MessageType.TEXT:
          newMessage = {
            message: message,
            conversation_id: pageId,
            message_type: messageType,
            replied_message_id: repliedMessageId,
            sender_id: senderInfo?.id || '',
            id_return: temp_id,
          };
          break;
        case MessageType.IMAGE:
          newMessage = {
            message: message,
            conversation_id: pageId,
            message_type: messageType,
            replied_message_id: repliedMessageId,
            sender_id: senderInfo?.id || '',
            id_return: temp_id,
          };
          break;
        case MessageType.ORDER:
          newMessage = {
            message: message,
            conversation_id: pageId,
            message_type: messageType,
            replied_message_id: repliedMessageId,

            sender_id: senderInfo?.id || '',
            id_return: temp_id,
          };
          break;
        case MessageType.PRODUCT:
          newMessage = {
            message: message,
            conversation_id: pageId,
            message_type: messageType,
            replied_message_id: repliedMessageId,
            sender_id: senderInfo?.id || '',
            id_return: temp_id,
          };
          break;
        default:
          break;
      }
      if (newMessage) {
        updateContentCacheConversation(
          {
            ...newMessage,
            status: 'unread',
            id: temp_id,
            updated_at: format(new Date(), 'yyyy-MM-ddTHH:mm:ss.000000+07:00'),
            localStatus: 'sending',
          },
          pageId,
        );
        try {
          const response = await mutateAsync(newMessage as ExpectedAny);
          if (response) {
            updateContentCacheConversation(response, pageId);
            updateCacheConversationList(response, { ...filter, pageIds }, pageId);
          } else {
            updateContentCacheConversation(
              {
                ...newMessage,
                status: 'unread',
                id: temp_id,
                updated_at: format(new Date(), 'yyyy-MM-ddTHH:mm:ss.000000+07:00'),
                localStatus: 'failed',
                id_return: temp_id,
              },
              pageId,
            );
          }
          setCurrentRepliedMessageContent(null);
        } catch (error) {
          updateContentCacheConversation(
            {
              ...newMessage,
              status: 'unread',
              id: temp_id,
              updated_at: format(new Date(), 'yyyy-MM-ddTHH:mm:ss.000000+07:00'),
              localStatus: 'failed',
              id_return: temp_id,
            },
            pageId,
          );
          setCurrentRepliedMessageContent(null);
        }
      }
    },
    [pageId, senderInfo, currentRepliedMessageContent, setCurrentRepliedMessageContent],
  );

  const otherParticipant = useMemo(() => {
    return getParticipant(currentConversation?.participants || [], false);
  }, [currentConversation]);

  // Contact detail
  const { data: contact, isError: isGetContactInChatError } = useGetContactInChatQuery(
    otherParticipant?.sender_id || '',
    otherParticipant?.sender_type || '',
  );
  // List contact delivering
  const { data: listContactDelivering } = useGetListContactDeliveringAddress(contact?.id || '');

  const showLabelSection = useMemo(() => {
    return isShowLabelSection(currentConversation?.type || '');
  }, [currentConversation, currentRepliedMessageContent]);

  const showInputSection = useMemo(() => {
    const isFbComment = isPostComment(currentConversation?.tag);
    if (isFbComment && !currentRepliedMessageContent) return false;
    return isShowInputSection(currentConversation?.type || '');
  }, [currentConversation, currentRepliedMessageContent]);

  const showMessageSuggest = useMemo(() => {
    return isShowMessageSuggest(currentConversation?.type || '') && senderInfo?.info?.full_name !== SUPPORT_NAME;
  }, [currentConversation]);

  const showDisabledMessage = useMemo(() => {
    return currentConversation?.tag === ConversationTag.FB_MESSAGE && currentConversation.pass_a_day;
  }, [currentConversation]);

  const showSideBar = useMemo(() => {
    if (currentConversation?.type === ConversationType.PRIVATE) return true;
    return false;
  }, [currentConversation]);

  useEffect(() => {
    if (currentConversation) {
      const message = location.state;
      if (message?.contentAutoSend) {
        handleSendMessage(message.contentAutoSend, MessageType.TEXT);
        navigate(location.pathname, { replace: true });
      }
    }
  }, [currentConversation]);

  useEffect(() => {
    setContactStore({
      contact,
      list_contact_delivering: listContactDelivering,
    });
    if (isGetContactInChatError) {
      setContactStore({
        contact: undefined,
        list_contact_delivering: undefined,
      });
    }
  }, [listContactDelivering, contact, isGetContactInChatError]);

  return (
    (pageId && (
      <div className="pw-flex">
        <div
          className={cx('pw-border pw-border-neutral-background pw-border-t-0 pw-border-b-0 ', {
            'pw-w-4/12': showOrderInChat,
            'pw-w-8/12': !showOrderInChat,
            'pw-w-full': !showSideBar,
          })}
        >
          <Header id={pageId} />
          <div className="pw-flex">
            <div className="pw-flex-1 pw-flex-col pw-flex pw-h-[calc(100vh-130px)]">
              {isPostComment(currentConversation?.tag) ? <PostComment id={pageId} /> : <Conversation id={pageId} />}
              {showMessageSuggest ? (
                <div className="pw-px-5 pw-py-3 pw-bg-neutral-gray-light">
                  <MessageSuggest onSendMessage={handleSendMessage} conversationType={currentConversation?.type} />
                </div>
              ) : null}
              <div
                className={cx({
                  'pw-px-5 pw-py-4': showLabelSection || showInputSection,
                })}
              >
                {showLabelSection ? <ChatLabels /> : null}
                {showDisabledMessage ? (
                  <DisabledMessage />
                ) : showInputSection ? (
                  <ChatInput onSendMessage={handleSendMessage} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {showOrderInChat ? (
          <OrderInChat className="pw-w-8/12" onSendMessage={handleSendMessage} />
        ) : showSideBar ? (
          <SideBar className="pw-w-4/12" />
        ) : null}
      </div>
    )) || <></>
  );
};

export default Details;
