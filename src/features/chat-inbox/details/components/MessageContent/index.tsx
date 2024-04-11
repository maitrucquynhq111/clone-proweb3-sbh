import cx from 'classnames';
import { useMemo, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
// import { Avatar } from 'rsuite';
import ReactionTag from './ReactionTag';
import ImageMessage from './ImageMessage';
import ProductMessage from './ProductMessage';
import OrderMessage from './OrderMessage';
import CardAssistanceMessage from './CardAssistanceMessage';
import ButtonMessage from './ButtonMessage';
import RepliedMessage from './RepliedMessage';
import { MessageType } from '~app/utils/constants';
import { MessageAction } from '~app/features/chat-inbox/details/components';
import { useCurrentConversation } from '~app/utils/hooks';
import { getParticipant, getParticipantBySenderId, isPostComment } from '~app/features/chat-inbox/utils';
import FormatedMessage from '~app/features/chat-inbox/details/components/FormatedMessage';
import ImageTextMessage from '~app/features/chat-inbox/details/components/ImageTextMessage';

type Props = {
  senderId: string;
  messageContent: MessageResponse;
  className?: string;
  converstationId: string;
};

// const defaultAvatarShop =
//   'https://d3hr4eej8cfgwy.cloudfront.net/v2/96x96/finan-dev/1d78990d-33ef-4278-94a9-881c7c57d4ae/image/default_avatar_shop.png';

const MessageContent = ({ senderId, messageContent, className, converstationId }: Props) => {
  const { t } = useTranslation('chat');
  const { currentConversation, setCurrentRepliedMessageContent } = useCurrentConversation();

  const getCurrentUserParticipantId = getParticipant(currentConversation?.participants || [], true)?.id;
  const reactionsNumber = messageContent.reactions?.length || 0;

  const isSender = useMemo(() => {
    return senderId === messageContent?.sender_id;
  }, [senderId, messageContent]);

  // const senderInfo = useMemo(() => {
  //   return getParticipant(currentConversation?.participants || [], true)?.info || null;
  // }, [senderId, messageContent]);

  const hasReaction = useMemo(() => {
    if (!messageContent.reactions) return false;
    return (
      messageContent.reactions.length > 0 &&
      messageContent.reactions.some((reaction) => reaction.participant_id === getCurrentUserParticipantId)
    );
  }, [messageContent.reactions, getCurrentUserParticipantId]);

  const hasRepliedMessage = useMemo(() => {
    if (!messageContent.replied_message) return false;
    return true;
  }, [messageContent.replied_message]);

  const handleClickReplied = useCallback(() => {
    const participant = getParticipantBySenderId(
      currentConversation?.participants || [],
      messageContent?.sender_id || '',
    );
    setCurrentRepliedMessageContent({
      ...messageContent,
      sender: participant,
    });
  }, [messageContent, setCurrentRepliedMessageContent]);

  const getSenderName = () => {
    if (messageContent?.sender_id !== getCurrentUserParticipantId) {
      const participant = getParticipantBySenderId(
        currentConversation?.participants || [],
        messageContent?.sender_id || '',
      );
      return participant?.info?.full_name;
    }
    return currentConversation?.page_name;
  };

  const showRepliedMessage = useMemo(() => {
    return hasRepliedMessage && !isPostComment(currentConversation?.tag);
  }, [messageContent.replied_message]);

  const showReactionTag = useMemo(() => {
    return reactionsNumber > 0 && !isPostComment(currentConversation?.tag);
  }, [messageContent.reactions]);

  const isSending = (messageContent as ExpectedAny)?.localStatus === 'sending';
  const isFailed = (messageContent as ExpectedAny)?.localStatus === 'failed';

  return (
    <div
      className={cx(
        'pw-flex pw-items-end pw-gap-x-2 pw-group/message',
        {
          'pw-justify-start': !isSender,
          'pw-justify-end': isSender,
          'pw-flex-col !pw-items-start pw-w-full': isPostComment(currentConversation?.tag),
        },
        className,
      )}
    >
      {!isPostComment(currentConversation?.tag) && isSender && !isSending && !isFailed ? (
        <MessageAction
          messageId={messageContent.id}
          participantId={getCurrentUserParticipantId}
          defaultHasReaction={hasReaction}
          converstationId={converstationId}
          onClickReplied={handleClickReplied}
          className="pw-invisible pw-select-none group-hover/message:pw-visible group-hover/message:pw-select-auto"
        />
      ) : null}
      {isSender && isSending && <div className="pw-text-xs pw-text-neutral-500">{t('sending')}</div>}
      {isSender && isFailed && <div className="pw-text-xs pw-text-red-500">{t('failed')}</div>}
      <div
        className={cx('pw-max-w-8/12 pw-rounded', {
          'pw-bg-neutral-divider': !isSender,
          'pw-bg-info-background': isSender,
          'pw-bg-transparent': messageContent.message_type === MessageType.CARDS_ASSISTANCE,
          'pw-opacity-40': isSending || isFailed,
          '!pw-bg-neutral-divider': isPostComment(currentConversation?.tag),
        })}
      >
        {/* {isSender && senderInfo ? (
          <h5 className="pw-text-xs pw-text-right pw-font-semibold pw-text-neutral-placeholder pw-pb-1 pw-bg-neutral-gray-light">
            {senderInfo.name}
          </h5>
        ) : null} */}
        {isPostComment(currentConversation?.tag) && (
          <p className="pw-text-sm pw-font-bold pw-text-neutral-primary pw-px-4 pw-pt-3 pw-pb-1">{getSenderName()}</p>
        )}
        {messageContent.message_type === MessageType.TEXT ? (
          <>
            {showRepliedMessage ? <RepliedMessage messageContent={messageContent} /> : null}
            <div
              className={cx('pw-text-base pw-text-neutral-primary pw-px-4', {
                'pw-py-3': !isPostComment(currentConversation?.tag),
                'pw-pb-3': isPostComment(currentConversation?.tag),
              })}
            >
              <FormatedMessage
                reactionTag={
                  showReactionTag && (
                    <ReactionTag
                      reactions={messageContent.reactions}
                      participants={currentConversation?.participants}
                    />
                  )
                }
                message={messageContent.message}
                isSender={isSender}
              />
            </div>
          </>
        ) : null}
        {messageContent.message_type === MessageType.IMAGE ? (
          <>
            {showRepliedMessage ? <RepliedMessage messageContent={messageContent} /> : null}
            <ImageMessage
              reactionTag={
                showReactionTag && (
                  <ReactionTag reactions={messageContent.reactions} participants={currentConversation?.participants} />
                )
              }
              message={messageContent.message}
            />
          </>
        ) : null}
        {messageContent.message_type === MessageType.IMAGE_TEXT ? (
          <>
            {showRepliedMessage ? <RepliedMessage messageContent={messageContent} /> : null}
            <ImageTextMessage
              reactionTag={
                showReactionTag && (
                  <ReactionTag reactions={messageContent.reactions} participants={currentConversation?.participants} />
                )
              }
              message={messageContent.message}
            />
          </>
        ) : null}
        {messageContent.message_type === MessageType.PRODUCT ? (
          <>
            {showRepliedMessage ? <RepliedMessage messageContent={messageContent} /> : null}
            <ProductMessage
              reactionTag={
                showReactionTag && (
                  <ReactionTag reactions={messageContent.reactions} participants={currentConversation?.participants} />
                )
              }
              participants={currentConversation?.participants || []}
              productId={messageContent.message}
            />
          </>
        ) : null}
        {messageContent.message_type === MessageType.CARDS_ASSISTANCE ? (
          <>
            {showRepliedMessage ? <RepliedMessage messageContent={messageContent} /> : null}
            <CardAssistanceMessage
              reactionTag={
                showReactionTag && (
                  <ReactionTag reactions={messageContent.reactions} participants={currentConversation?.participants} />
                )
              }
              message={messageContent.message}
              messageId={messageContent.id}
              senderId={senderId}
            />
          </>
        ) : null}
        {messageContent.message_type === MessageType.ORDER ? (
          <>
            {showRepliedMessage ? <RepliedMessage messageContent={messageContent} /> : null}
            <OrderMessage
              orderNumber={messageContent.message}
              reactionTag={
                showReactionTag && (
                  <ReactionTag reactions={messageContent.reactions} participants={currentConversation?.participants} />
                )
              }
              isSender={isSender}
            />
          </>
        ) : null}
        {messageContent.message_type === MessageType.BUTTON ? (
          <>
            {showRepliedMessage ? <RepliedMessage messageContent={messageContent} /> : null}
            <div className="pw-text-base pw-text-neutral-primary pw-py-3 pw-px-4">
              <ButtonMessage
                message={messageContent.message}
                reactionTag={
                  showReactionTag && (
                    <ReactionTag
                      reactions={messageContent.reactions}
                      participants={currentConversation?.participants}
                    />
                  )
                }
              />
            </div>
          </>
        ) : null}
      </div>
      {/* {isSender && senderInfo ? (
        <Avatar circle src={senderInfo?.avatar || defaultAvatarShop} alt={senderInfo?.name || 'avatar'} size="xs" />
      ) : null} */}
      {!isPostComment(currentConversation?.tag) && !isSender && !isSending && !isFailed ? (
        <MessageAction
          messageId={messageContent.id}
          participantId={getCurrentUserParticipantId}
          defaultHasReaction={hasReaction}
          converstationId={converstationId}
          onClickReplied={handleClickReplied}
          className="pw-invisible pw-select-none group-hover/message:pw-visible group-hover/message:pw-select-auto"
        />
      ) : null}
    </div>
  );
};

export default memo(MessageContent);
