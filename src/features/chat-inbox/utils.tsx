/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ConversationTabEnum } from './components/ConversationTab';
import { AuthService } from '~app/services/api';
import { ChatChannel, ChatStatus, ConversationType, ConversationTag } from '~app/utils/constants';
import { CONVERSATIONS_DEFAULT_KEY, CONVERSATION_CONTENT_KEY, CONVERSATION_LIST_KEY } from '~app/services/queries';
import { queryClient } from '~app/configs/client';
import { convertDateFilter } from '~app/utils/helpers';

export function getParticipant(participants: Participant[], isMe?: boolean) {
  const businessId = AuthService.getBusinessId();
  if (isMe) {
    return participants.find((participant) => participant.sender_id === businessId)!;
  }
  return participants.find((participant) => participant.sender_id !== businessId)!;
}

export const getOtherParticipant = ({ participants }: { participants: Participant[] }) => {
  const businessId = AuthService.getBusinessId();
  const otherParticipant = participants.find((participant) => participant.sender_id !== businessId)!;
  return otherParticipant;
};

export function getParticipantBySenderId(participants: Participant[], senderId: string) {
  return participants.find((participant) => participant.id === senderId);
}

export const getRepliedMessageId = ({
  currentConversation,
  currentRepliedMessageContent,
}: {
  currentConversation?: Conversation | null;
  currentRepliedMessageContent: MessageResponse | null;
}) => {
  /**  get replied_message_id of fb_comment */
  if (isPostComment(currentConversation?.tag) && currentRepliedMessageContent) {
    return currentRepliedMessageContent.replied_message_id
      ? currentRepliedMessageContent.replied_message_id
      : currentRepliedMessageContent.id;
  }
  // if currentRepliedMessageContent=null => get id of latest_message
  if (isPostComment(currentConversation?.tag) && !currentRepliedMessageContent) {
    return currentConversation?.latest_message.replied_message_id
      ? currentConversation.latest_message.replied_message_id
      : currentConversation?.latest_message.id;
  }
  return currentRepliedMessageContent?.id || null;
};

export const checkIsMyLatestMessage = (latestMessage: LatestMessage) => {
  const businessId = AuthService.getBusinessId();
  return businessId === latestMessage.sender?.info?.id || '';
};

export const checkIsConversationDefault = (type: string) => {
  if (
    type === ConversationType.ASSISTANT ||
    type === ConversationType.NOTIFICATION ||
    type === ConversationType.ORDER ||
    type === ConversationType.FINANCE
  )
    return true;
  return false;
};

export const formatParams = ({ key, filter }: { key: string; filter: ChatFilter }) => {
  if (key === 'dateRange') {
    return convertDateFilter(filter.dateRange);
  }
  const result = (filter as ExpectedAny)[key].map((item: ExpectedAny) => {
    const parseItem = JSON.parse(item);
    return parseItem.value;
  });
  return result.join(',');
};

export const checkTabIncludesFilter = ({ tab, filterData }: { tab: string; filterData: ChatFilter }) => {
  if (tab === ConversationTabEnum.MESSAGES) {
    let count = 0;
    filterData.tag.map((tag: string) => {
      const parseTag = JSON.parse(tag);
      if (parseTag.value === ChatChannel.MESSENGER || parseTag.value === ChatChannel.STORE) {
        count += 1;
      }
    });
    if (count === 0) return false;
    return true;
  }
  if (tab === ConversationTabEnum.COMMENT) {
    // TO DO
  }
};

export const initialChat = () => ({
  tab: ConversationTabEnum.ALL,
  pageIds: [],
  filter: {
    name: '',
    status: ChatStatus.ALL,
    tag: [],
    label_ids: [],
    dateRange: [],
  },
  showOrderInChat: false,
});

export const updateContentCacheConversation = (data: ExpectedAny, conversationId?: string) => {
  if (conversationId) {
    queryClient.setQueryData<Conversation>([CONVERSATION_CONTENT_KEY, conversationId], (oldData: ExpectedAny) => {
      const converstations: ExpectedAny = queryClient.getQueryData([CONVERSATION_CONTENT_KEY, conversationId]);
      const flattenConverstations = (converstations?.pages || []).flatMap((d: ExpectedAny) => d.data);

      const isExist = flattenConverstations.find(
        (item: ExpectedAny) => (data?.message_id && item.id === data.message_id) || item.id === data.id,
      );
      const newData = isExist
        ? {
            ...oldData,
            pages: (oldData?.pages || []).map((page: ExpectedAny) => {
              const pageData = page.data.map((item: ExpectedAny) => {
                const isExistReaction =
                  data.message_id === item.id &&
                  (item?.reactions || []).find(
                    (reaction: ExpectedAny) =>
                      reaction?.type === data?.react_type && reaction.participant_id === data?.participant_id,
                  );

                return item.id === data.message_id && data?.react_type
                  ? {
                      ...item,
                      reactions: isExistReaction
                        ? item.reactions.filter((react: ExpectedAny) => react.participant_id !== data.participant_id)
                        : [
                            ...(item?.reactions || []),
                            {
                              ...data,
                              type: data.react_type,
                            },
                          ],
                    }
                  : item.id === data.id
                  ? {
                      ...item,
                      ...data,
                    }
                  : item;
              });
              return {
                ...page,
                data: pageData,
              };
            }),
          }
        : {
            ...oldData,
            pages: (oldData?.pages || []).map((page: ExpectedAny, index: number) => {
              if (index === 0) {
                const isExistTempMessage = page.data.find(
                  (item: ExpectedAny) => item?.id && item.id === data.id_return,
                );
                return {
                  ...page,
                  data: isExistTempMessage
                    ? page.data.map((i: ExpectedAny) => {
                        return i.id === data.id_return ? data : i;
                      })
                    : [data, ...page.data],
                };
              }
              return page;
            }),
          };
      return newData;
    });
  }
};

