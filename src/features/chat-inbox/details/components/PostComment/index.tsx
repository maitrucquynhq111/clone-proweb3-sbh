import cx from 'classnames';
import { useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Loading, PlaceholderImage } from '~app/components';
import { MessageContent, PostInfo, CommentAction } from '~app/features/chat-inbox/details/components';
import { useCurrentConversation } from '~app/utils/hooks';
import { getParticipant, arrangeCommentReplies, getParticipantBySenderId } from '~app/features/chat-inbox/utils';
import { useGetConversationContentQuery, useConversationDetailQuery } from '~app/services/queries';
import { isLocalImage, revokeObjectUrl } from '~app/utils/helpers';

type Props = {
  id: string;
};

const itemSize = 120;

const PostComment = ({ id }: Props) => {
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

  const currentUserParticipantId = getParticipant(currentConversation?.participants || [], true)?.id;

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
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse();
    if (!lastItem) return;
    if (lastItem.index >= messageResponses.length - 1 && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage, virtualizer.getVirtualItems()]);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      const currentTarget = e.currentTarget as HTMLElement;

      if (currentTarget) {
        currentTarget.scrollTop += e.deltaY;
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
    setMessageResponses(arrangeCommentReplies(allRows.reverse()));
  }, [setMessageResponses, allRows]);

  const handleGetAvatar = (senderId: string) => {
    const senderInfo = (currentConversation?.participants || []).find((participant) => participant.id === senderId);
    return senderId !== currentUserParticipantId ? senderInfo?.info?.avatar : currentConversation?.page_avatar;
  };

  const handleClickReplied = useCallback(
    (messageContent: MessageResponse) => {
      const participant = getParticipantBySenderId(
        currentConversation?.participants || [],
        messageContent?.sender_id || '',
      );
      setCurrentRepliedMessageContent({
        ...messageContent,
        sender: participant,
      });
    },
    [setCurrentRepliedMessageContent],
  );

  return (
    <>
      {currentConversation && <PostInfo currentConversation={currentConversation} refetch={refetch} />}
      <div
        ref={parentRef}
        className="pw-flex-1 pw-bg-neutral-gray-light pw-px-5 pw-overflow-auto pw-w-full pw-scale-y-100 scrollbar-sm"
      >
        {isLoading || (isFetching && !isFetchingNextPage) ? (
          <div className="pw-h-96 pw-w-full pw-flex pw-items-center pw-justify-center pw-scale-y-100">
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
                transform: `translateY(16px)`,
              }}
            >
              {items.map((virtualRow: ExpectedAny) => {
                const index = reverseIndex(virtualRow.index);
                const messageContent: MessageResponse | undefined = messageResponses[virtualRow.index];
                const reactionsNumber = messageContent?.reactions?.length || 0;
                const hasReaction =
                  reactionsNumber > 0 &&
                  messageContent?.reactions?.some((reaction) => reaction.participant_id === currentUserParticipantId);

                return (
                  <div className="pw-flex pw-flex-col pw-pb-3">
                    <div
                      key={messageContent?.id}
                      className={cx('pw-flex pw-gap-x-2 pw-w-full pw-scale-y-100 pw-mb-2', {
                        'pw-pt-3': index === 0,
                      })}
                      ref={virtualRow.measureElement}
                      data-index={virtualRow.index}
                      data-reverse-index={index}
                    >
                      {messageContent?.replied_message_id && <div className="pw-w-6" />}
                      <PlaceholderImage
                        className="!pw-w-6 !pw-h-6 pw-bg-white pw-rounded-full"
                        isAvatar={true}
                        src={handleGetAvatar(messageContent?.sender_id || '')}
                      />
                      {messageContent ? (
                        <MessageContent converstationId={id} senderId={senderId} messageContent={messageContent} />
                      ) : null}
                    </div>
                    {messageContent ? (
                      <CommentAction
                        messageContent={messageContent}
                        defaultHasReaction={hasReaction}
                        participantId={currentUserParticipantId}
                        conversationId={id}
                        onClickReplied={handleClickReplied}
                      />
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

export default memo(PostComment);
