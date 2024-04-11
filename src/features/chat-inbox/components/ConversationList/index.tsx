import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useEffect, memo, useCallback, useMemo } from 'react';
import orderBy from 'lodash/orderBy';
import ConversationItem from './ConversationItem';
import { useGetConversationListQuery } from '~app/services/queries';
import { useChatStore } from '~app/features/chat-inbox/hooks';
import { formatParams } from '~app/features/chat-inbox/utils';
import { ConversationType } from '~app/utils/constants';
import { ConfigPermission, useHasPermissions } from '~app/utils/shield';

const ConversationList = () => {
  const parentRef: ExpectedAny = useRef();
  const [filter] = useChatStore((store) => store.filter);
  const [pageIds] = useChatStore((store) => store.pageIds);
  const canChatAssistant = useHasPermissions([ConfigPermission.SBH_ASSISTANT_CHAT_VIEW]);
  const canChatSupporter = useHasPermissions([ConfigPermission.SBH_ASSISTANT_CHAT_VIEW]);

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetConversationListQuery({
    sender_type: 'business',
    name: filter.name,
    status: filter.status,
    page_ids: pageIds.join(','),
    label_ids: formatParams({ key: 'label_ids', filter }),
    tag: formatParams({ key: 'tag', filter }),
    ...formatParams({ key: 'dateRange', filter }),
  });

  const allRows = useMemo(() => {
    if (!data) return [];
    let list = data.pages
      .flatMap((d) => d.data)
      .filter((conversation) => conversation.type !== ConversationType.NOTIFICATION);
    const notiConversation = data.pages
      .flatMap((d) => d.data)
      .find((conversation) => conversation.type === ConversationType.NOTIFICATION);
    list = orderBy(list, 'latest_message.created_at', 'desc') as Conversation[];
    // Check have assistant permission and remove
    if (!canChatAssistant) list = list.filter((item) => item.type !== ConversationType.ASSISTANT);
    // Check have support permission and remove
    if (!canChatSupporter) list = list.filter((item) => item.type !== ConversationType.SUPPORT);
    // stick noti conversation to top then new conversation after it
    if (notiConversation) list.unshift(notiConversation);
    return list;
  }, [data]);

  const rowVirtualizer: ExpectedAny = useVirtualizer({
    count: hasNextPage ? allRows?.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 86, []),
    overscan: 10,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    if (!lastItem) {
      return;
    }
    if (lastItem.index >= allRows.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, allRows.length, isFetchingNextPage, rowVirtualizer.getVirtualItems()]);

  return (
    <div className="pw-h-[calc(100vh-260px)] pw-overflow-auto" ref={parentRef}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
        className="pw-w-full pw-relative"
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow: ExpectedAny) => {
          const isLoaderRow = virtualRow.index > allRows.length - 1;
          const conversation = allRows[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              className="pw-absolute pw-top-0 pw-left-0 pw-w-full"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {isLoaderRow ? (
                hasNextPage ? (
                  <div className="pw-p-3 pw-text-center">Loading...</div>
                ) : (
                  <></>
                )
              ) : (
                <ConversationItem data={conversation} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(ConversationList);