export const updateCacheConversationList = (
  data: ExpectedAny,
  filter: ChatFilter & {
    pageIds: string[];
  },
  currentActivePageId?: string,
) => {
  const currentFilter = {
    sender_type: 'business',
    name: filter.name,
    status: filter.status,
    page_ids: filter.pageIds.join(','),
    label_ids: formatParams({ key: 'label_ids', filter }),
    tag: formatParams({ key: 'tag', filter }),
    ...formatParams({ key: 'dateRange', filter }),
  };

  if (!data?.react_type) {
    const converstations: ExpectedAny = queryClient.getQueryData([CONVERSATION_LIST_KEY, currentFilter]);
    const flattenConverstations = (converstations?.pages || []).flatMap((d: ExpectedAny) => d.data);
    const isExist = flattenConverstations.find((item: ExpectedAny) => item.id === data.conversation_id);
    if (isExist) {
      queryClient.setQueryData<Conversation>([CONVERSATION_LIST_KEY, currentFilter], (oldData: ExpectedAny) => {
        const newData = {
          ...oldData,
          pages: (oldData?.pages || []).map((page: ExpectedAny) => {
            const pageData = page.data.map((item: ExpectedAny) => {
              return item.id === data.conversation_id
                ? {
                    ...item,
                    latest_message: data,
                    latest_message_id: data.id,
                    updated_at: data?.updated_at || data?.created_at,
                    unseen_message: item.id === currentActivePageId ? 0 : item.unseen_message + 1,
                    pass_a_day: false,
                  }
                : item;
            });
            return {
              ...page,
              data: pageData,
            };
          }),
        };
        return newData;
      });
    } else {
      queryClient.refetchQueries([CONVERSATION_LIST_KEY, currentFilter]);
    }
  }
};

export const updateCacheConversationDefaultList = (data: ExpectedAny, conversationId?: string) => {
  if (!data?.react_type) {
    const converstationsDefault: ExpectedAny = queryClient.getQueryData([CONVERSATIONS_DEFAULT_KEY]);
    const isExist = converstationsDefault.find(
      (conversation: ExpectedAny) => conversation.id === data.conversation_id || conversation.id === data.id,
    );
    if (isExist) {
      queryClient.setQueryData<Conversation>([CONVERSATIONS_DEFAULT_KEY], (oldData: ExpectedAny) => {
        return oldData.map((conversation: ExpectedAny) => {
          const newConversation = { ...conversation };
          if (conversation.type === data.conversation_type || conversation.type === data.type) {
            newConversation.unseen_message = conversation.id === conversationId ? 0 : conversation.unseen_message + 1;
          }
          return newConversation;
        });
      });
    }
  }
};

export function isConversationDefault(conversationType: string) {
  if (!conversationType) return false;
  if (
    conversationType === ConversationType.ASSISTANT ||
    conversationType === ConversationType.FINANCE ||
    conversationType === ConversationType.SUPPORT ||
    conversationType === ConversationType.NOTIFICATION ||
    conversationType === ConversationType.ORDER
  )
    return conversationType;
}

export function isShowLabelSection(conversationType: string) {
  switch (conversationType) {
    case ConversationType.ASSISTANT:
    case ConversationType.FINANCE:
    case ConversationType.SUPPORT:
    case ConversationType.NOTIFICATION:
    case ConversationType.ORDER:
      return false;
    default:
      return true;
  }
}

export function isShowInputSection(conversationType: string) {
  switch (conversationType) {
    case ConversationType.FINANCE:
    case ConversationType.NOTIFICATION:
    case ConversationType.ORDER:
      return false;
    default:
      return true;
  }
}

export function isShowMessageSuggest(conversationType: string) {
  switch (conversationType) {
    case ConversationType.GROUP:
    case ConversationType.PRIVATE:
    case ConversationType.ORDER:
    case ConversationType.NOTIFICATION:
    case ConversationType.FINANCE:
      return false;
    default:
      return true;
  }
}

export function isPostComment(conversationTag?: string) {
  if (!conversationTag) return false;
  if (conversationTag === ConversationTag.FB_COMMENT) return true;
}

export function arrangeCommentReplies(listComment: Array<MessageResponse>) {
  const listParentCmt = listComment.filter((cmt) => !cmt.replied_message_id);
  let total: Array<MessageResponse> = [];
  listParentCmt.forEach((item) => {
    const childCmt = listComment.filter((child) => child.replied_message_id === item.id);
    total = [item, ...childCmt, ...total];
  });
  return total;
}

export function getPostId(currentConversation: Conversation) {
  const indexConversationArr = currentConversation.index.split('|');
  const pageMetaId = (indexConversationArr || []).find((item) => item.startsWith('post'));
  return pageMetaId ? pageMetaId.split(':')[1] : '';
}

export function isScrolledIntoView(parentElement: ExpectedAny, childElement: HTMLElement) {
  const scrollTop = parentElement.scrollTop;
  const scrollBottom = scrollTop + parentElement.clientHeight;

  const elemTop = childElement.offsetTop;
  const elemBottom = elemTop + childElement.clientHeight;

  return elemBottom < scrollBottom && elemTop > scrollTop;
}
