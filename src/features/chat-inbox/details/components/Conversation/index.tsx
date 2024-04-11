import cx from 'classnames';
import { useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Loading } from '~app/components';
import {
  FinanceNotificationMessage,
  MessageContent,
  NotificationMessage,
  OrderNotificationMessage,
  FbPageInfo,
} from '~app/features/chat-inbox/details/components';
import { useCurrentConversation } from '~app/utils/hooks';
import { getParticipant } from '~app/features/chat-inbox/utils';
import { ConversationType, MessageType, ConversationTag } from '~app/utils/constants';
import { useGetConversationContentQuery, useConversationDetailQuery } from '~app/services/queries';
import { isLocalImage, revokeObjectUrl } from '~app/utils/helpers';

type Props = {
  id: string;
};

const itemSize = 120;

const Conversation = ({ id }: Props) => {
  const parentRef = useRef<ExpectedAny>(null);
  const {
    setSelectedImages,
    messageResponses,
    currentConversation,
    setCurrentConversation,
    setMessageResponses,
    setCurrentRepliedMessageContent,
  } = useCurrentConversation();
  const { data: conversation } = useConversationDetailQuery(id);

  const { status, data, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading, isFetching, refetch } =
    useGetConversationContentQuery(id);

  const senderId = useMemo(() => {
    if (!currentConversation) return '';
    return getParticipant(currentConversation?.participants || [], true)?.id || '';
  }, [currentConversation]);

  const allRows = useMemo(() => {
    return data ? data.pages.flatMap((d) => d.data) : [];
  }, [data]);

  // virtualizer logic

  const count = useMemo(() => {
    return messageResponses.length;
  }, [messageResponses]);

  const reverseIndex = useCallback((index: number) => count - 1 - index, [count]);

  const virtualizer: ExpectedAny = useVirtualizer({
    count,
    estimateSize: useCallback(() => itemSize, []),
    getScrollElement: () => parentRef.current,
    overscan: 20,
    scrollMargin: 5,
  });

  const items = virtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse();
    if (!lastItem) return;
    if (lastItem.index >= messageResponses.length - 1 && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage, virtualizer.getVirtualItems()]);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      const currentTarget = e.currentTarget as HTMLElement;

      if (currentTarget) {
        currentTarget.scrollTop -= e.deltaY;
      }
    };
    parentRef.current?.addEventListener('wheel', handleScroll, {
      passive: false,
    });
    return () => {
      parentRef.current?.removeEventListener('wheel', handleScroll);
    };
  }, [status]);

  useEffect(() => {
    if (!conversation) return;
    setCurrentConversation(conversation);
    // Revoke url and reset selected image when change conversation
    setSelectedImages((prevState) => {
      prevState.forEach((image) => {
        if (isLocalImage(image)) {
          revokeObjectUrl(image?.url);
        }
      });
      return [];
    });
    setCurrentRepliedMessageContent(null);
  }, [conversation, setSelectedImages, setCurrentConversation, setCurrentRepliedMessageContent]);

  useEffect(() => {
    setMessageResponses(allRows);
  }, [setMessageResponses, allRows]);

  return (
    <>
      {currentConversation?.tag === ConversationTag.FB_MESSAGE && (
        <FbPageInfo currentConversation={currentConversation} refetch={refetch} />
      )}
      <div
        ref={parentRef}
        className="pw-flex-1 pw-bg-neutral-gray-light pw-px-5 pw-overflow-auto pw-w-full -pw-scale-y-100 scrollbar-sm"
      >
        {isLoading || (isFetching && !isFetchingNextPage) ? (
          <div className="pw-h-96 pw-w-full pw-flex pw-items-center pw-justify-center -pw-scale-y-100">
            <Loading />
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${items?.[0]?.start}px)`,
              }}
            >
              {items.map((virtualRow: ExpectedAny) => {
                const index = reverseIndex(virtualRow.index);
                const messageContent: MessageResponse | undefined = messageResponses[virtualRow.index];
                return (
                  <div
                    key={messageContent?.id}
                    className={cx('pw-pb-3 pw-w-full -pw-scale-y-100', {
                      'pw-pt-3': index === 0,
                    })}
                    ref={virtualRow.measureElement}
                    data-index={virtualRow.index}
                    data-reverse-index={index}
                  >
                    {messageContent && messageContent?.message_type !== MessageType.NOTIFICATION ? (
                      <MessageContent converstationId={id} senderId={senderId} messageContent={messageContent} />
                    ) : null}
                    {messageContent && currentConversation?.type === ConversationType.ORDER ? (
                      <OrderNotificationMessage messageContent={messageContent} />
                    ) : null}
                    {messageContent && currentConversation?.type === ConversationType.NOTIFICATION ? (
                      <NotificationMessage messageContent={messageContent} />
                    ) : null}
                    {messageContent && currentConversation?.type === ConversationType.FINANCE ? (
                      <FinanceNotificationMessage messageContent={messageContent} />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default memo(Conversation);
